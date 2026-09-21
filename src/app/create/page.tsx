"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, Video, AlertCircle, CheckCircle2, Image as ImageIcon, Send } from "lucide-react";

import { CATEGORIES, BIHAR_DISTRICTS } from "@/lib/constants";

const getYoutubeVideoId = (url: string) => {
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export default function CreateNews() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    district: "",
    imageUrl: "",
    videoType: "none",
    videoUrl: "",
    author: "",
  });

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    // Optionally we could fetch /api/auth/session here if needed,
    // but the backend fully protects the POST route now.
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "videoUrl") {
      const videoId = getYoutubeVideoId(value);
      if (videoId) {
        setFormData(prev => ({ 
          ...prev, 
          [name]: value,
          imageUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
        }));
        return;
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 50 * 1024 * 1024) {
        setError("Video file is too large (max 50MB)");
        return;
      }
      setVideoFile(file);
      setError("");
    }
  };

  const uploadToBlob = async (file: File): Promise<string> => {
    try {
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: "POST",
        body: file,
      });
      
      const newBlob = await response.json();
      if (!response.ok) throw new Error(newBlob.error || "Upload failed");
      
      return newBlob.url;
    } catch (err: any) {
      throw new Error("Failed to upload video: " + err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      let finalVideoUrl = formData.videoUrl;
      let finalImageUrl = formData.imageUrl;

      if (formData.videoType === "upload" && videoFile) {
        setUploadProgress(10);
        finalVideoUrl = await uploadToBlob(videoFile);
        setUploadProgress(100);
      }

      // Automatically generate YouTube thumbnail if none provided
      if (!finalImageUrl && finalVideoUrl) {
        const yId = getYoutubeVideoId(finalVideoUrl);
        if (yId) {
          finalImageUrl = `https://img.youtube.com/vi/${yId}/hqdefault.jpg`;
        }
      }

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          imageUrl: finalImageUrl,
          videoUrl: finalVideoUrl,
          authorName: formData.author,
          category: formData.category,
          district: formData.district,
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to submit post");
      }

      setSuccess(true);
      setIsSubmitting(false);

    } catch (err: any) {
      setError(err.message || "Failed to submit news. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-7xl mx-auto mt-12 p-8 bg-surface border border-border-subtle rounded-xl text-center shadow-sm">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="text-2xl font-serif font-bold text-navy mb-4">News Submitted for Review</h2>
        <p className="text-text-secondary mb-8">
          Thank you for your contribution. Your article is now pending editorial review and will be published once approved by the administration.
        </p>
        <div className="flex justify-center gap-4">
          <button 
            onClick={() => router.push("/profile")}
            className="px-6 py-2.5 border border-border-subtle text-navy font-medium rounded hover:bg-slate-50 transition-colors"
          >
            View My Submissions
          </button>
          <button 
            onClick={() => { setSuccess(false); setFormData(prev => ({ ...prev, title: "", content: "", category: "", district: "", imageUrl: "", videoType: "none", videoUrl: "", author: "" })); setVideoFile(null); }}
            className="px-6 py-2.5 bg-navy text-white font-medium rounded hover:bg-slate-800 transition-colors"
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto mt-8 mb-20">
      <div className="mb-8 border-b border-border-subtle pb-6">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-navy">
          Submit News Report
        </h1>
        <p className="mt-2 text-text-secondary">
          Your submission will be attached to your verified contributor profile.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-surface p-6 sm:p-8 rounded-xl border border-border-subtle shadow-sm">
        
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-brand-red rounded-lg flex gap-3 text-sm font-medium">
            <AlertCircle size={20} className="shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-5">
          <h3 className="font-bold text-navy uppercase tracking-wide text-sm border-b border-border-subtle pb-2">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="author" className="block text-sm font-bold text-navy mb-1.5">Your Name (Reporter Name) *</label>
              <input
                type="text"
                id="author"
                name="author"
                required
                value={formData.author}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded border border-border-subtle focus:ring-1 focus:ring-navy focus:border-navy bg-white"
                placeholder="e.g. Rahul Kumar"
              />
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-bold text-navy mb-1.5">Headline / Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded border border-border-subtle focus:ring-1 focus:ring-navy focus:border-navy bg-white"
                placeholder="Enter a clear, descriptive headline"
              />
            </div>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-bold text-navy mb-1.5">Full News Content *</label>
            <textarea
              id="content"
              name="content"
              required
              rows={8}
              value={formData.content}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded border border-border-subtle focus:ring-1 focus:ring-navy focus:border-navy bg-white"
              placeholder="Write the full details of the report here..."
            />
          </div>
        </div>

        <div className="space-y-5">
          <h3 className="font-bold text-navy uppercase tracking-wide text-sm border-b border-border-subtle pb-2">Categorization</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="category" className="block text-sm font-bold text-navy mb-1.5">Category *</label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded border border-border-subtle focus:ring-1 focus:ring-navy bg-white"
              >
                <option value="" disabled>Select a category</option>
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            
            <div>
              <label htmlFor="district" className="block text-sm font-bold text-navy mb-1.5">District (Bihar) *</label>
              <select
                id="district"
                name="district"
                required
                value={formData.district}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded border border-border-subtle focus:ring-1 focus:ring-navy bg-white"
              >
                <option value="" disabled>Select a district</option>
                {BIHAR_DISTRICTS.map(dist => <option key={dist} value={dist}>{dist}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <h3 className="font-bold text-navy uppercase tracking-wide text-sm border-b border-border-subtle pb-2">Media Attachments</h3>
          
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-bold text-navy mb-1.5">Featured Image URL (Optional)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ImageIcon size={18} className="text-slate-400" />
              </div>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded border border-border-subtle focus:ring-1 focus:ring-navy bg-white text-sm"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            {formData.imageUrl && (
              <div className="mt-3 relative w-full h-48 bg-slate-100 rounded-lg overflow-hidden border border-border-subtle">
                <img src={formData.imageUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="pt-2">
            <label className="block text-sm font-bold text-navy mb-3">Video Attachment (Optional)</label>
            <div className="flex flex-wrap gap-4 mb-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="radio" name="videoType" value="none" checked={formData.videoType === "none"} onChange={handleChange} className="text-navy focus:ring-navy" />
                No Video
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="radio" name="videoType" value="url" checked={formData.videoType === "url"} onChange={handleChange} className="text-navy focus:ring-navy" />
                Video URL (YouTube/External)
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="radio" name="videoType" value="upload" checked={formData.videoType === "upload"} onChange={handleChange} className="text-navy focus:ring-navy" />
                Upload Local Video
              </label>
            </div>

            {formData.videoType === "url" && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Video size={18} className="text-slate-400" />
                </div>
                <input
                  type="url"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded border border-border-subtle focus:ring-1 focus:ring-navy bg-white text-sm"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            )}

            {formData.videoType === "upload" && (
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-lg p-6 text-center">
                <input 
                  type="file" 
                  accept="video/mp4,video/webm,video/ogg" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                />
                
                {videoFile ? (
                  <div className="flex flex-col items-center gap-2">
                    <Video className="text-navy mb-2" size={32} />
                    <p className="font-medium text-sm text-navy">{videoFile.name}</p>
                    <p className="text-xs text-text-secondary">{(videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                    <button 
                      type="button" 
                      onClick={() => setVideoFile(null)}
                      className="mt-2 text-xs font-bold text-brand-red hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <Upload className="text-slate-400 mb-1" size={32} />
                    <div>
                      <p className="text-sm font-medium text-navy">Click to upload or drag and drop</p>
                      <p className="text-xs text-text-secondary mt-1">MP4, WebM up to 50MB</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-2 px-4 py-2 bg-white border border-border-subtle rounded text-sm font-medium text-navy hover:bg-slate-50 transition-colors"
                    >
                      Select File
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="pt-6 border-t border-border-subtle flex items-center justify-between">
          <p className="text-xs text-text-secondary">
            By submitting, you confirm this report adheres to our editorial guidelines.
          </p>
          <button
            type="submit"
            disabled={isSubmitting || (formData.videoType === "upload" && !videoFile)}
            className="flex items-center gap-2 bg-navy hover:bg-slate-800 text-white px-8 py-3 rounded text-sm font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (uploadProgress > 0 && uploadProgress < 100 ? "Uploading Video..." : "Submitting...") : "Submit for Review"}
            {!isSubmitting && <Send className="w-4 h-4 ml-1" />}
          </button>
        </div>
      </form>
    </div>
  );
}
