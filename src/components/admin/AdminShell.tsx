import { useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FileText,
  Images,
  Gauge,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SITE } from "@/lib/site";

/* Shared premium admin design tokens (ink + gold, matches the public site). */
export const ADMIN = {
  page: "min-h-screen bg-[#f4f2ee] text-[#1c1b18]",
  card: "rounded-2xl border border-black/[0.06] bg-white shadow-[0_1px_2px_rgba(17,17,17,0.04),0_12px_32px_-24px_rgba(17,17,17,0.25)]",
  btnPrimary:
    "inline-flex items-center justify-center gap-2 rounded-xl bg-[#1c1b18] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-black hover:shadow-lg hover:shadow-black/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c6a969]/60 disabled:opacity-50 cursor-pointer",
  btnGhost:
    "inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-[#1c1b18] transition-all duration-200 hover:bg-[#faf9f6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c6a969]/60 disabled:opacity-50 cursor-pointer",
  input:
    "w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm text-[#1c1b18] transition-shadow placeholder:text-[#1c1b18]/35 focus:outline-none focus:ring-2 focus:ring-[#c6a969]/45",
  label: "block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1c1b18]/55 mb-1.5",
  heading: { fontFamily: "'Bebas Neue', sans-serif" } as React.CSSProperties,
  body: { fontFamily: "Inter, sans-serif" } as React.CSSProperties,
} as const;

type NavItem = { label: string; to: string; icon: LucideIcon; exact?: boolean };

const NAV: NavItem[] = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Site Content", to: "/admin/content", icon: FileText },
  { label: "Photos & Videos", to: "/admin/content", icon: Images },
  { label: "SEO Center", to: "/admin/seo", icon: Gauge },
];

export type Crumb = { label: string; to?: string };

export function AdminShell({
  title,
  subtitle,
  crumbs,
  actions,
  children,
  contentClassName = "",
}: {
  title: string;
  subtitle?: string;
  crumbs?: Crumb[];
  actions?: React.ReactNode;
  children: React.ReactNode;
  contentClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className={ADMIN.page} style={ADMIN.body}>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[264px] flex-col bg-[#161512] text-white transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar pathname={pathname} onNavigate={() => setOpen(false)} />
      </aside>

      {/* Main */}
      <div className="lg:pl-[264px]">
        <header className="sticky top-0 z-30 border-b border-black/[0.06] bg-[#f4f2ee]/85 backdrop-blur-xl">
          <div className="flex items-center gap-4 px-5 py-4 md:px-8">
            <button
              onClick={() => setOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-black/10 bg-white text-[#1c1b18] lg:hidden cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="min-w-0 flex-1">
              {crumbs && crumbs.length > 0 && (
                <nav className="mb-1 flex items-center gap-1.5 text-xs text-[#1c1b18]/45">
                  {crumbs.map((cr, i) => (
                    <span key={i} className="flex items-center gap-1.5">
                      {cr.to ? (
                        <Link to={cr.to} className="hover:text-[#1c1b18] transition-colors">{cr.label}</Link>
                      ) : (
                        <span className="text-[#1c1b18]/70">{cr.label}</span>
                      )}
                      {i < crumbs.length - 1 && <ChevronRight className="h-3 w-3" />}
                    </span>
                  ))}
                </nav>
              )}
              <h1 className="truncate leading-none text-[#1c1b18]" style={{ ...ADMIN.heading, fontSize: "30px" }}>
                {title}
              </h1>
              {subtitle && <p className="mt-1 truncate text-sm text-[#1c1b18]/55">{subtitle}</p>}
            </div>

            {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
          </div>
        </header>

        <main className={`px-5 py-7 md:px-8 md:py-9 ${contentClassName}`}>{children}</main>
      </div>
    </div>
  );
}

function Sidebar({ pathname, onNavigate }: { pathname: string; onNavigate: () => void }) {
  const navigate = useNavigate();

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  return (
    <>
      <div className="flex items-center gap-2.5 px-6 py-6">
        <span
          className="grid h-10 w-10 place-items-center rounded-xl text-[#161512]"
          style={{ background: "linear-gradient(135deg, #d8bd83, #c6a969)", fontFamily: "'Bebas Neue', sans-serif", fontSize: 22 }}
        >
          M
        </span>
        <div className="leading-tight">
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: "0.02em" }}>
            Marshal
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#c6a969]">
            CMS
          </div>
        </div>
      </div>

      <nav className="mt-2 flex-1 space-y-1 px-3">
        {NAV.map((item) => {
          const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
          return (
            <Link
              key={item.label}
              to={item.to}
              onClick={onNavigate}
              className={`group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer ${
                active
                  ? "bg-white/[0.08] text-white"
                  : "text-white/55 hover:bg-white/[0.05] hover:text-white/90"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-[#c6a969]" />
              )}
              <item.icon className={`h-[18px] w-[18px] ${active ? "text-[#c6a969]" : ""}`} strokeWidth={1.8} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-white/10 px-3 py-4">
        <a
          href={SITE.url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white/55 transition-all duration-200 hover:bg-white/[0.05] hover:text-white/90 cursor-pointer"
        >
          <ExternalLink className="h-[18px] w-[18px]" strokeWidth={1.8} />
          View live site
        </a>
        <button
          onClick={signOut}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white/55 transition-all duration-200 hover:bg-white/[0.05] hover:text-white/90 cursor-pointer"
        >
          <LogOut className="h-[18px] w-[18px]" strokeWidth={1.8} />
          Sign out
        </button>
      </div>
    </>
  );
}

/* Small shared UI atoms for admin pages */

export function StatCard({
  label, value, tone = "ink", hint,
}: {
  label: string; value: string; tone?: "ink" | "good" | "warn" | "bad"; hint?: string;
}) {
  const color =
    tone === "good" ? "text-emerald-600" : tone === "warn" ? "text-amber-600" : tone === "bad" ? "text-red-600" : "text-[#1c1b18]";
  return (
    <div className={`${ADMIN.card} p-5`}>
      <div className={`leading-none ${color}`} style={{ ...ADMIN.heading, fontSize: "42px" }}>{value}</div>
      <div className="mt-2 text-xs font-medium text-[#1c1b18]/55">{label}</div>
      {hint && <div className="mt-1 text-[11px] text-[#1c1b18]/40">{hint}</div>}
    </div>
  );
}
