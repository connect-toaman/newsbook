"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminActionButtons({ postId }: { postId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAction = async (action: "APPROVE" | "REJECT") => {
    if (!confirm(`Are you sure you want to ${action.toLowerCase()} this post?`)) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/admin/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, action }),
      });

      if (!res.ok) throw new Error("Action failed");

      router.refresh();
    } catch (error) {
      alert("Failed to perform action");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-row md:flex-col gap-3 justify-center border-t md:border-t-0 md:border-l border-border-subtle pt-4 md:pt-0 md:pl-6 min-w-[140px]">
      <button 
        disabled={loading}
        onClick={() => handleAction("APPROVE")}
        className="flex-1 bg-navy hover:bg-slate-800 text-white font-medium py-2 px-4 rounded text-sm transition-colors text-center disabled:opacity-50"
      >
        {loading ? "..." : "Approve"}
      </button>
      <button 
        disabled={loading}
        onClick={() => handleAction("REJECT")}
        className="flex-1 bg-white hover:bg-red-50 text-brand-red border border-red-200 font-medium py-2 px-4 rounded text-sm transition-colors text-center disabled:opacity-50"
      >
        {loading ? "..." : "Reject"}
      </button>
    </div>
  );
}
