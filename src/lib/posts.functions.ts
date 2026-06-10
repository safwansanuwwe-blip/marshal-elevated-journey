import { createServerFn } from "@tanstack/react-start";

export type PublicPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  category: string;
  tags: string[];
  author: string;
  reading_minutes: number;
  published_at: string;
  meta_title: string | null;
  meta_description: string | null;
};

export type AdminPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  category: string;
  tags: string[];
  author: string;
  reading_minutes: number;
  status: "draft" | "published";
  published_at: string | null;
  scheduled_for: string | null;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
};

const BUCKET = "blog-images";

function nowISO() {
  return new Date().toISOString();
}

export const listPublishedPosts = createServerFn({ method: "GET" }).handler(
  async (): Promise<PublicPost[]> => {
    const { supabaseAdmin, isSupabaseConfigured } = await import(
      "@/integrations/supabase/client.server"
    );
    if (!isSupabaseConfigured) return [];
    const { data, error } = await supabaseAdmin
      .from("posts")
      .select(
        "slug, title, excerpt, content, cover_image, category, tags, author, reading_minutes, published_at, meta_title, meta_description"
      )
      .eq("status", "published")
      .not("published_at", "is", null)
      .lte("published_at", nowISO())
      .order("published_at", { ascending: false });
    if (error) {
      console.error("[listPublishedPosts]", error.message);
      return [];
    }
    return (data ?? []).map((p) => ({
      ...p,
      published_at: p.published_at as string,
    })) as PublicPost[];
  }
);

export const getPublishedPostBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => d)
  .handler(async ({ data }): Promise<PublicPost | null> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: p, error } = await supabaseAdmin
      .from("posts")
      .select(
        "slug, title, excerpt, content, cover_image, category, tags, author, reading_minutes, published_at, meta_title, meta_description, status"
      )
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!p || p.status !== "published" || !p.published_at) return null;
    if (new Date(p.published_at) > new Date()) return null;
    const { status: _s, ...rest } = p;
    return { ...rest, published_at: p.published_at } as PublicPost;
  });

export const listAllPosts = createServerFn({ method: "GET" }).handler(
  async (): Promise<AdminPost[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("posts")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as AdminPost[];
  }
);

export const getPostById = createServerFn({ method: "GET" })
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data }): Promise<AdminPost | null> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: p, error } = await supabaseAdmin
      .from("posts")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return (p as AdminPost) ?? null;
  });

type SaveInput = {
  id: string | null;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  category: string;
  tags: string[];
  author: string;
  meta_title: string | null;
  meta_description: string | null;
  reading_minutes: number;
  status: "draft" | "published";
  published_at: string | null;
  scheduled_for: string | null;
};

export const savePost = createServerFn({ method: "POST" })
  .inputValidator((d: SaveInput) => d)
  .handler(async ({ data }): Promise<AdminPost> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const payload = {
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      cover_image: data.cover_image,
      category: data.category,
      tags: data.tags,
      author: data.author,
      meta_title: data.meta_title,
      meta_description: data.meta_description,
      reading_minutes: data.reading_minutes,
      status: data.status,
      published_at: data.published_at,
      scheduled_for: data.scheduled_for,
      updated_at: nowISO(),
    };
    if (data.id) {
      const { data: row, error } = await supabaseAdmin
        .from("posts")
        .update(payload)
        .eq("id", data.id)
        .select("*")
        .single();
      if (error) throw new Error(error.message);
      return row as AdminPost;
    } else {
      const { data: row, error } = await supabaseAdmin
        .from("posts")
        .insert(payload)
        .select("*")
        .single();
      if (error) throw new Error(error.message);
      return row as AdminPost;
    }
  });

export const deletePost = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("posts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const uploadCoverImage = createServerFn({ method: "POST" })
  .inputValidator((d: { filename: string; contentType: string; base64: string }) => d)
  .handler(async ({ data }): Promise<{ url: string }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Ensure bucket exists (idempotent)
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    if (!buckets?.some((b) => b.name === BUCKET)) {
      await supabaseAdmin.storage.createBucket(BUCKET, { public: true });
    }
    const ext = (data.filename.split(".").pop() || "jpg").toLowerCase();
    const key = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const bytes = Buffer.from(data.base64, "base64");
    const { error } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(key, bytes, { contentType: data.contentType, upsert: false });
    if (error) throw new Error(error.message);
    const { data: pub } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(key);
    return { url: pub.publicUrl };
  });
