"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { KeyRound } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <div className="text-center">
        <div className="p-4 bg-red-50 text-brand-red rounded text-sm font-medium border border-red-100 mb-6">
          Invalid or missing reset token.
        </div>
        <Link href="/forgot-password" className="text-navy hover:text-brand-red font-bold transition-colors">
          Request a new link
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <h2 className="font-serif text-2xl font-bold text-navy mb-4">Password Reset Successful!</h2>
        <p className="text-text-secondary mb-6">
          You will be redirected to the login page momentarily...
        </p>
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
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-4 bg-red-50 text-brand-red rounded text-sm font-medium border border-red-100">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="password" className="block text-sm font-bold text-navy mb-1.5 uppercase tracking-wide">
          New Password
        </label>
        <input
          type="password"
          id="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded border border-border-subtle focus:ring-1 focus:ring-navy focus:border-navy transition-colors bg-white font-sans text-base"
          placeholder="••••••••"
          minLength={8}
        />
      </div>
      
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-bold text-navy mb-1.5 uppercase tracking-wide">
          Confirm New Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-3 rounded border border-border-subtle focus:ring-1 focus:ring-navy focus:border-navy transition-colors bg-white font-sans text-base"
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
          {isSubmitting ? "Resetting..." : "Reset Password"}
          {!isSubmitting && <KeyRound className="w-4 h-4 ml-1" />}
        </button>
      </div>
    </form>
  );
}

export default function ResetPassword() {
  return (
    <div className="w-full max-w-xl mx-auto mt-16 p-8 bg-surface border border-border-subtle rounded-xl shadow-sm">
      <div className="mb-8 border-b border-border-subtle pb-6 text-center">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-navy">
          Create New Password
        </h1>
        <p className="mt-2 text-text-secondary text-sm">
          Please enter your new password below.
        </p>
      </div>
      
      <Suspense fallback={<div className="text-center p-4">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
