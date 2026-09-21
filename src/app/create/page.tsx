"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Send, Image as ImageIcon, Type, User } from "lucide-react";

export default function CreatePost() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
    author: "Citizen Journalist", // default to Citizen Journalist
    category: "",
    district: "",
  });

  useEffect(() => {
    const auth = localStorage.getItem("userAuth");
    if (!auth) {
      router.push("/login");
    } else {
      const user = JSON.parse(auth);
      setFormData(prev => ({ ...prev, author: user.email }));
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to publish post");
      }

      let finalVideoUrl = formData.videoUrl;

      if (formData.videoType === "upload" && videoFile) {
        setUploadProgress(10); // Start
        finalVideoUrl = await uploadToBlob(videoFile);
        setUploadProgress(100);
      }

      // We would hit the actual API here with the user's secure JWT cookie
      // Example: POST /api/posts { ...formData, videoUrl: finalVideoUrl }
      
      // Simulate success
      setTimeout(() => {
        setSuccess(true);
        setIsSubmitting(false);
      }, 1000);

    } catch (err: any) {
      setError(err.message || "Failed to submit news. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto mt-12 p-8 bg-surface border border-border-subtle rounded-xl text-center shadow-sm">
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
            onClick={() => { setSuccess(false); setFormData({ title: "", content: "", category: "", district: "", imageUrl: "", videoType: "none", videoUrl: "" }); setVideoFile(null); }}
            className="px-6 py-2.5 bg-navy text-white font-medium rounded hover:bg-slate-800 transition-colors"
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-8 mb-20 px-4">
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

          <div>
            <label htmlFor="title" className="block text-sm font-bold text-navy mb-2 uppercase tracking-wide">
              Headline
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded border border-border-subtle focus:ring-1 focus:ring-navy focus:border-navy transition-colors bg-white font-serif text-lg placeholder:font-sans placeholder:text-sm"
              placeholder="Enter the main headline..."
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-bold text-navy mb-2 uppercase tracking-wide">
              News Content
            </label>
            <textarea
              id="content"
              name="content"
              required
              rows={8}
              value={formData.content}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded border border-border-subtle focus:ring-1 focus:ring-navy focus:border-navy transition-colors bg-white resize-y leading-relaxed"
              placeholder="Write the full news story here..."
            />
          </div>

          <div>
            <label htmlFor="imageUrl" className="flex items-center gap-2 text-sm font-bold text-navy mb-2 uppercase tracking-wide">
              Cover Image URL (Optional)
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded border border-border-subtle focus:ring-1 focus:ring-navy focus:border-navy transition-colors bg-white text-sm"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label htmlFor="author" className="block text-sm font-bold text-navy mb-2 uppercase tracking-wide">
              Source / Contributor (Optional)
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded border border-border-subtle focus:ring-1 focus:ring-navy focus:border-navy transition-colors bg-white text-sm"
              placeholder="Citizen Journalist / Admin"
            />
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border-subtle flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 bg-navy hover:bg-slate-800 text-white px-8 py-3 rounded text-sm font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Submit for Review"}
            {!isSubmitting && <Send className="w-4 h-4 ml-1" />}
          </button>
        </div>
      </form>
    </div>
  );
}
