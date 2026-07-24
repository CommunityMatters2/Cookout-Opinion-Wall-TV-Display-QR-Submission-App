"use client";

import { useEffect, useRef, useState } from "react";
import type { Message } from "@/types/message";
import { MILESTONES } from "@/lib/milestones";

const CELEBRATION_MS = 5000;

// `messages.length` from useLiveOpinions is capped at 150, so it silently
// stops being the true total past that — milestones need the real running
// count. We track it as initialTotal + one increment per distinct realtime
// arrival, using `incomingMessage` (which fires on every INSERT regardless
// of the display cap) rather than array length.
export function useMilestoneWatcher(initialTotal: number, incomingMessage: Message | null): number | null {
  const seenIdsRef = useRef(new Set<string>());
  const totalRef = useRef(initialTotal);
  const firedRef = useRef(new Set<number>());
  const [celebrating, setCelebrating] = useState<number | null>(null);

  useEffect(() => {
    function checkArrival() {
      if (!incomingMessage || seenIdsRef.current.has(incomingMessage.id)) return;
      seenIdsRef.current.add(incomingMessage.id);
      totalRef.current += 1;

      const hit = MILESTONES.find((m) => totalRef.current >= m && !firedRef.current.has(m));
      if (!hit) return;
      firedRef.current.add(hit);
      setCelebrating(hit);
      setTimeout(() => setCelebrating(null), CELEBRATION_MS);
    }
    checkArrival();
  }, [incomingMessage]);

  return celebrating;
}
