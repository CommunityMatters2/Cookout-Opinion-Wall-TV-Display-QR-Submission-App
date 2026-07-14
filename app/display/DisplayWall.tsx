"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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
      <div className={styles.marquee}>
        <div className={styles.marqueeTrack}>
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className={styles.marqueeContent}>
              <strong>{cm2.orgName}</strong> — &ldquo;{cm2.mission}&rdquo; &nbsp;•&nbsp; {cm2.impactFact}
              &nbsp;•&nbsp; Scan the QR to help shape Poughkeepsie&rsquo;s next community center &nbsp;•&nbsp;
            </span>
          ))}
        </div>
      </div>

      <header className={styles.header}>
        <Image src={cm2.logo} alt={cm2.orgName} width={64} height={64} className={styles.headerLogo} />
        <div>
          <h1 className={styles.title}>{siteConfig.eventTitle}</h1>
          <p className={styles.tagline}>{siteConfig.tagline}</p>
        </div>
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

      <footer className={styles.footer}>
        <Image src={cm2.logo} alt={cm2.orgName} width={40} height={40} className={styles.footerLogo} />
        <span className={styles.footerOrg}>{cm2.orgName}</span>
        <span className={styles.footerDivider}>•</span>
        <span>{cm2.website}</span>
        <span className={styles.footerDivider}>•</span>
        <span>{cm2.address}</span>
        <span className={styles.footerDivider}>•</span>
        <span>{cm2.phone}</span>
      </footer>

      <QrCorner />
    </div>
  );
}
