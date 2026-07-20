"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [resetMode, setResetMode] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      // Small delay to let Supabase write cookies, then navigate
      setTimeout(() => router.push("/dashboard"), 100);
    }
    setLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/auth/callback?next=/dashboard/settings`,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Check your email for the password reset link.");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-base-200">
      <div className="card bg-base-100 shadow-xl w-full max-w-sm">
        <div className="card-body">
          <h2 className="card-title text-2xl justify-center">
            {resetMode ? "Reset Password" : "Sign In"}
          </h2>
          <p className="text-sm opacity-70 text-center">
            {resetMode
              ? "Enter your email to receive a reset link"
              : "Enter your credentials to access the dashboard"}
          </p>
          <form onSubmit={resetMode ? handleResetPassword : handleLogin} className="space-y-4 mt-4">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Email</span>
              </div>
              <input
                type="email"
                placeholder="you@example.com"
                className="input input-bordered w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            {!resetMode && (
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Password</span>
                </div>
                <input
                  type="password"
                  className="input input-bordered w-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>
            )}
            {error && <div className="alert alert-error text-sm">{error}</div>}
            {message && <div className="alert alert-success text-sm">{message}</div>}
            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? <span className="loading loading-spinner"></span> : null}
              {loading ? (resetMode ? "Sending..." : "Signing in...") : (resetMode ? "Send Reset Link" : "Sign In")}
            </button>
          </form>
          <div className="text-center">
            <button
              type="button"
              className="btn btn-ghost btn-sm text-xs"
              onClick={() => {
                setResetMode(!resetMode);
                setError(null);
                setMessage(null);
              }}
            >
              {resetMode ? "← Back to Sign In" : "Forgot your password?"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
