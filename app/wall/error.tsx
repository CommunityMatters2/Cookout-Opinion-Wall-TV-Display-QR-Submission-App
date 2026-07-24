"use client";

export default function Error({ unstable_retry }: { error: Error & { digest?: string }; unstable_retry: () => void }) {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        padding: 32,
        textAlign: "center",
        background: "#080b12",
        color: "#fdf6ec",
      }}
    >
      <h1 style={{ fontSize: "1.4rem", fontWeight: 800 }}>Oops — trying again&hellip;</h1>
      <p style={{ opacity: 0.7, maxWidth: 340 }}>The Live Wall hiccuped for a second. Give it another try.</p>
      <button
        type="button"
        onClick={() => unstable_retry()}
        style={{
          padding: "14px 28px",
          fontSize: "1rem",
          fontWeight: 700,
          color: "#1a0e00",
          background: "linear-gradient(120deg, #ff5a5f, #ff6b35 45%, #ffd166)",
          border: "none",
          borderRadius: 999,
        }}
      >
        Try again
      </button>
    </div>
  );
}
