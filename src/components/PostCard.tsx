"use client";

import { useState, useEffect } from "react";
import { Heart, Bookmark, Share2 } from "lucide-react";

export type PostProps = {
  id: string;
  title: string;
  content: string;
  imageUrl?: string | null;
  author: string;
  likesCount: number;
  sharesCount: number;
  createdAt: Date;
};

// Use an interface for props when there might be layout variations
interface PostCardProps {
  post: PostProps;
  featured?: boolean;
}

export default function PostCard({ post, featured = false }: PostCardProps) {
  const [likes, setLikes] = useState(post.likesCount);
  const [shares, setShares] = useState(post.sharesCount);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem("savedPosts") || "[]");
    if (savedPosts.includes(post.id)) {
      setIsSaved(true);
    }
    
    const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "[]");
    if (likedPosts.includes(post.id)) {
      setIsLiked(true);
    }
  }, [post.id]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleLike = async () => {
    if (isLiked) return;
    setLikes((prev) => prev + 1);
    setIsLiked(true);
    
    const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "[]");
    localStorage.setItem("likedPosts", JSON.stringify([...likedPosts, post.id]));

    try {
      await fetch(`/api/posts/${post.id}/like`, { method: "POST" });
    } catch (error) {
      console.error("Failed to like post", error);
      setLikes((prev) => prev - 1);
      setIsLiked(false);
    }
  };

  const handleSave = () => {
    const savedPosts = JSON.parse(localStorage.getItem("savedPosts") || "[]");
    
    if (isSaved) {
      const newSaved = savedPosts.filter((id: string) => id !== post.id);
      localStorage.setItem("savedPosts", JSON.stringify(newSaved));
      setIsSaved(false);
      showToast("Post removed from saved");
    } else {
      localStorage.setItem("savedPosts", JSON.stringify([...savedPosts, post.id]));
      setIsSaved(true);
      showToast("Post saved to bookmarks");
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/#post-${post.id}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: `Check out this news on Pradeshik News Bihar: ${post.title}`,
          url: url,
        });
        setShares((prev) => prev + 1);
        await fetch(`/api/posts/${post.id}/share`, { method: "POST" });
      } else {
        await navigator.clipboard.writeText(url);
        showToast("Link copied to clipboard!");
        setShares((prev) => prev + 1);
        await fetch(`/api/posts/${post.id}/share`, { method: "POST" });
      }
    } catch (error) {
      console.error("Error sharing", error);
    }
  };

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  // Derived content summary for featured card
  const contentSummary = post.content.length > 200 
    ? post.content.substring(0, 200) + '...' 
    : post.content;

  if (featured) {
    return (
      <article 
        id={`post-${post.id}`} 
        className="group relative bg-surface border-y md:border border-border-subtle md:rounded-xl overflow-hidden mb-8 md:mb-12 transition-all"
      >
        <div className="flex flex-col md:flex-row">
          {post.imageUrl && (
            <div className="w-full md:w-3/5 h-64 md:h-96 bg-slate-100 overflow-hidden relative">
              <img 
                src={post.imageUrl} 
                alt={post.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
            </div>
          )}
          
          <div className={`p-6 md:p-8 flex flex-col justify-center ${post.imageUrl ? 'w-full md:w-2/5' : 'w-full'}`}>
            <div className="mb-4">
               <span className="text-xs font-bold tracking-widest text-brand-red uppercase">
                 Latest Story
               </span>
            </div>

            <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy mb-4 leading-tight">
              {post.title}
            </h2>
            
            <p className="text-text-secondary leading-relaxed mb-8">
              {contentSummary}
            </p>

            <div className="mt-auto">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-navy">By {post.author}</p>
                  <p className="text-xs text-text-secondary mt-0.5">{formattedDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 border-t border-border-subtle pt-4">
                <button 
                  onClick={handleLike}
                  disabled={isLiked}
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                    isLiked ? "text-brand-red" : "text-text-secondary hover:text-navy"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? "fill-brand-red" : ""}`} />
                  <span>{likes}</span>
                </button>

                <button 
                  onClick={handleShare}
                  className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-navy transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{shares}</span>
                </button>

                <button 
                  onClick={handleSave}
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors ml-auto ${
                    isSaved ? "text-navy" : "text-text-secondary hover:text-navy"
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? "fill-navy" : ""}`} />
                  <span className="hidden sm:inline">{isSaved ? "Saved" : "Save"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        {toastMessage && (
          <div className="absolute bottom-4 right-4 bg-navy text-white px-4 py-2 rounded shadow-lg text-sm font-medium z-10 animate-in fade-in slide-in-from-bottom-4">
            {toastMessage}
          </div>
        )}
      </article>
    );
  }

  return (
    <article 
      id={`post-${post.id}`} 
      className="group relative bg-surface border border-border-subtle rounded-xl overflow-hidden flex flex-col h-full hover:border-slate-300 transition-colors"
    >
      {post.imageUrl && (
        <div className="w-full h-48 bg-slate-100 overflow-hidden relative border-b border-border-subtle">
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      )}
      
      <div className="p-5 flex flex-col flex-1">
        <h2 className="font-serif text-xl font-bold text-navy mb-3 leading-snug line-clamp-3">
          {post.title}
        </h2>
        
        <p className="text-text-secondary text-sm leading-relaxed mb-6 line-clamp-3">
          {post.content}
        </p>

        <div className="mt-auto">
           <div className="flex items-center justify-between mb-4">
             <div>
               <p className="text-xs font-semibold text-navy line-clamp-1">By {post.author}</p>
               <p className="text-[11px] text-text-secondary mt-0.5">{formattedDate}</p>
             </div>
           </div>

          <div className="flex items-center gap-5 border-t border-border-subtle pt-4 mt-2">
            <button 
              onClick={handleLike}
              disabled={isLiked}
              className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                isLiked ? "text-brand-red" : "text-text-secondary hover:text-navy"
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-brand-red" : ""}`} />
              <span>{likes}</span>
            </button>

            <button 
              onClick={handleShare}
              className="flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-navy transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>{shares}</span>
            </button>

            <button 
              onClick={handleSave}
              className={`flex items-center gap-1.5 text-xs font-medium transition-colors ml-auto ${
                isSaved ? "text-navy" : "text-text-secondary hover:text-navy"
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? "fill-navy" : ""}`} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute bottom-4 right-4 bg-navy text-white px-3 py-1.5 rounded shadow-lg text-xs font-medium z-10 animate-in fade-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}
    </article>
  );
}
