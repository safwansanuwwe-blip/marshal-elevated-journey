import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { listAllPosts, type AdminPost } from "@/lib/posts.functions";
import {
  SITE,
  auditPost,
  buildSitemapXml,
  type SeoCheck,
} from "@/lib/site";

async function getAccessToken(): Promise<string> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Your session has expired. Please sign in again.");
  return token;
}

export const Route = createFileRoute("/_authenticated/admin/seo")({
  head: () => ({
    meta: [
      { title: "SEO Center · Marshal Holidays" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData({
      queryKey: ["admin", "posts"],
      queryFn: async () => listAllPosts({ data: { accessToken: await getAccessToken() } }),
    }),
  component: SeoCenter,
  errorComponent: ({ error }) => (
    <div className="p-10 text-red-600">SEO Center load failed: {error.message}</div>
  ),
});

function isLivePublished(p: AdminPost): boolean {
  return p.status === "published" && !!p.published_at && new Date(p.published_at) <= new Date();
}

function SeoCenter() {
  const { data: posts } = useSuspenseQuery<AdminPost[]>({
    queryKey: ["admin", "posts"],
    queryFn: async () => listAllPosts({ data: { accessToken: await getAccessToken() } }),
  });

  const audits = useMemo(
    () => posts.map((p) => ({ post: p, ...auditPost(p) })),
    [posts],
  );

  const published = posts.filter(isLivePublished);
  const avgScore = audits.length
    ? Math.round(audits.reduce((s, a) => s + a.score, 0) / audits.length)
    : 0;
  const needsWork = audits.filter((a) => a.score < 80).length;
  const missingImage = posts.filter((p) => !p.cover_image).length;

  return (
    <div className="min-h-screen bg-[#fafafa]" style={{ fontFamily: "Inter, sans-serif" }}>
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-[#9a8666] text-[11px] font-semibold tracking-[0.18em] uppercase">
              Marshal Holidays · CMS
            </p>
            <h1 className="text-[#272835] leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "36px" }}>
              SEO Center
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/admin" className="text-sm text-[#272835]/70 hover:text-[#272835]">
              ← Dashboard
            </Link>
            <a
              href={`${SITE.url}/blog`}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-[#272835]/70 hover:text-[#272835]"
            >
              View blog ↗
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 space-y-10">
        {/* Overview stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total posts" value={String(posts.length)} />
          <StatCard label="Live / published" value={String(published.length)} />
          <StatCard
            label="Avg SEO score"
            value={`${avgScore}`}
            tone={avgScore >= 80 ? "good" : avgScore >= 50 ? "warn" : "bad"}
          />
          <StatCard
            label="Need attention"
            value={String(needsWork)}
            tone={needsWork === 0 ? "good" : "warn"}
          />
        </section>

        {/* Site-wide SEO */}
        <section>
          <SectionTitle>Site-wide SEO</SectionTitle>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-xl border border-black/5 bg-white p-6 space-y-4">
              <Field label="Site title" value={SITE.title} max={60} />
              <Field label="Meta description" value={SITE.description} max={160} multiline />
              <Field label="Canonical URL" value={SITE.url} />
              <Field label="Phone / WhatsApp" value={SITE.phone} />
              <p className="text-xs text-[#272835]/50 leading-relaxed pt-1">
                These defaults apply to every page and power the homepage's Organization &amp;
                WebSite structured data. Edit them in{" "}
                <code className="rounded bg-[#f3f3f3] px-1">src/lib/site.ts</code>.
              </p>
            </div>

            {/* Google preview of the homepage */}
            <div className="rounded-xl border border-black/5 bg-white p-6">
              <h3 className="text-sm font-semibold text-[#272835] mb-3">Google preview — homepage</h3>
              <SerpPreview
                url={SITE.url}
                title={SITE.title}
                description={SITE.description}
              />
              <h3 className="text-sm font-semibold text-[#272835] mt-6 mb-3">Social card</h3>
              <SocialPreview
                title={SITE.title}
                description={SITE.socialDescription}
                image={SITE.ogImage}
                domain={new URL(SITE.url).hostname}
              />
            </div>
          </div>
        </section>

        {/* Per-post audit */}
        <section>
          <SectionTitle>
            Post SEO audit ({posts.length})
          </SectionTitle>
          <div className="overflow-hidden rounded-xl border border-black/5 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-[#fafafa] text-[#272835]/60">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Post</th>
                  <th className="text-left px-4 py-3 font-semibold w-28">Score</th>
                  <th className="text-left px-4 py-3 font-semibold">Issues</th>
                  <th className="px-4 py-3 w-20"></th>
                </tr>
              </thead>
              <tbody>
                {audits.map(({ post, score, checks }) => {
                  const issues = checks.filter((c) => c.status !== "good");
                  return (
                    <tr key={post.id} className="border-t border-black/5 align-top">
                      <td className="px-4 py-3">
                        <Link to="/admin/$id" params={{ id: post.id }} className="font-semibold text-[#272835] hover:underline">
                          {post.title || "(untitled)"}
                        </Link>
                        <div className="text-xs text-[#272835]/50">/{post.slug}</div>
                      </td>
                      <td className="px-4 py-3">
                        <ScorePill score={score} />
                      </td>
                      <td className="px-4 py-3">
                        {issues.length === 0 ? (
                          <span className="text-emerald-700 text-xs font-medium">All checks passed ✓</span>
                        ) : (
                          <ul className="space-y-1">
                            {issues.map((c) => (
                              <li key={c.label} className="flex items-start gap-1.5 text-xs">
                                <Dot status={c.status} />
                                <span className="text-[#272835]/70">
                                  <strong className="text-[#272835]">{c.label}:</strong> {c.detail}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          to="/admin/$id"
                          params={{ id: post.id }}
                          className="text-xs font-semibold text-[#9a8666] hover:text-[#272835]"
                        >
                          Fix →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
                {posts.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center text-[#272835]/60">
                      No posts yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[#272835]/50 mt-3">
            {missingImage > 0
              ? `${missingImage} post(s) have no cover image — those links share without a preview thumbnail.`
              : "Every post has a cover image for rich social sharing. ✓"}
          </p>
        </section>

        {/* Sitemap generator */}
        <SitemapTool published={published} />

        {/* robots preview */}
        <section>
          <SectionTitle>robots.txt</SectionTitle>
          <pre className="rounded-xl border border-black/5 bg-white p-5 text-xs text-[#272835]/80 overflow-x-auto">{`User-agent: *
Allow: /
Disallow: /admin
Disallow: /auth

Sitemap: ${SITE.url}/sitemap.xml`}</pre>
          <p className="text-xs text-[#272835]/50 mt-2">
            Served from <code className="rounded bg-[#f3f3f3] px-1">public/robots.txt</code>. Admin
            &amp; auth pages are excluded from search engines.
          </p>
        </section>
      </main>
    </div>
  );
}

function SitemapTool({ published }: { published: AdminPost[] }) {
  const xml = useMemo(
    () =>
      buildSitemapXml(
        published.map((p) => ({ slug: p.slug, updated_at: p.updated_at, published_at: p.published_at })),
      ),
    [published],
  );
  const [copied, setCopied] = useState(false);

  function copy() {
    if (typeof navigator === "undefined") return;
    navigator.clipboard?.writeText(xml).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  function download() {
    if (typeof window === "undefined") return;
    const blob = new Blob([xml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sitemap.xml";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section>
      <SectionTitle>Sitemap generator</SectionTitle>
      <div className="rounded-xl border border-black/5 bg-white p-6 space-y-3">
        <p className="text-sm text-[#272835]/70">
          Generates a complete <code className="rounded bg-[#f3f3f3] px-1">sitemap.xml</code> for the
          homepage, blog, and all {published.length} live post(s). Download it and replace{" "}
          <code className="rounded bg-[#f3f3f3] px-1">public/sitemap.xml</code>, then re-deploy — or
          submit it in Google Search Console.
        </p>
        <div className="flex gap-2">
          <button
            onClick={copy}
            className="rounded-md bg-[#272835] text-white px-4 py-2 text-sm font-semibold hover:bg-black"
          >
            {copied ? "Copied ✓" : "Copy XML"}
          </button>
          <button
            onClick={download}
            className="rounded-md border border-black/10 bg-white text-[#272835] px-4 py-2 text-sm font-semibold hover:bg-[#fafafa]"
          >
            Download sitemap.xml
          </button>
        </div>
        <textarea
          readOnly
          value={xml}
          rows={10}
          className="w-full rounded-md border border-black/10 bg-[#fafafa] px-3 py-2 font-mono text-xs text-[#272835]/80"
        />
      </div>
    </section>
  );
}

/* ---------- small presentational helpers ---------- */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[#272835] mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "26px" }}>
      {children}
    </h2>
  );
}

function StatCard({ label, value, tone }: { label: string; value: string; tone?: "good" | "warn" | "bad" }) {
  const color =
    tone === "good" ? "text-emerald-600" : tone === "warn" ? "text-amber-600" : tone === "bad" ? "text-red-600" : "text-[#272835]";
  return (
    <div className="rounded-xl border border-black/5 bg-white p-5">
      <div className={`leading-none ${color}`} style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "40px" }}>
        {value}
      </div>
      <div className="mt-1 text-xs text-[#272835]/60">{label}</div>
    </div>
  );
}

function ScorePill({ score }: { score: number }) {
  const cls =
    score >= 80
      ? "bg-emerald-100 text-emerald-800"
      : score >= 50
        ? "bg-amber-100 text-amber-800"
        : "bg-red-100 text-red-800";
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${cls}`}>{score}/100</span>;
}

function Dot({ status }: { status: SeoCheck["status"] }) {
  const c = status === "bad" ? "bg-red-500" : status === "warn" ? "bg-amber-500" : "bg-emerald-500";
  return <span className={`mt-1 h-1.5 w-1.5 flex-none rounded-full ${c}`} />;
}

function Field({
  label,
  value,
  max,
  multiline,
}: {
  label: string;
  value: string;
  max?: number;
  multiline?: boolean;
}) {
  const over = max ? value.length > max : false;
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-[#272835]/70 uppercase tracking-wider">{label}</label>
        {max && (
          <span className={`text-[10px] ${over ? "text-red-600" : "text-[#272835]/40"}`}>
            {value.length}/{max}
          </span>
        )}
      </div>
      <p className={`mt-1 text-sm text-[#272835] ${multiline ? "" : "truncate"}`}>{value}</p>
    </div>
  );
}

function SerpPreview({ url, title, description }: { url: string; title: string; description: string }) {
  return (
    <div className="rounded-lg border border-black/5 bg-[#fafafa] p-4">
      <div className="text-[12px] text-[#202124]/70 truncate">{url}</div>
      <div className="text-[18px] leading-tight text-[#1a0dab] mt-0.5 truncate">{title}</div>
      <div className="text-[13px] text-[#4d5156] mt-1 line-clamp-2">{description}</div>
    </div>
  );
}

function SocialPreview({
  title,
  description,
  image,
  domain,
}: {
  title: string;
  description: string;
  image: string;
  domain: string;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-black/10 max-w-md">
      <div className="aspect-[1.91/1] bg-[#f3f3f3]">
        {image && <img src={image} alt="" className="h-full w-full object-cover" />}
      </div>
      <div className="p-3 bg-[#f7f8fa]">
        <div className="text-[11px] uppercase text-[#606770] tracking-wide">{domain}</div>
        <div className="text-[14px] font-semibold text-[#1c1e21] mt-0.5 line-clamp-1">{title}</div>
        <div className="text-[12px] text-[#606770] mt-0.5 line-clamp-2">{description}</div>
      </div>
    </div>
  );
}
