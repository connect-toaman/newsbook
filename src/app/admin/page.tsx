import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import AdminActionButtons from "@/components/AdminActionButtons";

export default async function AdminDashboard() {
  const session = await getSession();

  // Protect Admin Route Server-Side
  if (!session || session.role !== "ADMIN") {
    redirect("/login");
  }

  const pendingPosts = await prisma.post.findMany({
    where: { status: "PENDING" },
    include: { author: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto mt-8 mb-20 px-4">
      <div className="mb-8 border-b border-border-subtle pb-6 flex justify-between items-end">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-navy">
            Editorial Review Dashboard
          </h1>
          <p className="mt-2 text-text-secondary text-sm">
            Review and approve pending news submissions from contributors.
          </p>
        </div>
        <div className="text-sm font-medium bg-blue-50 text-blue-800 px-4 py-2 rounded">
          Logged in as Admin: {session.email}
        </div>
      </div>

      <div className="space-y-6">
        {pendingPosts.length === 0 ? (
          <div className="bg-surface border border-border-subtle rounded-xl p-12 text-center shadow-sm">
            <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
            <h3 className="text-xl font-bold text-navy mb-2">All Caught Up!</h3>
            <p className="text-text-secondary">There are no pending news articles waiting for editorial review.</p>
          </div>
        ) : (
          pendingPosts.map((post) => (
            <div key={post.id} className="bg-surface border border-border-subtle rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-6">
              
              <div className="flex-1 space-y-3">
                <div className="flex gap-2 items-center text-xs font-bold uppercase tracking-wide">
                  <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded flex items-center gap-1"><Clock size={12}/> Pending Review</span>
                  <span className="text-navy">{post.category}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-navy">{post.district}</span>
                </div>
                
                <h3 className="font-serif text-xl font-bold text-navy">{post.title}</h3>
                <p className="text-text-secondary line-clamp-2 text-sm">{post.content}</p>
                
                <div className="text-sm text-slate-500 pt-2 border-t border-border-subtle mt-4">
                  Submitted by <span className="font-medium text-navy">{post.authorName}</span> on {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>

              <AdminActionButtons postId={post.id} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
