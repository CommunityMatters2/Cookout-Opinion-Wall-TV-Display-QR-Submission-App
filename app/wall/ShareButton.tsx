"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import styles from "./wall.module.css";

export default function ShareButton({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // User cancelled the share sheet — nothing to do.
      }
      return;
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
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
