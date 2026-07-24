"use client";

import { useEffect } from "react";

const AUTO_RETRY_MS = 6000;

// Never renders error.message or a stack — this is a public kiosk screen.
// Nobody's there to click "try again," so it retries itself after a short
// delay instead of waiting for a tap.
export default function DisplayError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    const id = setTimeout(() => unstable_retry(), AUTO_RETRY_MS);
    return () => clearTimeout(id);
  }, [unstable_retry]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        background: "#080b12",
        color: "#fdf6ec",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "1.6rem", fontWeight: 800 }}>Reconnecting the Live Wall&hellip;</h1>
      <p style={{ opacity: 0.6, fontSize: "0.85rem" }}>{error.digest ? `Ref: ${error.digest}` : "One moment."}</p>
    </div>
  );
}
