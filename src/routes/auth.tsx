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
  const [mode, setMode] = useState<"signin" | "signup">("signin");
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
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{
        fontFamily: "Inter, sans-serif",
        background:
          "radial-gradient(120% 120% at 15% 0%, #23211c 0%, #161512 55%, #0d0c0a 100%)",
      }}
    >
      <div className="w-full max-w-[420px]">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#c6a969]/90 transition-colors hover:text-[#c6a969]"
        >
          ← Marshal Holidays
        </Link>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          <span
            className="mb-6 grid h-12 w-12 place-items-center rounded-2xl text-[#161512]"
            style={{ background: "linear-gradient(135deg, #d8bd83, #c6a969)", fontFamily: "'Bebas Neue', sans-serif", fontSize: 28 }}
          >
            M
          </span>
          <h1 className="leading-none text-white" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "42px" }}>
            Admin {mode === "signin" ? "sign in" : "sign up"}
          </h1>
          <p className="mt-2 mb-7 text-sm text-white/45">
            Only allowlisted Marshal Holidays staff can access the dashboard.
          </p>

          <form onSubmit={submit} className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#c6a969]/50"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">Password</span>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#c6a969]/50"
              />
            </label>

            {err && (
              <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-200">
                {err}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-white py-3 text-sm font-semibold text-[#161512] transition-all hover:shadow-lg hover:shadow-white/10 disabled:opacity-60 cursor-pointer"
            >
              {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-5 w-full text-center text-xs text-white/45 transition-colors hover:text-white/80 cursor-pointer"
          >
            {mode === "signin" ? "First-time admin? Create your account →" : "Already have an account? Sign in →"}
          </button>
        </div>
      </div>
    </div>
  );
}
