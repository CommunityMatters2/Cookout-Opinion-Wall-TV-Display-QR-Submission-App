import { createServerSupabaseClient } from "@/lib/supabase/server";
import { containsBlockedWord } from "@/lib/wordFilter";
import { stripHtml } from "@/lib/sanitize";
import { checkAndLogSubmission } from "@/lib/rateLimit";
import { siteConfig } from "@/config/site";
import type { MessageStatus } from "@/types/message";

export type SubmitMessageResult = {
  ok: boolean;
  error?: string;
  id?: string;
  status?: MessageStatus;
};

// The actual validate-and-insert logic, shared by the Server Action
// (app/actions.ts, used by the survey flow) and the plain JSON API route
// (app/api/submit-message/route.ts, used for imperative retry and as the
// load-test target — Server Actions use internal action-id headers that
// can't be hand-crafted from an external script).
export async function submitMessage(
  rawName: string,
  rawMessage: string,
  deviceId: string | undefined
): Promise<SubmitMessageResult> {
  const name = stripHtml(rawName);
  const message = stripHtml(rawMessage);

  if (!name) return { ok: false, error: "Please enter your name." };
  if (!message) return { ok: false, error: "Please enter a message." };
  if (name.length > siteConfig.maxNameLength) {
    return { ok: false, error: `Name must be ${siteConfig.maxNameLength} characters or less.` };
  }
  if (message.length > siteConfig.maxMessageLength) {
    return { ok: false, error: `Message must be ${siteConfig.maxMessageLength} characters or less.` };
  }

  if (deviceId) {
    const { ok } = await checkAndLogSubmission(deviceId);
    if (!ok) return { ok: false, error: "You're posting a little fast — try again in a few seconds." };
  }

  // Flagged content is held for moderator review instead of silently
  // rejected — see app/mod.
  const status: MessageStatus = containsBlockedWord(name) || containsBlockedWord(message) ? "pending" : "approved";

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("messages")
    .insert({ name, message, status })
    .select("id")
    .single();

  if (error) {
    return { ok: false, error: "Something went wrong, please try again." };
  }

  return { ok: true, id: data?.id, status };
}
