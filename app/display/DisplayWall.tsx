"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { Message } from "@/types/message";
import { siteConfig } from "@/config/site";
import PhotoSlideshow from "@/app/display/PhotoSlideshow";
import LiveOpinionsFeed from "@/app/display/LiveOpinionsFeed";
import BroadcastPanel from "@/app/display/BroadcastPanel";
import CommunityVoicePanel from "@/app/display/CommunityVoicePanel";
import ImpactDashboardScene from "@/app/display/ImpactDashboardScene";
import MobileTabs, { type MobileTab } from "@/app/display/MobileTabs";
import { useIsMobile } from "@/app/display/useIsMobile";
import styles from "./display.module.css";

const MAX_MESSAGES = 150;
const TAKEOVER_INTERVAL_MS = 120000;
const TAKEOVER_VISIBLE_MS = 17000;

export default function DisplayWall({
  initialMessages,
  photos,
}: {
  initialMessages: Message[];
  photos: string[];
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [takeoverActive, setTakeoverActive] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>("feed");
  const isMobile = useIsMobile();
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

  useEffect(() => {
    if (isMobile) return;
    const id = setInterval(() => {
      setTakeoverActive(true);
      const hideId = setTimeout(() => setTakeoverActive(false), TAKEOVER_VISIBLE_MS);
      return () => clearTimeout(hideId);
    }, TAKEOVER_INTERVAL_MS);
    return () => clearInterval(id);
  }, [isMobile]);

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

      {isMobile ? (
        <>
          <MobileTabs active={mobileTab} onChange={setMobileTab} />
          <div className={styles.mobileStage}>
            {mobileTab === "photos" && <PhotoSlideshow photos={photos} />}
            {mobileTab === "feed" && <LiveOpinionsFeed messages={messages} />}
            {mobileTab === "impact" && <ImpactDashboardScene compact={false} />}
            {mobileTab === "voice" && <CommunityVoicePanel variant="full" />}
          </div>
        </>
      ) : (
        <>
          <div className={`${styles.broadcast} ${takeoverActive ? styles.broadcastHidden : ""}`}>
            <div className={styles.heroStrip}>
              <PhotoSlideshow photos={photos} />
            </div>
            <div className={styles.lowerGrid}>
              <LiveOpinionsFeed messages={messages} />
              <BroadcastPanel />
            </div>
          </div>

          <div className={`${styles.takeoverLayer} ${takeoverActive ? styles.takeoverActive : ""}`}>
            <CommunityVoicePanel variant="full" />
          </div>
        </>
      )}
    </div>
  );
}
