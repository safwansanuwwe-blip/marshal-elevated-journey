import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Admin Sign In | Marshal Holidays" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/admin" });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Sign in failed";
      setErr(msg.includes("not authorized") ? msg : msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] px-4">
      <div className="w-full max-w-md rounded-2xl border border-black/5 bg-white p-8 shadow-sm">
        <Link to="/" className="block mb-6 text-[#9a8666] text-xs font-semibold tracking-[0.18em] uppercase" style={{ fontFamily: "Inter, sans-serif" }}>
          ← Marshal Holidays
        </Link>
        <h1
          className="text-[#272835] leading-none mb-2"
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "44px" }}
        >
          Admin {mode === "signin" ? "sign in" : "sign up"}
        </h1>
        <p className="text-[#272835]/60 text-sm mb-6" style={{ fontFamily: "Inter, sans-serif" }}>
          Only allowlisted Marshal Holidays staff can access the dashboard.
        </p>

        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="text-xs font-semibold text-[#272835]/70" style={{ fontFamily: "Inter, sans-serif" }}>EMAIL</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-black/10 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#9a8666]/40"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-[#272835]/70" style={{ fontFamily: "Inter, sans-serif" }}>PASSWORD</span>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-black/10 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#9a8666]/40"
            />
          </label>

          {err && (
            <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700" style={{ fontFamily: "Inter, sans-serif" }}>
              {err}
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-md bg-[#272835] text-white py-2.5 text-sm font-semibold hover:bg-black disabled:opacity-60"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-4 w-full text-center text-xs text-[#272835]/60 hover:text-[#272835]"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {mode === "signin" ? "First-time admin? Create your account →" : "Already have an account? Sign in →"}
        </button>
      </div>
    </div>
  );
}
