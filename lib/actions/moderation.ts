"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { hasValidModSession } from "@/lib/modSession";
import type { Message } from "@/types/message";

async function requireModSession() {
  if (!(await hasValidModSession())) {
    throw new Error("Unauthorized");
  }
}

export async function getModerationQueue(): Promise<{ pending: Message[]; approved: Message[] }> {
  await requireModSession();
  const supabase = createServerSupabaseClient();
  const [{ data: pending }, { data: approved }] = await Promise.all([
    supabase.from("messages").select("*").eq("status", "pending").order("created_at", { ascending: false }),
    supabase.from("messages").select("*").eq("status", "approved").order("created_at", { ascending: false }).limit(50),
  ]);
  return { pending: (pending as Message[]) ?? [], approved: (approved as Message[]) ?? [] };
}

export async function approveMessage(id: string): Promise<{ ok: boolean }> {
  await requireModSession();
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("messages").update({ status: "approved" }).eq("id", id);
  return { ok: !error };
}

// Also doubles as "remove from the wall instantly" for an already-approved
// message — either way the row stops being publicly selectable.
export async function rejectMessage(id: string): Promise<{ ok: boolean }> {
  await requireModSession();
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("messages").update({ status: "rejected" }).eq("id", id);
  return { ok: !error };
}
