"use client";

import type { ConnectionStatus } from "@/lib/hooks/useLiveOpinions";
import styles from "./display.module.css";

const LABELS: Record<Exclude<ConnectionStatus, "connected">, string> = {
  connecting: "Connecting…",
  reconnecting: "Reconnecting…",
  disconnected: "Offline — showing cached content",
};

// Never clears already-rendered content on disconnect — this is purely an
// unobtrusive status pip layered on top of whatever's already on screen.
export default function ConnectionPip({ status }: { status: ConnectionStatus }) {
  if (status === "connected") return null;

  return (
    <div className={styles.connectionPip}>
      <span className={styles.connectionPipDot} />
      {LABELS[status]}
    </div>
  );
}
