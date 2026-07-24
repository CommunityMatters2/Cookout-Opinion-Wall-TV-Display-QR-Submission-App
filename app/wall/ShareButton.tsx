"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import styles from "./wall.module.css";

function logShare(targetType: string, targetId: string) {
  // Fire-and-forget row insert — allowed by the anon "insert with check(true)"
  // policy on share_events. Never blocks the share UX on this succeeding.
  void createBrowserSupabaseClient()
    .from("share_events")
    .insert({ target_type: targetType, target_id: targetId })
    .then(() => {});
}

export default function ShareButton({
  title,
  url,
  text,
  targetType = "wall",
  targetId = "home",
}: {
  title: string;
  url: string;
  text?: string;
  targetType?: string;
  targetId?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url, text });
        logShare(targetType, targetId);
      } catch {
        // User cancelled the share sheet — nothing to do, and nothing to log.
      }
      return;
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(text ? `${text}\n${url}` : url);
      logShare(targetType, targetId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button type="button" className={styles.shareButton} onClick={handleShare}>
      {copied ? <Check size={16} /> : <Share2 size={16} />}
      {copied ? "Link copied" : "Share the wall"}
    </button>
  );
}
