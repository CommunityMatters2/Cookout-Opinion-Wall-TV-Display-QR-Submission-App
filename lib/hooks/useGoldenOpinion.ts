"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { Message } from "@/types/message";

const POLL_MS = 60000;
const VISIBLE_MS = 12000;

export function useGoldenOpinion(): Message | null {
  const [opinion, setOpinion] = useState<Message | null>(null);

  useEffect(() => {
    let cancelled = false;
    let lastMessageId: string | null = null;
    let hideId: ReturnType<typeof setTimeout> | undefined;

    async function poll() {
      const supabase = createBrowserSupabaseClient();
      const { data: golden } = await supabase
        .from("golden_opinion")
        .select("message_id")
        .eq("id", true)
        .maybeSingle();

      if (cancelled || !golden?.message_id || golden.message_id === lastMessageId) return;

      const { data: message } = await supabase.from("messages").select("*").eq("id", golden.message_id).single();
      if (cancelled || !message) return;

      lastMessageId = golden.message_id;
      setOpinion(message as Message);
      hideId = setTimeout(() => setOpinion(null), VISIBLE_MS);
    }

    poll();
    const intervalId = setInterval(poll, POLL_MS);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
      clearTimeout(hideId);
    };
  }, []);

  return opinion;
}
