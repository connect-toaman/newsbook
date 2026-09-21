import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { User, FileText, CheckCircle, Clock, XCircle, LogOut } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";
import Image from "next/image";

export default async function Profile() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  // Fetch the latest user info from the database to ensure correctness
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  if (!user) {
    redirect("/login");
  }

  // Fetch all posts submitted by this exact user ID
  const myPosts = await prisma.post.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="w-full max-w-7xl mx-auto mt-8 mb-20 px-4">
      <div className="mb-10 border-b border-border-subtle pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-navy">
            My Account
          </h1>
          <p className="mt-2 text-text-secondary text-sm">
            Manage your account and view your submitted news.
          </p>
        </div>
        <LogoutButton />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: User Details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-surface border border-border-subtle rounded-xl p-6 shadow-sm">
            <div className="w-16 h-16 bg-navy rounded-full flex items-center justify-center text-white mb-6">
              <User className="w-8 h-8" />
            </div>
            
            <div className="mb-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</p>
              <p className="text-navy font-medium">{user.name || "Citizen Journalist"}</p>
            </div>

            <div className="mb-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email</p>
              <p className="text-navy font-medium">{user.email}</p>
            </div>
            
            <div className="mb-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Account Role</p>
              <span className="inline-block px-3 py-1 bg-brand-red/10 text-brand-red text-xs font-bold uppercase rounded-full border border-brand-red/20">
                {user.role}
              </span>
            </div>

            <div className="mb-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Account Status</p>
              <span className={`inline-flex items-center gap-1 text-xs font-bold uppercase rounded-full ${user.isActive ? 'text-green-600' : 'text-red-600'}`}>
                {user.isActive ? <CheckCircle size={14}/> : <XCircle size={14} />} 
                {user.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Date Joined</p>
              <p className="text-navy font-medium text-sm">{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Right Col: Activity */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
             <h2 className="font-serif text-2xl font-bold text-navy">My News</h2>
             <Link href="/create" className="px-4 py-2 bg-navy text-white text-sm font-medium rounded hover:bg-slate-800 transition-colors">
               Submit News
             </Link>
          </div>

          <div className="space-y-4">
            {myPosts.length === 0 ? (
              <div className="bg-surface border border-border-subtle rounded-xl p-8 shadow-sm flex flex-col items-center justify-center min-h-[250px]">
                <FileText className="w-12 h-12 text-slate-300 mb-4" />
                <h3 className="font-serif text-xl font-bold text-navy mb-2">No submissions yet</h3>
                <p className="text-text-secondary text-sm text-center max-w-sm">
                  You haven't submitted any news stories yet. Start sharing local news with the community.
                </p>
              </div>
            ) : (
              myPosts.map((post) => (
                <div key={post.id} className="bg-surface border border-border-subtle rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-4">
                  {/* Thumbnail */}
                  <div className="w-full sm:w-32 h-24 bg-slate-100 rounded-lg flex-shrink-0 relative overflow-hidden flex items-center justify-center border border-border-subtle">
                    {post.imageUrl ? (
                      <Image 
                        src={post.imageUrl} 
                        alt={post.title} 
                        fill 
                        className="object-cover"
                      />
                    ) : (
                      <FileText className="text-slate-300 w-8 h-8" />
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 flex flex-col">
                    <h3 className="font-serif text-lg font-bold text-navy line-clamp-1">{post.title}</h3>
                    
                    <div className="flex items-center gap-2 mt-1 mb-2">
                       <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{post.category || 'Uncategorized'}</span>
                       <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{post.district || 'Bihar'}</span>
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                       <span className="text-xs text-text-secondary">
                         Submitted on {new Date(post.createdAt).toLocaleDateString()}
                       </span>
                       
                       {post.status === 'APPROVED' && (
                         <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded border border-green-100">
                           <CheckCircle size={12}/> Published
                         </span>
                       )}
                       {post.status === 'PENDING' && (
                         <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100">
                           <Clock size={12}/> Pending Review
                         </span>
                       )}
                       {post.status === 'REJECTED' && (
                         <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100">
                           <XCircle size={12}/> Rejected
                         </span>
                       )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
