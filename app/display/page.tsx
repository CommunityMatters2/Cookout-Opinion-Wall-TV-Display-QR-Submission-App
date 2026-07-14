import fs from "fs";
import path from "path";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { Message } from "@/types/message";
import DisplayWall from "@/app/display/DisplayWall";

export const dynamic = "force-dynamic";

const PHOTOS_DIR = path.join(process.cwd(), "public", "cm2 pictures");

async function getInitialMessages(): Promise<Message[]> {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("approved", true)
    .order("created_at", { ascending: false })
    .limit(150);

  if (error || !data) return [];
  return data as Message[];
}

function getSlideshowPhotos(): string[] {
  let files: string[];
  try {
    files = fs.readdirSync(PHOTOS_DIR);
  } catch {
    return [];
  }
  return files
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
    .map((f) => `/${encodeURIComponent("cm2 pictures")}/${encodeURIComponent(f)}`);
}

export default async function DisplayPage() {
  const initialMessages = await getInitialMessages();
  const photos = getSlideshowPhotos();
  return <DisplayWall initialMessages={initialMessages} photos={photos} />;
}
