import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type PostRow = Database["public"]["Tables"]["posts"]["Row"];

// Admin operations must run as the signed-in user so Postgres RLS can verify
// the `admin` role. The shared `supabase` client only carries the anon key and
// has no server-side session, so we build a per-request client that forwards
// the caller's access token.
function adminClient(accessToken: string) {
  const url = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const key =
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase environment variables");
  return createClient<Database>(url, key, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

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

export const listAllPosts = createServerFn({ method: "POST" })
  .validator((d: { accessToken: string }) => d)
  .handler(async ({ data }): Promise<AdminPost[]> => {
    const { data: rows, error } = await adminClient(data.accessToken)
      .from("posts")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const getPostById = createServerFn({ method: "POST" })
  .validator((d: { id: string; accessToken: string }) => d)
  .handler(async ({ data }): Promise<AdminPost | null> => {
    const { data: row, error } = await adminClient(data.accessToken)
      .from("posts")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return row;
  });

type SaveInput = {
  accessToken: string;
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
    const { accessToken, id, ...fields } = data;
    const db = adminClient(accessToken);
    const payload = { ...fields, updated_at: new Date().toISOString() };

    const query = id
      ? db.from("posts").update(payload).eq("id", id).select("*").single()
      : db.from("posts").insert(payload).select("*").single();

    const { data: row, error } = await query;
    if (error) throw new Error(error.message);
    return row;
  });

export const deletePost = createServerFn({ method: "POST" })
  .validator((d: { id: string; accessToken: string }) => d)
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const { error } = await adminClient(data.accessToken)
      .from("posts")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const uploadCoverImage = createServerFn({ method: "POST" })
  .validator((d: { filename: string; contentType: string; base64: string; accessToken: string }) => d)
  .handler(async ({ data }): Promise<{ url: string }> => {
    const db = adminClient(data.accessToken);
    const bytes = Uint8Array.from(atob(data.base64), (c) => c.charCodeAt(0));
    const ext = data.filename.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${crypto.randomUUID()}.${ext}`;

    const { error } = await db.storage
      .from(STORAGE_BUCKET)
      .upload(path, bytes, { contentType: data.contentType, upsert: false });

    if (error) throw new Error(error.message);

    const { data: pub } = db.storage.from(STORAGE_BUCKET).getPublicUrl(path);
    return { url: pub.publicUrl };
  });
