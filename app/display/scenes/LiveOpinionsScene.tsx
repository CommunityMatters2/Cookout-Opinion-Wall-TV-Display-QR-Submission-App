"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Message } from "@/types/message";
import shared from "../display.module.css";
import styles from "./scenes.module.css";

const MIN_SCROLL_ITEMS = 10;
// The marquee duplicates its source list to build a seamless scroll loop —
// capping the source independently of the stats-accurate 150-message cap
// (useLiveOpinions.ts) keeps the loop's DOM node count bounded even during a
// packed event.
const MARQUEE_MAX_SOURCE = 40;
const PIXELS_PER_SECOND = 28;
const SPOTLIGHT_INTERVAL_MS = 9000;
const SPOTLIGHT_VISIBLE_MS = 4000;
const RECENT_COUNT = 2;
const AVATAR_CLASSES = [styles.avatarChip0, styles.avatarChip1, styles.avatarChip2, styles.avatarChip3, styles.avatarChip4];
const PARTICLES = ["✨", "🧡", "🎉", "⭐"];

function buildLoopItems(messages: Message[]) {
  if (messages.length === 0) return [];
  const repeats = Math.max(1, Math.ceil(MIN_SCROLL_ITEMS / messages.length));
  const padded: (Message & { slot: number })[] = [];
  for (let r = 0; r < repeats; r++) {
    messages.forEach((m) => padded.push({ ...m, slot: r }));
  }
  return [...padded, ...padded];
}

function ParticleBurst() {
  const [particles] = useState(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      emoji: PARTICLES[i % PARTICLES.length],
      px: Math.round((Math.random() - 0.5) * 240),
      py: Math.round(-40 - Math.random() * 80),
      left: 20 + Math.random() * 60,
      delay: Math.random() * 0.2,
    }))
  );
  return (
    <>
      {particles.map((p) => (
        <span
          key={p.id}
          className={styles.particle}
          style={
            {
              left: `${p.left}%`,
              top: "50%",
              animationDelay: `${p.delay}s`,
              "--px": `${p.px}px`,
              "--py": `${p.py}px`,
            } as React.CSSProperties
          }
        >
          {p.emoji}
        </span>
      ))}
    </>
  );
}

export default function LiveOpinionsScene({
  messages,
  incomingMessage,
  onIncomingConsumed,
}: {
  messages: Message[];
  incomingMessage?: Message | null;
  onIncomingConsumed?: () => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const loopItems = useMemo(() => buildLoopItems(messages.slice(0, MARQUEE_MAX_SOURCE)), [messages]);
  const recentIds = useMemo(() => new Set(messages.slice(0, RECENT_COUNT).map((m) => m.id)), [messages]);

  const [fillerSpotlight, setFillerSpotlight] = useState<Message | null>(null);
  const spotlight = incomingMessage ?? fillerSpotlight;

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

  // The parent hands us the message that just arrived over Realtime (even if this
  // scene just remounted because that arrival interrupted a different scene), so the
  // pop-in always fires for the message that actually caused the interrupt. We only
  // schedule the auto-clear timer here — `incomingMessage` itself drives the render
  // directly (via the `spotlight` union above), so there's nothing to copy into state.
  useEffect(() => {
    if (!incomingMessage) return;
    const id = setTimeout(() => onIncomingConsumed?.(), SPOTLIGHT_VISIBLE_MS);
    return () => clearTimeout(id);
  }, [incomingMessage, onIncomingConsumed]);

  // Absent any real-time arrival, periodically spotlight a recent message anyway so the
  // scene never feels static.
  useEffect(() => {
    if (messages.length === 0) return;
    const id = setInterval(() => {
      if (incomingMessage) return;
      const pool = messages.slice(0, 10);
      setFillerSpotlight(pool[Math.floor(Math.random() * pool.length)]);
      const hideId = setTimeout(() => setFillerSpotlight(null), SPOTLIGHT_VISIBLE_MS);
      return () => clearTimeout(hideId);
    }, SPOTLIGHT_INTERVAL_MS);
    return () => clearInterval(id);
  }, [messages, incomingMessage]);

  return (
    <div className={styles.liveScene}>
      <div className={styles.headerBlock}>
        <p className={shared.kicker}>Live from the cookout</p>
        <h1 className={shared.headline}>Cookout Opinions</h1>
      </div>

      <div className={styles.feedViewport}>
        {messages.length === 0 ? (
          <div className={styles.feedEmpty}>Waiting for the first opinion&hellip; 👀</div>
        ) : (
          <div ref={trackRef} className={styles.feedTrack}>
            {loopItems.map((m, i) => {
              const isRecent = m.slot === 0 && recentIds.has(m.id);
              return (
                <motion.article
                  key={`${m.id}-${m.slot}-${i}`}
                  className={`${styles.bubbleCard} ${i % 2 === 0 ? styles.bubbleCardEven : styles.bubbleCardOdd} ${
                    isRecent ? styles.bubbleGlow : ""
                  }`}
                  initial={{ opacity: 0, scale: 0.85, y: -16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                >
                  {isRecent && <span className={styles.newRibbon}>NEW</span>}
                  <span className={`${styles.avatarChip} ${AVATAR_CLASSES[i % AVATAR_CLASSES.length]}`}>
                    {m.name.trim().charAt(0).toUpperCase() || "?"}
                  </span>
                  <div>
                    <p className={styles.bubbleName}>{m.name}</p>
                    <p className={styles.bubbleMessage}>{m.message}</p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {spotlight && (
          <div className={styles.spotlightWrap}>
            <motion.article
              key={spotlight.id}
              className={styles.spotlightCard}
              initial={{ opacity: 0, scale: 0.6, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: -20 }}
              transition={{ type: "spring", stiffness: 240, damping: 20 }}
            >
              <span className={styles.spotlightBadge}>✨ Featured Opinion</span>
              <ParticleBurst />
              <span className={styles.spotlightAvatar}>{spotlight.name.trim().charAt(0).toUpperCase() || "?"}</span>
              <div>
                <p className={styles.spotlightName}>{spotlight.name}</p>
                <p className={styles.spotlightMessage}>{spotlight.message}</p>
              </div>
            </motion.article>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
