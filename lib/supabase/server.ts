import { createClient } from "@supabase/supabase-js";

// Server-only client — uses the service role key, so it can insert rows even though
// there is no public insert policy. Never import this from a client component.
export function createServerSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
