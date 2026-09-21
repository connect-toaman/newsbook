"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, User, FileText } from "lucide-react";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem("userAuth");
    if (!auth) {
      router.push("/login");
    } else {
      setUser(JSON.parse(auth));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("userAuth");
    router.push("/login");
    router.refresh();
  };

  if (!user) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-slate-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="mb-10 border-b border-border-subtle pb-6 flex justify-between items-end">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-navy">
            Your Profile
          </h1>
          <p className="mt-2 text-text-secondary text-sm">
            Manage your account and view your contributions.
          </p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-surface border border-border-subtle text-text-secondary rounded text-sm font-medium hover:text-brand-red hover:border-brand-red transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Col: User Details */}
        <div className="md:col-span-1">
          <div className="bg-surface border border-border-subtle rounded-xl p-6 shadow-sm">
            <div className="w-16 h-16 bg-navy rounded-full flex items-center justify-center text-white mb-6">
              <User className="w-8 h-8" />
            </div>
            
            <div className="mb-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email</p>
              <p className="text-navy font-medium">{user.email}</p>
            </div>
            
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Role</p>
              <span className="inline-block px-3 py-1 bg-green-50 text-green-700 text-xs font-bold uppercase rounded-full border border-green-200">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Right Col: Activity */}
        <div className="md:col-span-2">
          <div className="bg-surface border border-border-subtle rounded-xl p-8 shadow-sm h-full flex flex-col items-center justify-center min-h-[300px]">
            <FileText className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="font-serif text-xl font-bold text-navy mb-2">No contributions yet</h3>
            <p className="text-text-secondary text-sm mb-6 text-center max-w-sm">
              You haven't submitted any news stories yet. Start sharing local news with the community.
            </p>
            <Link 
              href="/create"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-navy text-white text-sm font-medium rounded hover:bg-slate-800 transition-colors"
            >
              Submit a Story
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
