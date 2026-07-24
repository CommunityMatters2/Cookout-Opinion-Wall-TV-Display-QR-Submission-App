import { createServerSupabaseClient } from "@/lib/supabase/server";

const COOLDOWN_MS = 20_000;

// Postgres-backed (not in-memory): Vercel functions are stateless and
// multi-instance, so an in-memory Map wouldn't be seen by the next request
// that happens to land on a different instance.
export async function checkAndLogSubmission(deviceId: string): Promise<{ ok: boolean }> {
  const supabase = createServerSupabaseClient();

  const { data: recent } = await supabase
    .from("submission_log")
    .select("created_at")
    .eq("device_id", deviceId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (recent && Date.now() - new Date(recent.created_at).getTime() < COOLDOWN_MS) {
    return { ok: false };
  }

  await supabase.from("submission_log").insert({ device_id: deviceId });
  return { ok: true };
}
