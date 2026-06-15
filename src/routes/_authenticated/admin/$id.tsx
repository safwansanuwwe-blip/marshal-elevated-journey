import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  getPostById,
  savePost,
  uploadCoverImage,
  type AdminPost,
} from "@/lib/posts.functions";

async function getAccessToken(): Promise<string> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Your session has expired. Please sign in again.");
  return token;
}

export const Route = createFileRoute("/_authenticated/admin/$id")({
  head: () => ({
    meta: [{ title: "Edit post · Marshal Holidays" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  loader: async ({ params }) => {
    if (params.id === "new") return { post: null };
    const post = await getPostById({ data: { id: params.id, accessToken: await getAccessToken() } });
    return { post };
  },
  component: EditorPage,
  errorComponent: ({ error }) => (
    <div className="p-10 text-red-600">Editor load failed: {error.message}</div>
  ),
});

type FormState = {
  id: string | null;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  category: string;
  tagsText: string;
  author: string;
  meta_title: string;
  meta_description: string;
  reading_minutes: number;
  status: "draft" | "published";
  scheduled_for_local: string; // datetime-local
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromLocalInput(s: string): string | null {
  if (!s) return null;
  return new Date(s).toISOString();
}

function EditorPage() {
  const { post } = Route.useLoaderData() as { post: AdminPost | null };
  const navigate = useNavigate();
  const qc = useQueryClient();
  const save = useServerFn(savePost);
  const upload = useServerFn(uploadCoverImage);

  const initial: FormState = useMemo(
    () => ({
      id: post?.id ?? null,
      slug: post?.slug ?? "",
      title: post?.title ?? "",
      excerpt: post?.excerpt ?? "",
      content: post?.content ?? "",
      cover_image: post?.cover_image ?? null,
      category: post?.category ?? "Destination Guides",
      tagsText: (post?.tags ?? []).join(", "),
      author: post?.author ?? "Marshal Holidays Editorial",
      meta_title: post?.meta_title ?? "",
      meta_description: post?.meta_description ?? "",
      reading_minutes: post?.reading_minutes ?? 5,
      status: post?.status ?? "draft",
      scheduled_for_local: toLocalInput(post?.scheduled_for ?? post?.published_at ?? null),
    }),
    [post],
  );

  const [f, setF] = useState<FormState>(initial);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => setF(initial), [initial]);

  function update<K extends keyof FormState>(k: K, v: FormState[K]) {
    setF((s) => ({ ...s, [k]: v }));
  }

  async function handleSave(status: "draft" | "published") {
    setBusy(true);
    setErr(null);
    try {
      const scheduledISO = fromLocalInput(f.scheduled_for_local);
      const isFuture = scheduledISO ? new Date(scheduledISO) > new Date() : false;
      const saved = await save({
        data: {
          accessToken: await getAccessToken(),
          id: f.id,
          slug: f.slug || slugify(f.title),
          title: f.title,
          excerpt: f.excerpt,
          content: f.content,
          cover_image: f.cover_image,
          category: f.category,
          tags: f.tagsText
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          author: f.author,
          meta_title: f.meta_title || null,
          meta_description: f.meta_description || null,
          reading_minutes: Number(f.reading_minutes) || 5,
          status,
          published_at: status === "published" && !isFuture ? new Date().toISOString() : null,
          scheduled_for: isFuture ? scheduledISO : null,
        },
      });
      await qc.invalidateQueries({ queryKey: ["admin", "posts"] });
      if (!f.id) navigate({ to: "/admin/$id", params: { id: saved.id } });
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      setErr("Image must be under 8 MB");
      return;
    }
    setUploading(true);
    setErr(null);
    try {
      const buf = await file.arrayBuffer();
      let bin = "";
      const bytes = new Uint8Array(buf);
      for (let i = 0; i < bytes.byteLength; i++) bin += String.fromCharCode(bytes[i]);
      const base64 = btoa(bin);
      const res = await upload({
        data: {
          filename: file.name,
          contentType: file.type || "image/jpeg",
          base64,
          accessToken: await getAccessToken(),
        },
      });
      update("cover_image", res.url);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  const lbl = "block text-xs font-semibold text-[#272835]/70 mb-1 uppercase tracking-wider";
  const inp =
    "w-full rounded-md border border-black/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#9a8666]/40 bg-white";

  return (
    <div className="min-h-screen bg-[#fafafa]" style={{ fontFamily: "Inter, sans-serif" }}>
      <header className="border-b border-black/5 bg-white sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link to="/admin" className="text-sm text-[#272835]/60 hover:text-[#272835]">← All posts</Link>
            <span className="text-[#272835]/30">·</span>
            <span className="truncate text-sm font-semibold text-[#272835]">
              {f.id ? "Edit post" : "New post"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSave("draft")}
              disabled={busy}
              className="rounded-md border border-black/10 bg-white text-[#272835] px-4 py-2 text-sm font-semibold hover:bg-[#fafafa] disabled:opacity-50"
            >
              Save draft
            </button>
            <button
              onClick={() => handleSave("published")}
              disabled={busy || !f.title}
              className="rounded-md bg-[#272835] text-white px-4 py-2 text-sm font-semibold hover:bg-black disabled:opacity-50"
            >
              {f.scheduled_for_local && new Date(f.scheduled_for_local) > new Date()
                ? "Schedule"
                : "Publish"}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-5">
          {err && (
            <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{err}</div>
          )}

          <div>
            <label className={lbl}>Title</label>
            <input
              className={inp + " text-lg font-semibold"}
              value={f.title}
              onChange={(e) => {
                update("title", e.target.value);
                if (!f.id && !f.slug) update("slug", slugify(e.target.value));
              }}
              placeholder="A great Kerala story…"
            />
          </div>

          <div>
            <label className={lbl}>Slug (URL)</label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#272835]/50">/blog/</span>
              <input className={inp} value={f.slug} onChange={(e) => update("slug", slugify(e.target.value))} />
            </div>
          </div>

          <div>
            <label className={lbl}>Excerpt (shown in cards & previews)</label>
            <textarea
              className={inp}
              rows={3}
              value={f.excerpt}
              onChange={(e) => update("excerpt", e.target.value)}
              maxLength={500}
            />
          </div>

          <div>
            <label className={lbl}>Content</label>
            <textarea
              className={inp + " font-mono text-sm"}
              rows={22}
              value={f.content}
              onChange={(e) => update("content", e.target.value)}
              placeholder={`Write in markdown-ish format:\n\n## Section heading\nParagraph text…\n\n- Bullet item\n\n> Pull quote`}
            />
            <p className="text-xs text-[#272835]/50 mt-1">
              Supported: <code>## headings</code>, <code>- lists</code>, <code>&gt; quotes</code>, paragraphs.
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-5">
          <section className="rounded-xl border border-black/5 bg-white p-5 space-y-3">
            <h3 className="text-sm font-semibold text-[#272835]">Featured image</h3>
            {f.cover_image ? (
              <div className="relative">
                <img src={f.cover_image} alt="" className="w-full aspect-[16/10] object-cover rounded-md" />
                <button
                  onClick={() => update("cover_image", null)}
                  className="absolute top-2 right-2 rounded-md bg-white/90 px-2 py-1 text-xs font-semibold text-red-600"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="aspect-[16/10] rounded-md border-2 border-dashed border-black/10 flex items-center justify-center text-xs text-[#272835]/40">
                No image
              </div>
            )}
            <label className="block">
              <span className="sr-only">Upload</span>
              <input type="file" accept="image/*" onChange={onFile} disabled={uploading} className="block w-full text-xs" />
            </label>
            {uploading && <p className="text-xs text-[#272835]/60">Uploading…</p>}
          </section>

          <section className="rounded-xl border border-black/5 bg-white p-5 space-y-3">
            <h3 className="text-sm font-semibold text-[#272835]">Publishing</h3>
            <div>
              <label className={lbl}>Status</label>
              <select
                className={inp}
                value={f.status}
                onChange={(e) => update("status", e.target.value as "draft" | "published")}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div>
              <label className={lbl}>Schedule for (optional)</label>
              <input
                type="datetime-local"
                className={inp}
                value={f.scheduled_for_local}
                onChange={(e) => update("scheduled_for_local", e.target.value)}
              />
              <p className="text-xs text-[#272835]/50 mt-1">
                Set a future date + click <strong>Schedule</strong>. The post becomes visible on the public blog at that time.
              </p>
            </div>
          </section>

          <section className="rounded-xl border border-black/5 bg-white p-5 space-y-3">
            <h3 className="text-sm font-semibold text-[#272835]">Taxonomy</h3>
            <div>
              <label className={lbl}>Category</label>
              <input className={inp} value={f.category} onChange={(e) => update("category", e.target.value)} />
            </div>
            <div>
              <label className={lbl}>Tags (comma-separated)</label>
              <input className={inp} value={f.tagsText} onChange={(e) => update("tagsText", e.target.value)} />
            </div>
            <div>
              <label className={lbl}>Author</label>
              <input className={inp} value={f.author} onChange={(e) => update("author", e.target.value)} />
            </div>
            <div>
              <label className={lbl}>Reading time (minutes)</label>
              <input
                type="number"
                min={1}
                max={120}
                className={inp}
                value={f.reading_minutes}
                onChange={(e) => update("reading_minutes", Number(e.target.value) || 1)}
              />
            </div>
          </section>

          <section className="rounded-xl border border-black/5 bg-white p-5 space-y-3">
            <h3 className="text-sm font-semibold text-[#272835]">SEO</h3>
            <div>
              <label className={lbl}>Meta title</label>
              <input
                className={inp}
                value={f.meta_title}
                onChange={(e) => update("meta_title", e.target.value)}
                maxLength={80}
                placeholder="Falls back to post title"
              />
              <p className="text-[10px] text-[#272835]/50 mt-1">{f.meta_title.length}/80</p>
            </div>
            <div>
              <label className={lbl}>Meta description</label>
              <textarea
                className={inp}
                rows={3}
                value={f.meta_description}
                onChange={(e) => update("meta_description", e.target.value)}
                maxLength={200}
                placeholder="Falls back to excerpt"
              />
              <p className="text-[10px] text-[#272835]/50 mt-1">{f.meta_description.length}/200</p>
            </div>
          </section>
        </aside>
      </main>
    </div>
  );
}
