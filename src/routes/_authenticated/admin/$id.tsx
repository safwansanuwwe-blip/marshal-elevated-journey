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
import { SITE, SEO_LIMITS, absoluteUrl } from "@/lib/site";

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

          <section className="rounded-xl border border-black/5 bg-white p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#272835]">SEO</h3>
              <SeoScoreBadge
                title={f.meta_title || f.title}
                desc={f.meta_description || f.excerpt}
                hasImage={!!f.cover_image}
              />
            </div>

            <div>
              <label className={lbl}>Meta title</label>
              <input
                className={inp}
                value={f.meta_title}
                onChange={(e) => update("meta_title", e.target.value)}
                maxLength={80}
                placeholder={f.title ? `Falls back to: ${f.title}` : "Falls back to post title"}
              />
              <QualityBar
                length={(f.meta_title || f.title).length}
                min={SEO_LIMITS.titleMin}
                max={SEO_LIMITS.titleMax}
              />
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
              <QualityBar
                length={(f.meta_description || f.excerpt).length}
                min={SEO_LIMITS.descMin}
                max={SEO_LIMITS.descMax}
              />
            </div>

            <div>
              <p className={lbl}>Google preview</p>
              <div className="rounded-lg border border-black/5 bg-[#fafafa] p-3">
                <div className="text-[11px] text-[#202124]/70 truncate">
                  {absoluteUrl(`/blog/${f.slug || slugify(f.title) || "your-post"}`)}
                </div>
                <div className="text-[15px] leading-tight text-[#1a0dab] mt-0.5 truncate">
                  {f.meta_title || f.title || "Your post title"}
                </div>
                <div className="text-[12px] text-[#4d5156] mt-1 line-clamp-2">
                  {f.meta_description || f.excerpt || "Your meta description or excerpt appears here."}
                </div>
              </div>
            </div>

            <div>
              <p className={lbl}>Social card</p>
              <div className="overflow-hidden rounded-lg border border-black/10">
                <div className="aspect-[1.91/1] bg-[#f3f3f3]">
                  <img
                    src={f.cover_image || SITE.ogImage}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-2.5 bg-[#f7f8fa]">
                  <div className="text-[10px] uppercase text-[#606770] tracking-wide">
                    {new URL(SITE.url).hostname}
                  </div>
                  <div className="text-[13px] font-semibold text-[#1c1e21] mt-0.5 line-clamp-1">
                    {f.meta_title || f.title || "Your post title"}
                  </div>
                </div>
              </div>
              {!f.cover_image && (
                <p className="text-[10px] text-amber-600 mt-1">
                  No cover image — a generic image is used. Add one above for a better preview.
                </p>
              )}
            </div>
          </section>
        </aside>
      </main>
    </div>
  );
}

/* ---------- SEO helpers ---------- */

function QualityBar({ length, min, max }: { length: number; min: number; max: number }) {
  let status: "empty" | "short" | "good" | "long";
  if (length === 0) status = "empty";
  else if (length < min) status = "short";
  else if (length > max) status = "long";
  else status = "good";

  const color =
    status === "good" ? "bg-emerald-500" : status === "empty" ? "bg-black/10" : "bg-amber-500";
  const pct = Math.min(100, Math.round((length / max) * 100));
  const msg =
    status === "empty"
      ? `Add ${min}-${max} characters`
      : status === "short"
        ? `Too short — aim for ${min}-${max}`
        : status === "long"
          ? `Too long — may be truncated`
          : "Ideal length";

  return (
    <div className="mt-1.5">
      <div className="h-1 w-full rounded-full bg-black/5 overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-1 flex items-center justify-between">
        <span
          className={`text-[10px] ${status === "good" ? "text-emerald-600" : status === "empty" ? "text-[#272835]/40" : "text-amber-600"}`}
        >
          {msg}
        </span>
        <span className="text-[10px] text-[#272835]/40">
          {length}/{max}
        </span>
      </div>
    </div>
  );
}

function SeoScoreBadge({ title, desc, hasImage }: { title: string; desc: string; hasImage: boolean }) {
  let pts = 0;
  const total = 3;
  if (title.length >= SEO_LIMITS.titleMin && title.length <= SEO_LIMITS.titleMax) pts++;
  else if (title.length > 0) pts += 0.5;
  if (desc.length >= SEO_LIMITS.descMin && desc.length <= SEO_LIMITS.descMax) pts++;
  else if (desc.length > 0) pts += 0.5;
  if (hasImage) pts++;

  const score = Math.round((pts / total) * 100);
  const cls =
    score >= 80
      ? "bg-emerald-100 text-emerald-800"
      : score >= 50
        ? "bg-amber-100 text-amber-800"
        : "bg-red-100 text-red-800";
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${cls}`}>SEO {score}</span>;
}
