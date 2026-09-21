"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to process request");
      }

      setMessage(data.message);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-16 p-8 bg-surface border border-border-subtle rounded-xl shadow-sm">
      <div className="mb-8 border-b border-border-subtle pb-6 text-center">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-navy">
          Reset Password
        </h1>
        <p className="mt-2 text-text-secondary text-sm">
          Enter your email address to receive a password reset link.
        </p>
      </div>

      {message ? (
        <div className="text-center">
          <div className="p-4 bg-green-50 text-green-800 rounded border border-green-100 mb-6 font-medium">
            {message}
          </div>
          <Link href="/login" className="text-navy hover:text-brand-red font-bold transition-colors">
            Return to Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-brand-red rounded text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-bold text-navy mb-2 uppercase tracking-wide">
              Registered Email Address
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded border border-border-subtle focus:ring-1 focus:ring-navy focus:border-navy transition-colors bg-white font-sans text-base"
              placeholder="journalist@example.com"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-navy hover:bg-slate-800 text-white px-8 py-3.5 rounded text-sm font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : "Send Reset Link"}
              {!isSubmitting && <Mail className="w-4 h-4 ml-1" />}
            </button>
          </div>

          <div className="text-center pt-2">
            <Link href="/login" className="text-sm font-bold text-navy hover:text-brand-red transition-colors">
              Back to Sign In
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
