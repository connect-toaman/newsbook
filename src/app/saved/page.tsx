"use client";

import { useState, useEffect } from "react";
import PostCard, { PostProps } from "@/components/PostCard";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function SavedPosts() {
  const [savedPosts, setSavedPosts] = useState<PostProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSavedPosts = async () => {
      const savedIds = JSON.parse(localStorage.getItem("savedPosts") || "[]");
      
      if (savedIds.length === 0) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/posts/bulk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: savedIds }),
        });

        if (response.ok) {
          const data = await response.json();
          setSavedPosts(data);
        }
      } catch (error) {
        console.error("Failed to fetch saved posts", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedPosts();
  }, []);

  return (
    <div className="w-full">
      <div className="mb-10 border-b border-border-subtle pb-6">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-navy">
          Saved News
        </h1>
        <p className="mt-2 text-text-secondary text-sm">
          Your personal collection of bookmarked stories.
        </p>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-text-secondary">
            <Loader2 className="w-6 h-6 animate-spin mb-4 text-navy" />
            <p className="text-sm">Loading your saved stories...</p>
          </div>
        ) : savedPosts.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center py-24 text-center">
            <h2 className="font-serif text-2xl font-bold text-navy mb-3">No saved stories</h2>
            <p className="text-text-secondary text-sm mb-6 max-w-sm">
              You haven't bookmarked any articles yet. Discover news on the feed and save them to read later.
            </p>
            <Link 
              href="/"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-surface border border-border-subtle text-navy text-sm font-medium rounded hover:bg-slate-50 transition-colors"
            >
              Explore Latest News
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             {savedPosts.map((post) => (
               <PostCard key={post.id} post={post} />
             ))}
          </div>
        )}
      </div>
    </div>
  );
}
