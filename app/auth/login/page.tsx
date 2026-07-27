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
    <div className="flex min-h-screen items-center justify-center p-4" style={{ background: "var(--bg)" }}>
      <div className="card-noir w-full max-w-sm !p-6">
        <h2 className="text-2xl font-bold text-center text-text mb-1">{modeLabel}</h2>
        <p className="text-sm text-text-muted text-center mb-4">{modeDescription}</p>

        {/* Mode switcher tabs */}
        <div className="flex justify-center gap-0 mb-4 p-0.5 rounded-lg" style={{ background: "var(--surface-hover)" }}>
          <button
            type="button"
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${mode === "password" ? "text-text font-medium" : "text-text-muted hover:text-text"}`}
            style={mode === "password" ? { background: "var(--surface)" } : undefined}
            onClick={() => switchTo("password")}
          >
            Password
          </button>
          <button
            type="button"
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${mode === "magiclink" ? "text-text font-medium" : "text-text-muted hover:text-text"}`}
            style={mode === "magiclink" ? { background: "var(--surface)" } : undefined}
            onClick={() => switchTo("magiclink")}
          >
            Magic Link
          </button>
          <button
            type="button"
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${mode === "reset" ? "text-text font-medium" : "text-text-muted hover:text-text"}`}
            style={mode === "reset" ? { background: "var(--surface)" } : undefined}
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
          <div className="space-y-1.5">
            <span className="text-sm font-medium text-text">Email</span>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-3 py-2 text-sm rounded-lg outline-none transition-colors"
              style={{
                background: "var(--bg)",
                color: "var(--text)",
                border: "1px solid var(--border)",
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={(e) => { e.target.style.borderColor = "var(--color-accent)"; }}
              onBlur={(e) => { e.target.style.borderColor = "var(--border)"; }}
              required
            />
          </div>

          {mode === "password" && (
            <div className="space-y-1.5">
              <span className="text-sm font-medium text-text">Password</span>
              <input
                type="password"
                className="w-full px-3 py-2 text-sm rounded-lg outline-none transition-colors"
                style={{
                  background: "var(--bg)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={(e) => { e.target.style.borderColor = "var(--color-accent)"; }}
                onBlur={(e) => { e.target.style.borderColor = "var(--border)"; }}
                required
              />
            </div>
          )}

          {error && (
            <div className="px-3 py-2 rounded-lg text-sm" style={{ background: "rgba(239,68,68,0.1)", color: "var(--color-error)", border: "1px solid rgba(239,68,68,0.3)" }}>
              {error}
            </div>
          )}
          {message && (
            <div className="px-3 py-2 rounded-lg text-sm" style={{ background: "rgba(34,197,94,0.1)", color: "var(--color-success)", border: "1px solid rgba(34,197,94,0.3)" }}>
              {message}
            </div>
          )}

          <button type="submit" className="btn-noir btn-noir-primary w-full justify-center" disabled={loading}>
            {loading && (
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
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
          <div className="text-xs text-text-dim mt-4 text-center leading-relaxed">
            Tip: Make sure <strong>Email provider</strong> is enabled in<br />
            Supabase Dashboard → Authentication → Email.<br />
            Free tier is limited to 4 emails/hour.
          </div>
        )}
      </div>
    </div>
  );
}
