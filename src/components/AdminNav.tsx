"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Users } from "lucide-react";

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <div className="flex space-x-1 border-b border-border-subtle mb-6">
      <Link
        href="/admin"
        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
          pathname === "/admin"
            ? "border-brand-red text-navy"
            : "border-transparent text-text-secondary hover:text-navy hover:border-slate-300"
        }`}
      >
        <FileText size={16} />
        Pending News
      </Link>
      <Link
        href="/admin/users"
        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
          pathname === "/admin/users"
            ? "border-brand-red text-navy"
            : "border-transparent text-text-secondary hover:text-navy hover:border-slate-300"
        }`}
      >
        <Users size={16} />
        User Management
      </Link>
    </div>
  );
}
