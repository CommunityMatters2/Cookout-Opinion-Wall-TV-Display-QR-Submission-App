"use client";

import { useEffect, useMemo, useRef } from "react";
import type { Message } from "@/types/message";
import styles from "./display.module.css";

const MIN_SCROLL_ITEMS = 10;
const PIXELS_PER_SECOND = 34;

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

      <div className={styles.feedViewport}>
        {messages.length === 0 ? (
          <div className={styles.feedEmpty}>
            <p>Waiting for the first opinion&hellip; 👀</p>
          </div>
        ) : (
          <div ref={trackRef} className={styles.feedTrack}>
            {loopItems.map((m, i) => (
              <article key={`${m.id}-${m.slot}-${i}`} className={styles.feedCard}>
                <span className={styles.feedAvatar}>{m.name.trim().charAt(0).toUpperCase() || "?"}</span>
                <div className={styles.feedCardBody}>
                  <p className={styles.feedName}>{m.name}</p>
                  <p className={styles.feedMessage}>{m.message}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
