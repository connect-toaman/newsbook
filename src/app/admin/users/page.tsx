import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminNav from "@/components/AdminNav";
import UserRoleSelector from "@/components/UserRoleSelector";
import { UserCircle, Shield, CheckCircle, XCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminUsersDashboard() {
  const session = await getSession();

  // Protect Admin Route Server-Side
  if (!session || session.role !== "ADMIN") {
    redirect("/login");
  }

  // Fetch all users
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto mt-8 mb-20 px-4">
      <div className="mb-8 border-b border-border-subtle pb-6 flex justify-between items-end">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-navy">
            User Management
          </h1>
          <p className="mt-2 text-text-secondary text-sm">
            Manage user roles and access permissions across the platform.
          </p>
        </div>
        <div className="text-sm font-medium bg-blue-50 text-blue-800 px-4 py-2 rounded">
          Logged in as Admin: {session.email}
        </div>
      </div>

      <AdminNav />

      <div className="bg-surface border border-border-subtle rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-navy border-b border-border-subtle">
              <tr>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">User</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Joined</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Last Login</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Logins</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Status</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center">
                        {user.role === 'ADMIN' ? <Shield size={20} className="text-brand-red"/> : <UserCircle size={24} />}
                      </div>
                      <div>
                        <div className="font-medium text-navy">{user.name || "Unknown User"}</div>
                        <div className="text-text-secondary text-xs">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-text-secondary">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-text-secondary text-xs">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Never"}
                  </td>
                  <td className="px-6 py-4 text-text-secondary font-medium text-center">
                    {user.loginCount}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 text-xs font-bold uppercase rounded-full ${user.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {user.isActive ? <CheckCircle size={14}/> : <XCircle size={14} />} 
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <UserRoleSelector userId={user.id} currentRole={user.role} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
