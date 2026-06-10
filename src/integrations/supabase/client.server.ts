import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.warn(
    "[supabaseAdmin] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars."
  );
}

export const supabaseAdmin = createClient<Database>(
  SUPABASE_URL ?? "",
  SERVICE_ROLE_KEY ?? "",
  { auth: { persistSession: false, autoRefreshToken: false } }
);
