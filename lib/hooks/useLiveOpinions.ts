"use client";

import { useEffect, useRef, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { Message } from "@/types/message";

const MAX_MESSAGES = 150;
const FLUSH_MS = 500;
const RECONNECT_DELAYS_MS = [2000, 5000, 10000, 30000];

export type ConnectionStatus = "connecting" | "connected" | "reconnecting" | "disconnected";

// Realtime subscription to new cookout opinions, shared by both the TV Command
// Center and the mobile Explore Mode so there's only ever one Supabase channel
// open per viewer, regardless of how many widgets/routes read the feed.
//
// Arrivals are buffered and flushed on a ~500ms timer (not applied to state
// on every INSERT event) so a burst of 20 messages in 5 seconds animates as a
// handful of batched updates instead of 20 individual re-renders. Connection
// status is tracked and exposed so the TV can show a subtle "reconnecting…"
// indicator without ever clearing already-rendered content, and a manual
// backoff re-subscribe covers channel errors that Supabase JS doesn't always
// recover from on its own.
export function useLiveOpinions(initialMessages: Message[]) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [incomingMessage, setIncomingMessage] = useState<Message | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("connecting");

  const pendingRef = useRef<Message[]>([]);
  const lastSeenRef = useRef<string>(initialMessages[0]?.created_at ?? new Date(0).toISOString());

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let cancelled = false;
    let reconnectAttempt = 0;
    let reconnectTimeoutId: ReturnType<typeof setTimeout> | undefined;

    function noteSeen(rows: Message[]) {
      for (const row of rows) {
        if (row.created_at > lastSeenRef.current) lastSeenRef.current = row.created_at;
      }
    }

    function flushPending() {
      if (pendingRef.current.length === 0) return;
      const batch = pendingRef.current;
      pendingRef.current = [];
      setMessages((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const fresh = batch.filter((m) => !existingIds.has(m.id));
        return fresh.length === 0 ? prev : [...fresh, ...prev].slice(0, MAX_MESSAGES);
      });
      setIncomingMessage(batch[batch.length - 1]);
      noteSeen(batch);
    }

    // Fills any gap that opened up while disconnected — the in-memory
    // `messages` state is never cleared on disconnect, only supplemented.
    async function fillGap() {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("status", "approved")
        .gt("created_at", lastSeenRef.current)
        .order("created_at", { ascending: false });
      if (cancelled || !data || data.length === 0) return;
      const rows = data as Message[];
      setMessages((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const fresh = rows.filter((m) => !existingIds.has(m.id));
        return fresh.length === 0 ? prev : [...fresh, ...prev].slice(0, MAX_MESSAGES);
      });
      noteSeen(rows);
    }

    function scheduleReconnect() {
      if (cancelled) return;
      const delay = RECONNECT_DELAYS_MS[Math.min(reconnectAttempt, RECONNECT_DELAYS_MS.length - 1)];
      reconnectAttempt += 1;
      reconnectTimeoutId = setTimeout(() => {
        if (channel) supabase.removeChannel(channel);
        subscribe();
      }, delay);
    }

    function subscribe() {
      channel = supabase
        .channel("messages-wall")
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
          const row = payload.new as Message;
          if (row.status !== "approved") return;
          pendingRef.current.push(row);
        })
        .on("postgres_changes", { event: "UPDATE", schema: "public", table: "messages" }, (payload) => {
          // Surfaces a moderator's later approval of a previously-pending
          // message live, without requiring a page reload.
          const row = payload.new as Message;
          if (row.status !== "approved") return;
          pendingRef.current.push(row);
        })
        .subscribe((status) => {
          if (cancelled) return;
          function handleStatusChange() {
            if (status === "SUBSCRIBED") {
              reconnectAttempt = 0;
              setConnectionStatus("connected");
              fillGap();
            } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
              setConnectionStatus((prev) => (prev === "connecting" ? "disconnected" : "reconnecting"));
              scheduleReconnect();
            }
          }
          handleStatusChange();
        });
    }

    subscribe();
    const flushIntervalId = setInterval(flushPending, FLUSH_MS);

    return () => {
      cancelled = true;
      clearInterval(flushIntervalId);
      clearTimeout(reconnectTimeoutId);
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  const consumeIncoming = () => setIncomingMessage(null);

  return { messages, incomingMessage, consumeIncoming, connectionStatus };
}
