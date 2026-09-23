import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { resolveContent, type SiteContent } from "@/lib/content";

// Per-request admin client that forwards the caller's access token so Postgres
// RLS can verify the `admin` role (same pattern as posts.functions.ts).
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

// ---------- Public ----------

/** Read the singleton content row and merge it over the code defaults. */
export const getSiteContent = createServerFn({ method: "GET" }).handler(
  async (): Promise<SiteContent> => {
    const { data, error } = await supabase
      .from("site_content")
      .select("data")
      .eq("id", "default")
      .maybeSingle();

    if (error) throw new Error(error.message);
    return resolveContent(data?.data ?? {});
  },
);

// ---------- Admin ----------

/** Upsert the full content document (admin only). */
export const saveSiteContent = createServerFn({ method: "POST" })
  .validator((d: { accessToken: string; data: SiteContent }) => d)
  .handler(async ({ data }): Promise<SiteContent> => {
    const db = adminClient(data.accessToken);
    const { data: row, error } = await db
      .from("site_content")
      .upsert({ id: "default", data: data.data, updated_at: new Date().toISOString() })
      .select("data")
      .single();

    if (error) throw new Error(error.message);
    return resolveContent(row.data);
  });
