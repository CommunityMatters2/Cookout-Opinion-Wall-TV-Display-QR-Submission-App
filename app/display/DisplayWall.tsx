"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { Message } from "@/types/message";
import { siteConfig } from "@/config/site";
import QrCorner from "@/app/display/QrCorner";
import styles from "./display.module.css";

const MAX_CARDS = 24;

export default function DisplayWall({
  initialMessages,
}: {
  initialMessages: Message[];
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

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
          setMessages((prev) => [row, ...prev].slice(0, MAX_CARDS));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>{siteConfig.eventTitle}</h1>
        <p className={styles.tagline}>{siteConfig.tagline}</p>
      </header>

      {messages.length === 0 ? (
        <div className={styles.empty}>
          <p>Be the first to share your opinion! 👀</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {messages.map((m) => (
            <article key={m.id} className={styles.card}>
              <p className={styles.message}>&ldquo;{m.message}&rdquo;</p>
              <p className={styles.name}>— {m.name}</p>
            </article>
          ))}
        </div>
      )}

      <QrCorner />
    </div>
  );
}
