import fs from "fs";
import path from "path";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { Message } from "@/types/message";
import DisplayStage from "@/app/display/DisplayStage";

export const dynamic = "force-dynamic";

const PHOTOS_DIR_NAME = "Cm2 latest pic to display wall";
const PHOTOS_DIR = path.join(process.cwd(), "public", PHOTOS_DIR_NAME);

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
    .sort((a, b) => a.localeCompare(b))
    .map((f) => `/${encodeURIComponent(PHOTOS_DIR_NAME)}/${encodeURIComponent(f)}`);
}

export default async function DisplayPage() {
  const initialMessages = await getInitialMessages();
  const photos = getSlideshowPhotos();
  return <DisplayStage initialMessages={initialMessages} photos={photos} />;
}
