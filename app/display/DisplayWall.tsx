"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { Message } from "@/types/message";
import { siteConfig } from "@/config/site";
import PhotoSlideshow from "@/app/display/PhotoSlideshow";
import LiveOpinionsFeed from "@/app/display/LiveOpinionsFeed";
import InfoPanel from "@/app/display/InfoPanel";
import styles from "./display.module.css";

const MAX_MESSAGES = 150;

export default function DisplayWall({
  initialMessages,
  photos,
}: {
  initialMessages: Message[];
  photos: string[];
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const { cm2 } = siteConfig;

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
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.marquee}>
        <div className={styles.marqueeTrack}>
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className={styles.marqueeContent}>
              <strong>{siteConfig.eventTitle}</strong> &nbsp;•&nbsp; <strong>{cm2.orgName}</strong> — &ldquo;{cm2.mission}&rdquo;
              &nbsp;•&nbsp; {cm2.impactFact} &nbsp;•&nbsp; Scan the QR to help shape Poughkeepsie&rsquo;s next community center &nbsp;•&nbsp;
            </span>
          ))}
        </div>
      </div>

      <div className={styles.columns}>
        <PhotoSlideshow photos={photos} />
        <LiveOpinionsFeed messages={messages} />
        <InfoPanel />
      </div>
    </div>
  );
}
