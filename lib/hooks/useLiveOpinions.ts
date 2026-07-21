"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { Message } from "@/types/message";

const MAX_MESSAGES = 150;

// Realtime subscription to new cookout opinions, shared by both the TV Command
// Center and the mobile Explore Mode so there's only ever one Supabase channel
// open per viewer, regardless of how many widgets/routes read the feed.
export function useLiveOpinions(initialMessages: Message[]) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [incomingMessage, setIncomingMessage] = useState<Message | null>(null);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    const channel = supabase
      .channel("messages-wall")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const row = payload.new as Message;
          if (!row.approved) return;
          setMessages((prev) => [row, ...prev].slice(0, MAX_MESSAGES));
          setIncomingMessage(row);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const consumeIncoming = () => setIncomingMessage(null);

  return { messages, incomingMessage, consumeIncoming };
}
