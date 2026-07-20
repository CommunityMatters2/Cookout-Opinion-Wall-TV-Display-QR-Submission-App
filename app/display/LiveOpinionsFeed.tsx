"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Message } from "@/types/message";
import styles from "./display.module.css";

const MIN_SCROLL_ITEMS = 10;
const PIXELS_PER_SECOND = 30;
const SPOTLIGHT_INTERVAL_MS = 8000;
const SPOTLIGHT_VISIBLE_MS = 4200;
const RECENT_COUNT = 2;

function buildLoopItems(messages: Message[]) {
  if (messages.length === 0) return [];
  const repeats = Math.max(1, Math.ceil(MIN_SCROLL_ITEMS / messages.length));
  const padded: (Message & { slot: number })[] = [];
  for (let r = 0; r < repeats; r++) {
    messages.forEach((m) => padded.push({ ...m, slot: r }));
  }
  // Duplicate the whole padded block once more so the scroll can loop seamlessly.
  return [...padded, ...padded];
}

export default function LiveOpinionsFeed({ messages }: { messages: Message[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const loopItems = useMemo(() => buildLoopItems(messages), [messages]);
  const recentIds = useMemo(
    () => new Set(messages.slice(0, RECENT_COUNT).map((m) => m.id)),
    [messages]
  );

  const [spotlight, setSpotlight] = useState<Message | null>(null);

  useEffect(() => {
    if (loopItems.length === 0) return;
    let raf: number;
    let last = performance.now();

    function tick(now: number) {
      const dt = (now - last) / 1000;
      last = now;
      const track = trackRef.current;
      if (track) {
        const singleHeight = track.scrollHeight / 2;
        if (singleHeight > 0) {
          offsetRef.current = (offsetRef.current + PIXELS_PER_SECOND * dt) % singleHeight;
          track.style.transform = `translateY(-${offsetRef.current}px)`;
        }
      }
      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [loopItems.length]);

  useEffect(() => {
    if (messages.length === 0) return;
    const id = setInterval(() => {
      const pickNewest = Math.random() < 0.5;
      const pool = messages.slice(0, 10);
      const candidate = pickNewest ? messages[0] : pool[Math.floor(Math.random() * pool.length)];
      setSpotlight(candidate);
      const hideId = setTimeout(() => setSpotlight(null), SPOTLIGHT_VISIBLE_MS);
      return () => clearTimeout(hideId);
    }, SPOTLIGHT_INTERVAL_MS);
    return () => clearInterval(id);
  }, [messages]);

  return (
    <div className={styles.feedColumn}>
      <div className={styles.feedHeader}>
        <span className={styles.liveBadge}>
          <span className={styles.liveDot} />
          LIVE
        </span>
        <h2 className={styles.feedTitle}>Cookout Opinions</h2>
        <span className={styles.feedCount}>
          {messages.length > 0 ? `${messages.length} shared so far` : "Be the first to share!"}
        </span>
      </div>

      {spotlight && (
        <article className={styles.spotlightCard} key={spotlight.id}>
          <span className={styles.spotlightBadge}>✨ Featured Opinion</span>
          <div className={styles.spotlightBody}>
            <span className={styles.spotlightAvatar}>
              {spotlight.name.trim().charAt(0).toUpperCase() || "?"}
            </span>
            <div>
              <p className={styles.spotlightName}>{spotlight.name}</p>
              <p className={styles.spotlightMessage}>{spotlight.message}</p>
            </div>
          </div>
        </article>
      )}

      <div className={styles.feedViewport}>
        {messages.length === 0 ? (
          <div className={styles.feedEmpty}>
            <p>Waiting for the first opinion&hellip; 👀</p>
          </div>
        ) : (
          <div ref={trackRef} className={styles.feedTrack}>
            {loopItems.map((m, i) => {
              const isRecent = m.slot === 0 && recentIds.has(m.id);
              return (
                <article
                  key={`${m.id}-${m.slot}-${i}`}
                  className={`${styles.feedCard} ${i % 2 === 0 ? styles.feedCardTiltA : styles.feedCardTiltB} ${
                    isRecent ? styles.feedCardNew : ""
                  }`}
                >
                  {isRecent && <span className={styles.feedNewRibbon}>NEW</span>}
                  <span className={styles.feedAvatar}>{m.name.trim().charAt(0).toUpperCase() || "?"}</span>
                  <div className={styles.feedCardBody}>
                    <p className={styles.feedName}>{m.name}</p>
                    <p className={styles.feedMessage}>{m.message}</p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
