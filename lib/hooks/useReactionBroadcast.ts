"use client";

import { useEffect, useRef, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export type ReactionEvent = { emoji: string; messageId: string; at: number };

const FLUSH_MS = 2000;

// Two separate write paths, deliberately: tapping fans out an ephemeral
// Realtime Broadcast event immediately (zero DB round-trip, so a burst of
// taps never touches Postgres in the hot path) while the flying particle
// renders on every connected screen; the actual count is persisted
// separately, batched every ~2s as a relative delta via the increment_reaction
// RPC so concurrent flushes from different devices compose instead of
// clobbering each other.
export function useReactionBroadcast() {
  const channelRef = useRef<ReturnType<ReturnType<typeof createBrowserSupabaseClient>["channel"]> | null>(null);
  const pendingRef = useRef<Map<string, number>>(new Map());
  const [incoming, setIncoming] = useState<ReactionEvent | null>(null);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    const channel = supabase
      .channel("reactions-broadcast")
      .on("broadcast", { event: "react" }, (payload) => {
        setIncoming(payload.payload as ReactionEvent);
      })
      .subscribe();
    channelRef.current = channel;

    const flushId = setInterval(() => {
      function flushPending() {
        if (pendingRef.current.size === 0) return;
        const entries = Array.from(pendingRef.current.entries());
        pendingRef.current = new Map();
        for (const [key, delta] of entries) {
          const [messageId, emoji] = key.split(":");
          void supabase.rpc("increment_reaction", { p_message_id: messageId, p_emoji: emoji, p_delta: delta });
        }
      }
      flushPending();
    }, FLUSH_MS);

    return () => {
      clearInterval(flushId);
      supabase.removeChannel(channel);
    };
  }, []);

  function react(messageId: string, emoji: string) {
    channelRef.current?.send({ type: "broadcast", event: "react", payload: { emoji, messageId, at: Date.now() } });
    const key = `${messageId}:${emoji}`;
    pendingRef.current.set(key, (pendingRef.current.get(key) ?? 0) + 1);
  }

  return { react, incoming };
}
