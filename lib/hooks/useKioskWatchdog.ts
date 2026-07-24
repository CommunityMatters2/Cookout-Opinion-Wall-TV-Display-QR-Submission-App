"use client";

import { useEffect, useRef } from "react";
import type { ConnectionStatus } from "@/lib/hooks/useLiveOpinions";

const RELOAD_AFTER_MS = 2 * 60 * 1000;
const CHECK_INTERVAL_MS = 15000;

// Kiosk safety net for the TV: since this is serverless (no process to
// supervise a stuck kiosk), a client-side reload is the only self-recovery
// available. Triggers only on a sustained connection problem (never on "no
// new messages," which is normal during quiet stretches of the event).
export function useKioskWatchdog(status: ConnectionStatus) {
  const disconnectedSinceRef = useRef<number | null>(null);

  useEffect(() => {
    function trackStatus() {
      if (status === "connected" || status === "connecting") {
        disconnectedSinceRef.current = null;
        return;
      }
      if (disconnectedSinceRef.current === null) {
        disconnectedSinceRef.current = Date.now();
      }
    }
    trackStatus();
  }, [status]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      function checkElapsed() {
        const since = disconnectedSinceRef.current;
        if (since !== null && Date.now() - since > RELOAD_AFTER_MS) {
          window.location.reload();
        }
      }
      checkElapsed();
    }, CHECK_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, []);
}
