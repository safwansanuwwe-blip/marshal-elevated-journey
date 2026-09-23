import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Plus, Trash2, ExternalLink, PenLine } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { listAllPosts, deletePost, type AdminPost } from "@/lib/posts.functions";
import { AdminShell, StatCard, ADMIN } from "@/components/admin/AdminShell";

async function getAccessToken(): Promise<string> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Your session has expired. Please sign in again.");
  return token;
}

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({
    meta: [{ title: "Dashboard · Marshal Holidays" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData({
      queryKey: ["admin", "posts"],
      queryFn: async () => listAllPosts({ data: { accessToken: await getAccessToken() } }),
    }),
  component: AdminHome,
  errorComponent: ({ error }) => (
    <div className="p-10 text-red-600">Admin load failed: {error.message}</div>
  ),
});

function isScheduled(p: AdminPost) {
  return p.status === "published" && !!p.published_at && new Date(p.published_at) > new Date();
}
function isLive(p: AdminPost) {
  return p.status === "published" && !!p.published_at && new Date(p.published_at) <= new Date();
}

function AdminHome() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const del = useServerFn(deletePost);
  const { data: posts } = useSuspenseQuery<AdminPost[]>({
    queryKey: ["admin", "posts"],
    queryFn: async () => listAllPosts({ data: { accessToken: await getAccessToken() } }),
  });
  const [busy, setBusy] = useState<string | null>(null);

  async function onDelete(p: AdminPost) {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    setBusy(p.id);
    try {
      await del({ data: { id: p.id, accessToken: await getAccessToken() } });
      await qc.invalidateQueries({ queryKey: ["admin", "posts"] });
    } finally {
      setBusy(null);
    }
  }

  const live = posts.filter(isLive).length;
  const drafts = posts.filter((p) => p.status === "draft").length;
  const scheduled = posts.filter(isScheduled).length;

  return (
    <AdminShell
      title="Dashboard"
      subtitle="Manage your blog, site content, and SEO."
      actions={
        <Link to="/admin/$id" params={{ id: "new" }} className={ADMIN.btnPrimary}>
          <Plus className="h-4 w-4" /> New post
        </Link>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total posts" value={String(posts.length)} />
        <StatCard label="Published" value={String(live)} tone="good" />
        <StatCard label="Drafts" value={String(drafts)} tone={drafts ? "warn" : "ink"} />
        <StatCard label="Scheduled" value={String(scheduled)} />
      </div>

      {/* Quick links */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <QuickLink
          to="/admin/content"
          title="Site content & media"
          desc="Edit every section of the homepage — text, lists, photos and videos."
        />
        <QuickLink
          to="/admin/seo"
          title="SEO Center"
          desc="Audit every post, preview search & social cards, generate a sitemap."
        />
      </div>

      {/* Posts table */}
      <div className={`mt-8 ${ADMIN.card} overflow-hidden`}>
        <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-4">
          <h2 className="text-[#1c1b18]" style={{ ...ADMIN.heading, fontSize: "22px" }}>
            Blog posts <span className="text-[#1c1b18]/35">({posts.length})</span>
          </h2>
          <Link to="/admin/$id" params={{ id: "new" }} className="text-sm font-semibold text-[#9a8666] hover:text-[#1c1b18] cursor-pointer">
            + New
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-[#1c1b18]/45">
                <th className="px-5 py-3 font-semibold">Title</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Category</th>
                <th className="px-5 py-3 font-semibold">Publish date</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-t border-black/[0.05] transition-colors hover:bg-[#faf9f6]">
                  <td className="px-5 py-3.5">
                    <Link to="/admin/$id" params={{ id: p.id }} className="font-semibold text-[#1c1b18] hover:text-[#9a8666] cursor-pointer">
                      {p.title || "(untitled)"}
                    </Link>
                    <div className="text-xs text-[#1c1b18]/40">/{p.slug}</div>
                  </td>
                  <td className="px-5 py-3.5"><StatusBadge post={p} /></td>
                  <td className="px-5 py-3.5 text-[#1c1b18]/70">{p.category}</td>
                  <td className="px-5 py-3.5 text-[#1c1b18]/70">
                    {p.published_at ? new Date(p.published_at).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to="/admin/$id"
                        params={{ id: p.id }}
                        className="grid h-8 w-8 place-items-center rounded-lg text-[#1c1b18]/50 transition-colors hover:bg-black/5 hover:text-[#1c1b18] cursor-pointer"
                        aria-label="Edit"
                      >
                        <PenLine className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => onDelete(p)}
                        disabled={busy === p.id}
                        className="grid h-8 w-8 place-items-center rounded-lg text-red-500/70 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50 cursor-pointer"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <p className="text-[#1c1b18]/50">No posts yet.</p>
                    <Link to="/admin/$id" params={{ id: "new" }} className={`${ADMIN.btnPrimary} mt-4`}>
                      <Plus className="h-4 w-4" /> Create your first post
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}

function QuickLink({ to, title, desc }: { to: string; title: string; desc: string }) {
  return (
    <Link to={to} className={`group ${ADMIN.card} flex items-start justify-between gap-4 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_1px_2px_rgba(17,17,17,0.04),0_18px_40px_-24px_rgba(17,17,17,0.35)] cursor-pointer`}>
      <div>
        <h3 className="text-[#1c1b18]" style={{ ...ADMIN.heading, fontSize: "20px" }}>{title}</h3>
        <p className="mt-1 text-sm text-[#1c1b18]/55">{desc}</p>
      </div>
      <ExternalLink className="h-4 w-4 shrink-0 text-[#9a8666] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </Link>
  );
}

function StatusBadge({ post }: { post: AdminPost }) {
  if (post.status === "draft") {
    return <Pill className="bg-amber-100 text-amber-800">Draft</Pill>;
  }
  if (isScheduled(post)) {
    return <Pill className="bg-blue-100 text-blue-800">Scheduled</Pill>;
  }
  return <Pill className="bg-emerald-100 text-emerald-800">Published</Pill>;
}

function Pill({ children, className }: { children: React.ReactNode; className: string }) {
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}>{children}</span>;
}
