import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { Message } from "@/types/message";
import DisplayWall from "@/app/display/DisplayWall";

export const dynamic = "force-dynamic";

async function getInitialMessages(): Promise<Message[]> {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("approved", true)
    .order("created_at", { ascending: false })
    .limit(24);

  if (error || !data) return [];
  return data as Message[];
}

export default async function DisplayPage() {
  const initialMessages = await getInitialMessages();
  return <DisplayWall initialMessages={initialMessages} />;
}
