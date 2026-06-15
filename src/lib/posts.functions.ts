import { createServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type PostRow = Database["public"]["Tables"]["posts"]["Row"];

// Shape returned to the public blog (published_at is guaranteed present).
export type PublicPost = Omit<PostRow, "published_at"> & { published_at: string };

// Full row used by the admin dashboard/editor.
export type AdminPost = PostRow;

const STORAGE_BUCKET = "post-images";

function toPublic(row: PostRow): PublicPost {
  return { ...row, published_at: row.published_at ?? row.created_at };
}

// ---------- Public (blog) ----------

export const listPublishedPosts = createServerFn({ method: "GET" }).handler(
  async (): Promise<PublicPost[]> => {
    const nowIso = new Date().toISOString();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("status", "published")
      .lte("published_at", nowIso)
      .order("published_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []).map(toPublic);
  },
);

export const getPublishedPostBySlug = createServerFn({ method: "GET" })
  .validator((d: { slug: string }) => d)
  .handler(async ({ data }): Promise<PublicPost | null> => {
    const nowIso = new Date().toISOString();
    const { data: row, error } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", data.slug)
      .eq("status", "published")
      .lte("published_at", nowIso)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return row ? toPublic(row) : null;
  });

// ---------- Admin ----------

export const listAllPosts = createServerFn({ method: "GET" }).handler(
  async (): Promise<AdminPost[]> => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data ?? [];
  },
);

export const getPostById = createServerFn({ method: "GET" })
  .validator((d: { id: string }) => d)
  .handler(async ({ data }): Promise<AdminPost | null> => {
    const { data: row, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return row;
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
  .validator((d: SaveInput) => d)
  .handler(async ({ data }): Promise<AdminPost> => {
    const { id, ...fields } = data;
    const payload = { ...fields, updated_at: new Date().toISOString() };

    const query = id
      ? supabase.from("posts").update(payload).eq("id", id).select("*").single()
      : supabase.from("posts").insert(payload).select("*").single();

    const { data: row, error } = await query;
    if (error) throw new Error(error.message);
    return row;
  });

export const deletePost = createServerFn({ method: "POST" })
  .validator((d: { id: string }) => d)
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const { error } = await supabase.from("posts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const uploadCoverImage = createServerFn({ method: "POST" })
  .validator((d: { filename: string; contentType: string; base64: string }) => d)
  .handler(async ({ data }): Promise<{ url: string }> => {
    const bytes = Uint8Array.from(atob(data.base64), (c) => c.charCodeAt(0));
    const ext = data.filename.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, bytes, { contentType: data.contentType, upsert: false });

    if (error) throw new Error(error.message);

    const { data: pub } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
    return { url: pub.publicUrl };
  });
