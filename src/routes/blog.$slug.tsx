import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Calendar, Clock, Facebook, Linkedin, Link as LinkIcon, Twitter } from "lucide-react";
import BlogHeader from "@/components/BlogHeader";
import BlogFooter from "@/components/BlogFooter";
import {
  getPublishedPostBySlug,
  listPublishedPosts,
  type PublicPost,
} from "@/lib/posts.functions";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
}

function pickRelated(current: PublicPost, all: PublicPost[], limit = 3): PublicPost[] {
  return all
    .filter((p) => p.slug !== current.slug)
    .map((p) => {
      const sameCat = p.category === current.category ? 2 : 0;
      const overlap = p.tags.filter((t) => current.tags.includes(t)).length;
      return { p, score: sameCat + overlap };
    })
    .sort((a, b) => b.score - a.score || (a.p.published_at < b.p.published_at ? 1 : -1))
    .slice(0, limit)
    .map((s) => s.p);
}

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const post = await getPublishedPostBySlug({ data: { slug: params.slug } });
    if (!post) throw notFound();
    const all = await listPublishedPosts();
    return { post, related: pickRelated(post, all) };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Post not found — Marshal Holidays" }] };
    const { post } = loaderData;
    const url = `/blog/${params.slug}`;
    const desc = post.meta_description ?? post.excerpt;
    const ogImage = post.cover_image ?? undefined;
    return {
      meta: [
        { title: post.meta_title ?? `${post.title} | Marshal Holidays` },
        { name: "description", content: desc },
        { name: "keywords", content: post.tags.join(", ") },
        { name: "author", content: post.author },
        { property: "article:published_time", content: post.published_at },
        { property: "article:section", content: post.category },
        ...post.tags.map((t) => ({ property: "article:tag", content: t })),
        { property: "og:type", content: "article" },
        { property: "og:title", content: post.title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
        ...(ogImage ? [{ property: "og:image", content: ogImage }] : []),
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: post.title },
        { name: "twitter:description", content: desc },
        ...(ogImage ? [{ name: "twitter:image", content: ogImage }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: desc,
            image: ogImage,
            datePublished: post.published_at,
            author: { "@type": "Organization", name: post.author },
            publisher: { "@type": "Organization", name: "Marshal Holidays" },
            articleSection: post.category,
            keywords: post.tags.join(", "),
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen bg-white">
      <BlogHeader />
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "72px" }}>Post not found</h1>
        <p className="mt-4 text-[#272835]/70" style={{ fontFamily: "Inter, sans-serif" }}>
          The article you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/blog"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#272835] text-white px-5 h-11"
          style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 600 }}
        >
          <ArrowLeft className="h-4 w-4" /> Back to blog
        </Link>
      </div>
      <BlogFooter />
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen bg-white">
      <BlogHeader />
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "56px" }}>Something went wrong</h1>
        <p className="mt-4 text-[#272835]/70" style={{ fontFamily: "Inter, sans-serif" }}>{error.message}</p>
      </div>
      <BlogFooter />
    </div>
  ),
  component: PostPage,
});

function PostPage() {
  const { post, related } = Route.useLoaderData() as { post: PublicPost; related: PublicPost[] };
  const shareUrl = `/blog/${post.slug}`;

  return (
    <div className="min-h-screen bg-white text-[#272835]">
      <BlogHeader />

      <article>
        <header
          className="border-b border-black/5"
          style={{ paddingLeft: "clamp(20px, 6vw, 80px)", paddingRight: "clamp(20px, 6vw, 80px)" }}
        >
          <div className="mx-auto max-w-3xl pt-12 md:pt-20 pb-10">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-[#272835]/60 hover:text-[#272835]"
              style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 500 }}
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to blog
            </Link>
            <p
              className="mt-6 text-[#9a8666] uppercase"
              style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 600, letterSpacing: "0.18em" }}
            >
              {post.category}
            </p>
            <h1
              className="mt-3 leading-[0.98]"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(38px, 6vw, 80px)" }}
            >
              {post.title}
            </h1>
            <p
              className="mt-5 text-[#272835]/70"
              style={{ fontFamily: "Inter, sans-serif", fontSize: "18px", lineHeight: 1.6 }}
            >
              {post.excerpt}
            </p>
            <div
              className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[#272835]/60"
              style={{ fontFamily: "Inter, sans-serif", fontSize: "13.5px", fontWeight: 500 }}
            >
              <span>{post.author}</span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> {formatDate(post.published_at)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> {post.reading_minutes} min read
              </span>
            </div>
          </div>
        </header>

        {post.cover_image && (
          <div style={{ paddingLeft: "clamp(20px, 6vw, 80px)", paddingRight: "clamp(20px, 6vw, 80px)" }}>
            <div className="mx-auto max-w-5xl -mt-px">
              <div className="overflow-hidden rounded-2xl aspect-[16/9] bg-[#f3f3f3]">
                <img src={post.cover_image} alt={post.title} className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        )}

        <div style={{ paddingLeft: "clamp(20px, 6vw, 80px)", paddingRight: "clamp(20px, 6vw, 80px)" }}>
          <div className="mx-auto max-w-3xl py-12 md:py-16">
            <PostBody markdown={post.content} />

            {post.tags.length > 0 && (
              <div className="mt-12 flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-black/10 bg-[#fafafa] px-3 py-1 text-[#272835]/80"
                    style={{ fontFamily: "Inter, sans-serif", fontSize: "12.5px", fontWeight: 500 }}
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}

            <ShareBar url={shareUrl} title={post.title} />
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section
          className="bg-[#fafafa] border-t border-black/5"
          style={{ paddingLeft: "clamp(20px, 6vw, 80px)", paddingRight: "clamp(20px, 6vw, 80px)" }}
        >
          <div className="mx-auto max-w-6xl py-16 md:py-20">
            <h2 className="mb-8" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(28px, 4vw, 44px)" }}>
              Keep reading
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => (
                <RelatedCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <BlogFooter />
    </div>
  );
}

function RelatedCard({ post }: { post: PublicPost }) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="group flex flex-col overflow-hidden rounded-xl border border-black/5 bg-white transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="aspect-[16/10] overflow-hidden bg-[#f3f3f3]">
        {post.cover_image && (
          <img
            src={post.cover_image}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>
      <div className="flex flex-col p-5">
        <p
          className="text-[#9a8666] uppercase"
          style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 600, letterSpacing: "0.14em" }}
        >
          {post.category}
        </p>
        <h3 className="mt-2 leading-tight" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "22px" }}>
          {post.title}
        </h3>
        <span
          className="mt-4 inline-flex items-center gap-1.5 text-[#272835] group-hover:gap-2.5 transition-all"
          style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 600 }}
        >
          Read <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}

function ShareBar({ url, title }: { url: string; title: string }) {
  const handleCopy = () => {
    if (typeof window === "undefined") return;
    const abs = new URL(url, window.location.origin).toString();
    navigator.clipboard?.writeText(abs);
  };
  const enc = encodeURIComponent;
  const share = (network: "twitter" | "facebook" | "linkedin") => {
    if (typeof window === "undefined") return;
    const abs = new URL(url, window.location.origin).toString();
    const map = {
      twitter: `https://twitter.com/intent/tweet?url=${enc(abs)}&text=${enc(title)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${enc(abs)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(abs)}`,
    };
    window.open(map[network], "_blank", "noopener,noreferrer,width=600,height=600");
  };

  return (
    <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-black/10 pt-8">
      <span className="text-[#272835]/60 mr-1" style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 500 }}>
        Share this story
      </span>
      <button type="button" onClick={() => share("twitter")} aria-label="Share on Twitter"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-[#272835] transition-colors hover:bg-[#272835] hover:text-white">
        <Twitter className="h-4 w-4" />
      </button>
      <button type="button" onClick={() => share("facebook")} aria-label="Share on Facebook"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-[#272835] transition-colors hover:bg-[#272835] hover:text-white">
        <Facebook className="h-4 w-4" />
      </button>
      <button type="button" onClick={() => share("linkedin")} aria-label="Share on LinkedIn"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-[#272835] transition-colors hover:bg-[#272835] hover:text-white">
        <Linkedin className="h-4 w-4" />
      </button>
      <button type="button" onClick={handleCopy} aria-label="Copy link"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-[#272835] transition-colors hover:bg-[#272835] hover:text-white">
        <LinkIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

function PostBody({ markdown }: { markdown: string }) {
  const blocks = markdown.trim().split(/\n{2,}/);
  return (
    <div className="space-y-6">
      {blocks.map((raw, i) => {
        const block = raw.trim();
        if (block.startsWith("## ")) {
          return (
            <h2 key={i} className="mt-10 leading-tight"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(26px, 3vw, 36px)" }}>
              {block.replace(/^##\s+/, "")}
            </h2>
          );
        }
        if (block.startsWith("> ")) {
          return (
            <blockquote key={i}
              className="border-l-4 border-[#9a8666] bg-[#fafafa] pl-5 pr-4 py-4 rounded-r-lg text-[#272835]/85"
              style={{ fontFamily: "'Caveat', cursive", fontSize: "22px", lineHeight: 1.5 }}>
              {block.replace(/^>\s+/, "")}
            </blockquote>
          );
        }
        if (/^- /m.test(block) && block.split("\n").every((l) => l.startsWith("- "))) {
          const items = block.split("\n").map((l) => l.replace(/^- /, ""));
          return (
            <ul key={i} className="list-disc pl-6 space-y-2 text-[#272835]/85"
              style={{ fontFamily: "Inter, sans-serif", fontSize: "16.5px", lineHeight: 1.7 }}>
              {items.map((it, j) => <li key={j}>{it}</li>)}
            </ul>
          );
        }
        return (
          <p key={i} className="text-[#272835]/85"
            style={{ fontFamily: "Inter, sans-serif", fontSize: "16.5px", lineHeight: 1.75 }}>
            {block}
          </p>
        );
      })}
    </div>
  );
}
