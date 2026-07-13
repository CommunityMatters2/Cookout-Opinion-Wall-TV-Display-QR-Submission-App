import { createClient } from "@supabase/supabase-js";

// Browser client — uses the anon key, which can only read approved messages (see supabase/schema.sql RLS policy).
export function createBrowserSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
