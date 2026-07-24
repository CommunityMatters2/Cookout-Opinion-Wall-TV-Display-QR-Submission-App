import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// Runs every 15 minutes via Vercel Cron (see vercel.json). Picks the most
// reacted approved message and writes it to the single-row golden_opinion
// table so every TV/phone reads the same pick (see useGoldenOpinion.ts)
// instead of each client computing its own, possibly-different answer.
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerSupabaseClient();

  const { data: reactions } = await supabase.from("message_reactions").select("message_id, count");

  let winnerId: string | null = null;
  if (reactions && reactions.length > 0) {
    const totals = new Map<string, number>();
    for (const r of reactions) {
      totals.set(r.message_id, (totals.get(r.message_id) ?? 0) + r.count);
    }
    let best = 0;
    for (const [id, total] of totals) {
      if (total > best) {
        best = total;
        winnerId = id;
      }
    }
  }

  if (!winnerId) {
    const { data: recent } = await supabase
      .from("messages")
      .select("id")
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    winnerId = recent?.id ?? null;
  }

  if (winnerId) {
    await supabase
      .from("golden_opinion")
      .upsert({ id: true, message_id: winnerId, updated_at: new Date().toISOString() });
  }

  return NextResponse.json({ ok: true, message_id: winnerId });
}
