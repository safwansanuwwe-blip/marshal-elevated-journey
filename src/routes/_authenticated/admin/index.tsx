import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { listAllPosts, deletePost, type AdminPost } from "@/lib/posts.functions";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({
    meta: [{ title: "Admin · Marshal Holidays" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData({
      queryKey: ["admin", "posts"],
      queryFn: () => listAllPosts(),
    }),
  component: AdminHome,
  errorComponent: ({ error }) => (
    <div className="p-10 text-red-600">Admin load failed: {error.message}</div>
  ),
});

function AdminHome() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const del = useServerFn(deletePost);
  const { data: posts } = useSuspenseQuery<<AdminPost[]>({
    queryKey: ["admin", "posts"],
    queryFn: () => listAllPosts(),
  });

  const [busy, setBusy] = useState<string | null>(null);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  async function onDelete(p: AdminPost) {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    setBusy(p.id);
    try {
      await del({ data: { id: p.id } });
      await qc.invalidateQueries({ queryKey: ["admin", "posts"] });
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-[#9a8666] text-[11px] font-semibold tracking-[0.18em] uppercase" style={{ fontFamily: "Inter, sans-serif" }}>
              Marshal Holidays · CMS
            </p>
            <h1 className="text-[#272835] leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "36px" }}>
              Blog dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/blog" className="text-sm text-[#272835]/70 hover:text-[#272835]" style={{ fontFamily: "Inter, sans-serif" }}>
              View public blog ↗
            </Link>
            <button
              onClick={signOut}
              className="text-sm text-[#272835]/70 hover:text-[#272835]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#272835]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "28px" }}>
            All posts ({posts.length})
          </h2>
          <Link
            to="/admin/$id"
            params={{ id: "new" }}
            className="rounded-md bg-[#272835] text-white px-4 py-2 text-sm font-semibold hover:bg-black"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            + New post
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl border border-black/5 bg-white">
          <table className="w-full text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
            <thead className="bg-[#fafafa] text-[#272835]/60">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Title</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-left px-4 py-3 font-semibold">Category</th>
                <th className="text-left px-4 py-3 font-semibold">Publish date</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-t border-black/5">
                  <td className="px-4 py-3">
                    <Link to="/admin/$id" params={{ id: p.id }} className="font-semibold text-[#272835] hover:underline">
                      {p.title || "(untitled)"}
                    </Link>
                    <div className="text-xs text-[#272835]/50">/{p.slug}</div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge post={p} />
                  </td>
                  <td className="px-4 py-3 text-[#272835]/70">{p.category}</td>
                  <td className="px-4 py-3 text-[#272835]/70">
                    {p.published_at ? new Date(p.published_at).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onDelete(p)}
                      disabled={busy === p.id}
                      className="text-red-600 hover:text-red-700 text-xs font-semibold disabled:opacity-50"
                    >
                      {busy === p.id ? "Deleting…" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-[#272835]/60">
                    No posts yet. Click <strong>+ New post</strong> to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

function StatusBadge({ post }: { post: AdminPost }) {
  if (post.status === "draft") {
    return <span className="rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-xs font-semibold">Draft</span>;
  }
  if (post.published_at && new Date(post.published_at) > new Date()) {
    return <span className="rounded-full bg-blue-100 text-blue-800 px-2 py-0.5 text-xs font-semibold">Scheduled</span>;
  }
  return <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-xs font-semibold">Published</span>;
}
