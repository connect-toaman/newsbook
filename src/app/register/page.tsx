"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus } from "lucide-react";

export default function Register() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "An error occurred during registration.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-xl mx-auto mt-16 p-8 bg-surface border border-border-subtle rounded-xl shadow-sm text-center">
        <h2 className="font-serif text-3xl font-bold text-navy mb-4">Account Created Successfully</h2>
        <p className="text-text-secondary mb-6">
          Your account is ready. You can now sign in.
        </p>
        <div className="p-4 bg-blue-50 text-blue-800 text-sm rounded mb-8 border border-blue-100 text-left">
          <strong>Note:</strong> Contributor access to publish news is granted separately by the administration. You can request access after signing in.
        </div>
        <Link 
          href="/login"
          className="inline-flex items-center justify-center bg-navy hover:bg-slate-800 text-white px-8 py-3 rounded font-medium transition-colors"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-0 bg-surface border border-border-subtle rounded-xl overflow-hidden min-h-[600px] shadow-sm mt-8">
      
      {/* Left Side: Editorial Banner */}
      <div className="bg-navy p-12 flex flex-col justify-between text-surface hidden md:flex relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="relative z-10">
          <h2 className="font-serif text-4xl font-bold mb-6">Pradeshik News Bihar</h2>
          <p className="text-xl text-slate-300 font-serif italic mb-8">
            Join the community. Read local stories. Discuss authentic news.
          </p>
        </div>
        <div className="relative z-10">
          <p className="text-sm text-slate-400">By creating an account, you can save stories and apply for contributor access to publish your own local reports.</p>
        </div>
      </div>

      {/* Right Side: Registration Form */}
      <div className="p-8 sm:p-12 flex flex-col justify-center">
        <div className="mb-8 border-b border-border-subtle pb-6">
          <h1 className="font-serif text-3xl font-bold tracking-tight text-navy">
            Create your account
          </h1>
          <p className="mt-2 text-text-secondary text-sm">
            Join the Pradeshik News Bihar community.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-4 bg-red-50 text-brand-red rounded text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-bold text-navy mb-1.5 uppercase tracking-wide">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded border border-border-subtle focus:ring-1 focus:ring-navy focus:border-navy transition-colors bg-white font-sans text-base placeholder:text-sm"
              placeholder="e.g. Aman Kumar Singh"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-bold text-navy mb-1.5 uppercase tracking-wide">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded border border-border-subtle focus:ring-1 focus:ring-navy focus:border-navy transition-colors bg-white font-sans text-base placeholder:text-sm"
              placeholder="reader@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-bold text-navy mb-1.5 uppercase tracking-wide">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded border border-border-subtle focus:ring-1 focus:ring-navy focus:border-navy transition-colors bg-white font-sans text-base"
              placeholder="••••••••"
              minLength={8}
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-bold text-navy mb-1.5 uppercase tracking-wide">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded border border-border-subtle focus:ring-1 focus:ring-navy focus:border-navy transition-colors bg-white font-sans text-base"
              placeholder="••••••••"
              minLength={8}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-navy hover:bg-slate-800 text-white px-8 py-3.5 rounded text-sm font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
              {!isSubmitting && <UserPlus className="w-4 h-4 ml-1" />}
            </button>
          </div>
          
          <div className="text-center pt-4">
            <p className="text-sm text-text-secondary">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-navy hover:text-brand-red transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
