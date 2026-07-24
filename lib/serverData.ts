import fs from "fs";
import path from "path";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { Message } from "@/types/message";

const PHOTOS_DIR_NAME = "Cm2 latest pic to display wall";
const PHOTOS_DIR = path.join(process.cwd(), "public", PHOTOS_DIR_NAME);

// Shared by both the TV (`/display`) and mobile (`/wall`) server pages so the
// initial-message fetch + on-disk photo listing only lives in one place.
export async function getInitialMessages(): Promise<Message[]> {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(150);

  if (error || !data) return [];
  return data as Message[];
}

// Uncapped total, unlike getInitialMessages()'s 150-row cap — milestone
// celebrations (25/50/100…) need the real count, not the display-limited one.
export async function getMessageCount(): Promise<number> {
  const supabase = createBrowserSupabaseClient();
  const { count } = await supabase
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("status", "approved");
  return count ?? 0;
}

export function getSlideshowPhotos(): string[] {
  let files: string[];
  try {
    files = fs.readdirSync(PHOTOS_DIR);
  } catch {
    return [];
  }
  return files
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    .sort((a, b) => a.localeCompare(b))
    .map((f) => `/${encodeURIComponent(PHOTOS_DIR_NAME)}/${encodeURIComponent(f)}`);
}
