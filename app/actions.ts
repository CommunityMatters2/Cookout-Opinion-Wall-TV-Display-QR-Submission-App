"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { containsBlockedWord } from "@/lib/wordFilter";
import { siteConfig } from "@/config/site";

export type SubmitResult = {
  ok: boolean;
  error?: string;
};

export async function submitMessage(
  _prevState: SubmitResult,
  formData: FormData
): Promise<SubmitResult> {
  const name = String(formData.get("name") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name) {
    return { ok: false, error: "Please enter your name." };
  }
  if (!message) {
    return { ok: false, error: "Please enter a message." };
  }
  if (name.length > siteConfig.maxNameLength) {
    return { ok: false, error: `Name must be ${siteConfig.maxNameLength} characters or less.` };
  }
  if (message.length > siteConfig.maxMessageLength) {
    return { ok: false, error: `Message must be ${siteConfig.maxMessageLength} characters or less.` };
  }
  if (containsBlockedWord(name) || containsBlockedWord(message)) {
    return { ok: false, error: "Please keep it cookout-friendly! 🌭" };
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("messages").insert({ name, message });

  if (error) {
    return { ok: false, error: "Something went wrong, please try again." };
  }

  return { ok: true };
}
