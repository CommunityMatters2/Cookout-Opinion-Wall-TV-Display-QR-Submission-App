"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { Message } from "@/types/message";
import { siteConfig } from "@/config/site";
import Sidebar from "@/app/display/Sidebar";
import styles from "./display.module.css";

const MAX_CARDS = 24;

type PromoTile =
  | { kind: "photo"; src: string; caption: string }
  | { kind: "stat"; value: string; label: string };

type GridItem =
  | { kind: "message"; message: Message }
  | { kind: "promo"; promo: PromoTile };

export default function DisplayWall({
  initialMessages,
}: {
  initialMessages: Message[];
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const { cm2 } = siteConfig;

  const promoTiles: PromoTile[] = useMemo(
    () => [
      { kind: "photo", src: cm2.activityPhoto, caption: "CM2 youth programming in action" },
      { kind: "stat", value: "$1 → $3–$12", label: "saved for every dollar invested in youth programming" },
      { kind: "photo", src: cm2.muralPhoto, caption: "Our mural on N. Hamilton St, Poughkeepsie" },
    ],
    [cm2.activityPhoto, cm2.muralPhoto]
  );

  const gridItems: GridItem[] = useMemo(() => {
    const items: GridItem[] = [{ kind: "promo", promo: promoTiles[0] }];
    messages.forEach((m, i) => {
      items.push({ kind: "message", message: m });
      if ((i + 1) % 6 === 0) {
        items.push({ kind: "promo", promo: promoTiles[(Math.floor((i + 1) / 6)) % promoTiles.length] });
      }
    });
    return items;
  }, [messages, promoTiles]);

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

      <div className={styles.body}>
        <main className={styles.main}>
          <header className={styles.header}>
            <Image src={cm2.logo} alt={cm2.orgName} width={64} height={64} className={styles.headerLogo} />
            <div>
              <h1 className={styles.title}>{siteConfig.eventTitle}</h1>
              <p className={styles.tagline}>{siteConfig.tagline}</p>
            </div>
          </header>

          {messages.length === 0 && (
            <p className={styles.emptyHint}>Be the first to share your opinion! 👀</p>
          )}

          <div className={styles.grid}>
            {gridItems.map((item, i) =>
              item.kind === "message" ? (
                <article key={item.message.id} className={styles.card}>
                  <p className={styles.message}>&ldquo;{item.message.message}&rdquo;</p>
                  <p className={styles.name}>— {item.message.name}</p>
                </article>
              ) : item.promo.kind === "photo" ? (
                <div
                  key={`promo-${i}`}
                  className={styles.promoPhotoTile}
                  style={{ backgroundImage: `url(${item.promo.src})` }}
                >
                  <p className={styles.promoPhotoCaption}>{item.promo.caption}</p>
                </div>
              ) : (
                <div key={`promo-${i}`} className={styles.promoStatTile}>
                  <span className={styles.promoStatValue}>{item.promo.value}</span>
                  <span className={styles.promoStatLabel}>{item.promo.label}</span>
                </div>
              )
            )}
          </div>
        </main>

        <Sidebar />
      </div>
    </div>
  );
}
