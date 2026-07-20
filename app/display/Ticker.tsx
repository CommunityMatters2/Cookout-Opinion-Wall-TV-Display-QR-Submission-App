"use client";

import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/config/site";
import styles from "./display.module.css";

export default function Ticker({ liveCount }: { liveCount: number }) {
  const { cm2 } = siteConfig;
  const [displayCount, setDisplayCount] = useState(liveCount);
  const prevCount = useRef(liveCount);

  useEffect(() => {
    if (liveCount === prevCount.current) return;
    const from = prevCount.current;
    const to = liveCount;
    prevCount.current = to;
    const start = performance.now();
    const DURATION = 700;
    let raf: number;

    function tick(now: number) {
      const progress = Math.min(1, (now - start) / DURATION);
      setDisplayCount(Math.round(from + (to - from) * progress));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [liveCount]);

  return (
    <div className={styles.ticker}>
      <div className={styles.liveCluster}>
        <span className={styles.liveBadge}>
          <span className={styles.liveDot} />
          LIVE
        </span>
        <span className={styles.liveCount}>{displayCount} shared so far</span>
      </div>
      <div className={styles.tickerTrack}>
        <div className={styles.tickerScroll}>
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className={styles.tickerItem}>
              <strong>{siteConfig.eventTitle}</strong> &nbsp;•&nbsp; <strong>{cm2.orgName}</strong> — &ldquo;
              {cm2.mission}&rdquo; &nbsp;•&nbsp; {cm2.impactFact} &nbsp;•&nbsp; Scan the QR to share your
              opinion &nbsp;•&nbsp;
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
