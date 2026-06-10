import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SERVICE_ROLE_KEY);

if (!isSupabaseConfigured) {
  console.warn(
    "[supabaseAdmin] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY — DB-backed routes will return empty data."
  );
}

export const supabaseAdmin = createClient<Database>(
  SUPABASE_URL ?? "http://localhost",
  SERVICE_ROLE_KEY ?? "missing",
  { auth: { persistSession: false, autoRefreshToken: false } }
);
