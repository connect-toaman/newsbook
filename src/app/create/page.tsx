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

      router.push("/");
      router.refresh();
    } catch (err) {
      setError("An error occurred while submitting the story. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-8 border-b border-border-subtle pb-6">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-navy">
          Create News
        </h1>
        <p className="mt-2 text-text-secondary text-sm">
          Submit breaking news, stories, and updates. All submissions are subject to editorial review.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface p-6 sm:p-8 rounded-xl border border-border-subtle">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-brand-red rounded text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        <div className="space-y-6">
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
