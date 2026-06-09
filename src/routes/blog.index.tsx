import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, Clock, Tag } from "lucide-react";
import BlogHeader from "@/components/BlogHeader";
import BlogFooter from "@/components/BlogFooter";
import { listPublishedPosts, type PublicPost } from "@/lib/posts.functions";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
}

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog — Kerala Travel Stories & Guides | Marshal Holidays" },
      {
        name: "description",
        content:
          "Destination guides, itineraries, travel tips, and behind-the-scenes stories from Marshal Holidays — Kerala's premium chauffeur-driven travel partner.",
      },
      { property: "og:title", content: "Blog — Kerala Travel Stories & Guides | Marshal Holidays" },
      { property: "og:description", content: "Kerala journey updates, destination guides, and travel tips from Marshal Holidays." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/blog" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Blog — Marshal Holidays" },
      { name: "twitter:description", content: "Kerala journey updates, destination guides, and travel tips from Marshal Holidays." },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  loader: () => listPublishedPosts(),
  component: BlogIndex,
  errorComponent: ({ error }) => (
    <div className="min-h-screen bg-white">
      <BlogHeader />
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "56px" }}>The blog is loading</h1>
        <p className="mt-4 text-[#272835]/70">{error.message}</p>
      </div>
      <BlogFooter />
    </div>
  ),
});

function BlogIndex() {
  const posts = Route.useLoaderData() as PublicPost[];
  const featured = posts[0];
  const rest = posts.slice(1);
  const categories = Array.from(new Set(posts.map((p) => p.category))).sort();

  return (
    <div className="min-h-screen bg-white text-[#272835]">
      <BlogHeader />

      <section
        className="border-b border-black/5 bg-gradient-to-b from-[#fafafa] to-white"
        style={{ paddingLeft: "clamp(20px, 6vw, 80px)", paddingRight: "clamp(20px, 6vw, 80px)" }}
      >
        <div className="mx-auto max-w-6xl py-16 md:py-24">
          <p className="text-[#9a8666] uppercase mb-4"
            style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 600, letterSpacing: "0.18em" }}>
            The Marshal Journal
          </p>
          <h1 className="leading-[0.95] tracking-tight"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(44px, 7vw, 96px)" }}>
            Kerala stories, travel guides & journey notes
          </h1>
          <p className="mt-6 max-w-2xl text-[#272835]/70"
            style={{ fontFamily: "Inter, sans-serif", fontSize: "17px", lineHeight: 1.6 }}>
            Destination guides, itineraries, fleet news, and the hard-earned road wisdom from twelve years of chauffeur-driven travel across South India.
          </p>

          {categories.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {categories.map((c) => (
                <span key={c}
                  className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 py-1.5 text-[#272835]/80"
                  style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 500 }}>
                  <Tag className="h-3 w-3" />
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {featured && (
        <section style={{ paddingLeft: "clamp(20px, 6vw, 80px)", paddingRight: "clamp(20px, 6vw, 80px)" }}>
          <div className="mx-auto max-w-6xl py-12 md:py-16">
            <FeaturedCard post={featured} />
          </div>
        </section>
      )}

      <section
        className="bg-[#fafafa] border-t border-black/5"
        style={{ paddingLeft: "clamp(20px, 6vw, 80px)", paddingRight: "clamp(20px, 6vw, 80px)" }}
      >
        <div className="mx-auto max-w-6xl py-16 md:py-20">
          <h2 className="mb-10" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(28px, 4vw, 44px)" }}>
            Latest posts
          </h2>
          {rest.length === 0 && !featured && (
            <p className="text-[#272835]/60">No published posts yet. Check back soon.</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {rest.map((p) => <PostCard key={p.slug} post={p} />)}
          </div>
        </div>
      </section>

      <BlogFooter />
    </div>
  );
}

function FeaturedCard({ post }: { post: PublicPost }) {
  return (
    <Link to="/blog/$slug" params={{ slug: post.slug }}
      className="group block overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-all hover:shadow-xl">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[420px] overflow-hidden bg-[#f3f3f3]">
          {post.cover_image && (
            <img src={post.cover_image} alt={post.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
          )}
          <span className="absolute top-5 left-5 rounded-full bg-white/95 px-3 py-1.5 text-[#272835]"
            style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 600, letterSpacing: "0.04em" }}>
            Featured · {post.category}
          </span>
        </div>
        <div className="flex flex-col justify-center p-8 md:p-12">
          <MetaRow post={post} />
          <h3 className="mt-4 leading-[1.05]"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(28px, 3.4vw, 44px)" }}>
            {post.title}
          </h3>
          <p className="mt-4 text-[#272835]/70"
            style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", lineHeight: 1.6 }}>
            {post.excerpt}
          </p>
          <span className="mt-6 inline-flex items-center gap-2 text-[#272835] group-hover:gap-3 transition-all"
            style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 600 }}>
            Read article <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function PostCard({ post }: { post: PublicPost }) {
  return (
    <Link to="/blog/$slug" params={{ slug: post.slug }}
      className="group flex flex-col overflow-hidden rounded-xl border border-black/5 bg-white transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[16/10] overflow-hidden bg-[#f3f3f3]">
        {post.cover_image && (
          <img src={post.cover_image} alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        )}
        <span className="absolute top-4 left-4 rounded-full bg-white/95 px-2.5 py-1 text-[#272835]"
          style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 600, letterSpacing: "0.04em" }}>
          {post.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <MetaRow post={post} small />
        <h3 className="mt-3 leading-tight" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "26px" }}>
          {post.title}
        </h3>
        <p className="mt-3 text-[#272835]/70 line-clamp-3"
          style={{ fontFamily: "Inter, sans-serif", fontSize: "14.5px", lineHeight: 1.55 }}>
          {post.excerpt}
        </p>
        <span className="mt-auto pt-5 inline-flex items-center gap-2 text-[#272835] group-hover:gap-3 transition-all"
          style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 600 }}>
          Read more <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}

function MetaRow({ post, small = false }: { post: PublicPost; small?: boolean }) {
  const size = small ? "12px" : "13px";
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[#272835]/60"
      style={{ fontFamily: "Inter, sans-serif", fontSize: size, fontWeight: 500 }}>
      <span className="inline-flex items-center gap-1.5">
        <Calendar className="h-3.5 w-3.5" /> {formatDate(post.published_at)}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5" /> {post.reading_minutes} min read
      </span>
    </div>
  );
}
