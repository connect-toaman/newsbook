"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UserRoleSelector({ userId, currentRole }: { userId: string, currentRole: string }) {
  const [role, setRole] = useState(currentRole);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    if (newRole === currentRole) return;
    
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      setRole(currentRole); // Reset dropdown
      return;
    }

    setLoading(true);
    setRole(newRole);

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, newRole }),
      });

      if (!res.ok) {
        throw new Error("Failed to update role");
      }

      router.refresh();
    } catch (error) {
      alert("Failed to update user role");
      setRole(currentRole);
    } finally {
      setLoading(false);
    }
  };

  return (
    <select
      value={role}
      onChange={handleRoleChange}
      disabled={loading}
      className={`px-3 py-1.5 text-sm font-medium rounded-md border outline-none disabled:opacity-50 transition-colors ${
        role === "ADMIN" 
          ? "bg-brand-red/10 text-brand-red border-brand-red/20" 
          : role === "CONTRIBUTOR"
          ? "bg-amber-50 text-amber-700 border-amber-200"
          : "bg-slate-50 text-slate-700 border-slate-200"
      }`}
    >
      <option value="USER">USER</option>
      <option value="CONTRIBUTOR">CONTRIBUTOR</option>
      <option value="ADMIN">ADMIN</option>
    </select>
  );
}
