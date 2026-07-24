import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const targetType = request.nextUrl.searchParams.get("targetType");
  const targetId = request.nextUrl.searchParams.get("targetId");

  if (!targetType || !targetId) {
    return NextResponse.json({ error: "targetType and targetId are required" }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();
  const { count, error } = await supabase
    .from("share_events")
    .select("id", { count: "exact", head: true })
    .eq("target_type", targetType)
    .eq("target_id", targetId);

  if (error) {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }

  return NextResponse.json({ count: count ?? 0 });
}
