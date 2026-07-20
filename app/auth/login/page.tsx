"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type AuthMode = "password" | "magiclink" | "reset";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const getSiteUrl = () =>
    process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;

  const clearFeedback = () => {
    setError(null);
    setMessage(null);
  };

  const switchTo = (m: AuthMode) => {
    setMode(m);
    clearFeedback();
  };

  // ── Password sign-in ──
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearFeedback();

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setTimeout(() => router.push("/dashboard"), 100);
    }
  };

  // ── Magic link (passwordless) ──
  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearFeedback();

    const supabase = createClient();
    const siteUrl = getSiteUrl();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${siteUrl}/auth/callback?next=/dashboard`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Magic link sent! Check your inbox and click the link to sign in.");
    }
    setLoading(false);
  };

  // ── Reset password ──
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearFeedback();

    const supabase = createClient();
    const siteUrl = getSiteUrl();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/auth/callback?next=/dashboard/settings`,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Password reset link sent! Check your email.");
    }
    setLoading(false);
  };

  const modeLabel = {
    password: "Sign In",
    magiclink: "Magic Link",
    reset: "Reset Password",
  }[mode];

  const modeDescription = {
    password: "Enter your credentials to access the dashboard",
    magiclink: "Enter your email to receive a one-click sign-in link",
    reset: "Enter your email to receive a password reset link",
  }[mode];

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-base-200">
      <div className="card bg-base-100 shadow-xl w-full max-w-sm">
        <div className="card-body">
          <h2 className="card-title text-2xl justify-center">{modeLabel}</h2>
          <p className="text-sm opacity-70 text-center">{modeDescription}</p>

          {/* Mode switcher tabs */}
          <div className="tabs tabs-boxed justify-center mt-2">
            <button
              type="button"
              className={`tab tab-sm ${mode === "password" ? "tab-active" : ""}`}
              onClick={() => switchTo("password")}
            >
              Password
            </button>
            <button
              type="button"
              className={`tab tab-sm ${mode === "magiclink" ? "tab-active" : ""}`}
              onClick={() => switchTo("magiclink")}
            >
              Magic Link
            </button>
            <button
              type="button"
              className={`tab tab-sm ${mode === "reset" ? "tab-active" : ""}`}
              onClick={() => switchTo("reset")}
            >
              Reset
            </button>
          </div>

          <form
            onSubmit={
              mode === "password"
                ? handlePasswordLogin
                : mode === "magiclink"
                  ? handleMagicLink
                  : handleResetPassword
            }
            className="space-y-4 mt-4"
          >
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

            {mode === "password" && (
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
              {loading && <span className="loading loading-spinner"></span>}
              {loading
                ? mode === "password"
                  ? "Signing in..."
                  : "Sending..."
                : mode === "password"
                  ? "Sign In"
                  : mode === "magiclink"
                    ? "Send Magic Link"
                    : "Send Reset Link"}
            </button>
          </form>

          {/* Hint for dev / troubleshooting */}
          {error && (
            <div className="text-xs text-muted-foreground mt-2 text-center leading-relaxed">
              Tip: Make sure <strong>Email provider</strong> is enabled in<br />
              Supabase Dashboard → Authentication → Email.<br />
              Free tier is limited to 4 emails/hour.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
