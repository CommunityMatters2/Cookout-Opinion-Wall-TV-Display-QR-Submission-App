"use client";

// Only used if the root layout itself throws — can't assume globals.css or
// any app chrome is available here, so everything is inline.
export default function GlobalError({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          padding: 32,
          textAlign: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#fff4dd",
          color: "#2b1d0e",
        }}
      >
        <h1 style={{ fontSize: "1.4rem", fontWeight: 800 }}>Oops — trying again&hellip;</h1>
        <p style={{ opacity: 0.75, maxWidth: 340 }}>Something went wrong loading the page. Give it another try.</p>
        <button
          type="button"
          onClick={() => unstable_retry()}
          style={{
            padding: "14px 28px",
            fontSize: "1rem",
            fontWeight: 700,
            color: "#fff",
            background: "linear-gradient(120deg, #ff5a5f, #ff6b35 45%, #ffd166)",
            border: "none",
            borderRadius: 999,
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
