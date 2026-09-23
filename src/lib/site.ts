// Central site + SEO configuration.
//
// One source of truth for the canonical URL, brand strings, and default
// social/OG metadata. Route `head()` functions and the admin SEO Center all
// read from here so on-page SEO stays consistent across the site.

const RAW_SITE_URL =
  (import.meta.env.VITE_SITE_URL as string | undefined) ||
  "https://marshal-elevated-journey.vercel.app";

/** Canonical origin, always without a trailing slash. */
export const SITE_URL = RAW_SITE_URL.replace(/\/+$/, "");

export const SITE = {
  name: "Marshal Holidays",
  shortName: "Marshal",
  url: SITE_URL,
  locale: "en_IN",
  title: "Marshal Holidays — Premium Kerala Chauffeur & Tour Experiences",
  description:
    "Marshal Holidays offers premium chauffeur-driven tours and luxury travel across Kerala — backwaters, hill stations, and beaches with 12+ years of trusted service.",
  socialDescription:
    "Luxury chauffeur-driven journeys across Kerala. Backwaters, hills, beaches — crafted by Marshal Holidays.",
  ogImage:
    "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d4a66333-3f2c-48fc-b1b5-45a8816eb784/id-preview-5f23fa6f--a5daecb7-c446-425e-8ca3-a3b225f7e4c7.lovable.app-1779566633057.png",
  phone: "+919188700777",
  whatsapp: "https://wa.me/919188700777",
  areaServed: "Kerala, India",
  twitterCard: "summary_large_image",
} as const;

/** Turn a path or partial URL into an absolute URL on the canonical origin. */
export function absoluteUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return SITE_URL;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

// ---------------------------------------------------------------------------
// Structured data (JSON-LD) helpers
// ---------------------------------------------------------------------------

/** Organization / TravelAgency graph used site-wide. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": `${SITE_URL}/#organization`,
    name: SITE.name,
    url: SITE_URL,
    image: SITE.ogImage,
    logo: SITE.ogImage,
    description: SITE.description,
    telephone: SITE.phone,
    areaServed: SITE.areaServed,
    priceRange: "₹₹",
    address: {
      "@type": "PostalAddress",
      addressRegion: "Kerala",
      addressCountry: "IN",
    },
  };
}

/** WebSite node (helps Google understand the site name). */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE.name,
    url: SITE_URL,
    inLanguage: "en-IN",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

// ---------------------------------------------------------------------------
// Per-post SEO audit (used by the admin SEO Center)
// ---------------------------------------------------------------------------

export const SEO_LIMITS = {
  titleMin: 30,
  titleMax: 60,
  descMin: 70,
  descMax: 160,
} as const;

export type SeoCheck = {
  label: string;
  status: "good" | "warn" | "bad";
  detail: string;
};

export type SeoAuditablePost = {
  title: string;
  slug: string;
  excerpt: string;
  meta_title: string | null;
  meta_description: string | null;
  cover_image: string | null;
  tags: string[];
};

/** Run on-page SEO checks for a single post and return checks + a 0-100 score. */
export function auditPost(post: SeoAuditablePost): {
  checks: SeoCheck[];
  score: number;
} {
  const effectiveTitle = post.meta_title || post.title || "";
  const effectiveDesc = post.meta_description || post.excerpt || "";
  const checks: SeoCheck[] = [];

  // Title
  if (!effectiveTitle) {
    checks.push({ label: "Title tag", status: "bad", detail: "Missing — add a title." });
  } else if (effectiveTitle.length < SEO_LIMITS.titleMin) {
    checks.push({
      label: "Title tag",
      status: "warn",
      detail: `Short (${effectiveTitle.length} chars). Aim for ${SEO_LIMITS.titleMin}-${SEO_LIMITS.titleMax}.`,
    });
  } else if (effectiveTitle.length > SEO_LIMITS.titleMax) {
    checks.push({
      label: "Title tag",
      status: "warn",
      detail: `Long (${effectiveTitle.length} chars) — may be truncated in Google.`,
    });
  } else {
    checks.push({ label: "Title tag", status: "good", detail: `${effectiveTitle.length} chars — ideal.` });
  }

  // Dedicated meta title
  checks.push(
    post.meta_title
      ? { label: "Meta title", status: "good", detail: "Custom meta title set." }
      : { label: "Meta title", status: "warn", detail: "Falls back to the post title." },
  );

  // Description
  if (!effectiveDesc) {
    checks.push({ label: "Meta description", status: "bad", detail: "Missing — add a description or excerpt." });
  } else if (effectiveDesc.length < SEO_LIMITS.descMin) {
    checks.push({
      label: "Meta description",
      status: "warn",
      detail: `Short (${effectiveDesc.length} chars). Aim for ${SEO_LIMITS.descMin}-${SEO_LIMITS.descMax}.`,
    });
  } else if (effectiveDesc.length > SEO_LIMITS.descMax) {
    checks.push({
      label: "Meta description",
      status: "warn",
      detail: `Long (${effectiveDesc.length} chars) — may be truncated.`,
    });
  } else {
    checks.push({ label: "Meta description", status: "good", detail: `${effectiveDesc.length} chars — ideal.` });
  }

  // Social / OG image
  checks.push(
    post.cover_image
      ? { label: "Social image", status: "good", detail: "Cover image used for OG/Twitter cards." }
      : { label: "Social image", status: "bad", detail: "No cover image — links share without a preview." },
  );

  // Slug
  if (!post.slug) {
    checks.push({ label: "URL slug", status: "bad", detail: "Missing slug." });
  } else if (post.slug.length > 60) {
    checks.push({ label: "URL slug", status: "warn", detail: "Slug is long — shorter URLs rank better." });
  } else {
    checks.push({ label: "URL slug", status: "good", detail: `/blog/${post.slug}` });
  }

  // Tags / keywords
  checks.push(
    post.tags.length > 0
      ? { label: "Keywords / tags", status: "good", detail: `${post.tags.length} tag(s).` }
      : { label: "Keywords / tags", status: "warn", detail: "No tags — add a few relevant keywords." },
  );

  const weight = { good: 1, warn: 0.5, bad: 0 } as const;
  const score = Math.round(
    (checks.reduce((sum, c) => sum + weight[c.status], 0) / checks.length) * 100,
  );

  return { checks, score };
}

// ---------------------------------------------------------------------------
// Sitemap builder (used by the SEO Center generate/download tool)
// ---------------------------------------------------------------------------

export type SitemapPost = { slug: string; updated_at?: string | null; published_at?: string | null };

/** Build a full sitemap.xml string for the static routes + all published posts. */
export function buildSitemapXml(posts: SitemapPost[]): string {
  const today = new Date().toISOString().slice(0, 10);
  const staticUrls = [
    { loc: `${SITE_URL}/`, changefreq: "weekly", priority: "1.0", lastmod: today },
    { loc: `${SITE_URL}/blog`, changefreq: "daily", priority: "0.8", lastmod: today },
  ];
  const postUrls = posts.map((p) => ({
    loc: `${SITE_URL}/blog/${p.slug}`,
    changefreq: "monthly",
    priority: "0.7",
    lastmod: (p.updated_at ?? p.published_at ?? today).slice(0, 10),
  }));

  const body = [...staticUrls, ...postUrls]
    .map(
      (u) =>
        `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}
