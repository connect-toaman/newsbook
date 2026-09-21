"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Basic simulation of auth since this is a demo.
      // In a real app, this would hit /api/auth/login.
      if (formData.email && formData.password) {
        localStorage.setItem("userAuth", JSON.stringify({ email: formData.email, role: "CONTRIBUTOR" }));
        router.push("/profile");
        router.refresh();
      } else {
        throw new Error("Email and password are required.");
      }
    } catch (err) {
      setError("Email or password is incorrect. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-0 bg-surface border border-border-subtle rounded-xl overflow-hidden min-h-[600px] shadow-sm mt-8">
      
      {/* Left Side: Editorial Banner */}
      <div className="bg-navy p-12 flex flex-col justify-between text-surface hidden md:flex relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="relative z-10">
          <h2 className="font-serif text-4xl font-bold mb-6">Pradeshik News Bihar</h2>
          <p className="text-xl text-slate-300 font-serif italic mb-8">
            Stay informed. Share responsibly. Follow verified local reporting.
          </p>
        </div>
        <div className="relative z-10">
          <p className="text-sm text-slate-400">Join our community of citizen journalists and verified reporters dedicated to authentic news across Bihar.</p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="p-8 sm:p-12 flex flex-col justify-center">
        <div className="mb-8 border-b border-border-subtle pb-6">
          <h1 className="font-serif text-3xl font-bold tracking-tight text-navy">
            Welcome back
          </h1>
          <p className="mt-2 text-text-secondary text-sm">
            Sign in to your Pradeshik News Bihar account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-brand-red rounded text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-bold text-navy mb-2 uppercase tracking-wide">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded border border-border-subtle focus:ring-1 focus:ring-navy focus:border-navy transition-colors bg-white font-sans text-base placeholder:text-sm"
              placeholder="journalist@example.com"
            />
          </div>

          <div>
            <div className="flex justify-between items-baseline mb-2">
              <label htmlFor="password" className="block text-sm font-bold text-navy uppercase tracking-wide">
                Password
              </label>
              <Link href="#" className="text-xs font-medium text-text-secondary hover:text-navy transition-colors">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded border border-border-subtle focus:ring-1 focus:ring-navy focus:border-navy transition-colors bg-white font-sans text-base"
              placeholder="••••••••"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-navy hover:bg-slate-800 text-white px-8 py-3.5 rounded text-sm font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
              {!isSubmitting && <LogIn className="w-4 h-4 ml-1" />}
            </button>
          </div>
          
          <div className="text-center pt-4">
            <p className="text-sm text-text-secondary">
              Don't have an account?{" "}
              <Link href="#" className="font-bold text-navy hover:text-brand-red transition-colors">
                Create an account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
