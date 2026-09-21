"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    // Clear localStorage for legacy code that might still check it
    localStorage.removeItem("userAuth");
    
    try {
      // Create an endpoint /api/auth/logout if needed or just clear cookies via server action
      // Or simply fetch an empty route that deletes the session. Let's delete the cookie using JS:
      document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return (
    <button 
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 bg-surface border border-border-subtle text-text-secondary rounded text-sm font-medium hover:text-brand-red hover:border-brand-red transition-colors"
    >
      <LogOut className="w-4 h-4" />
      <span>Sign Out</span>
    </button>
  );
}
