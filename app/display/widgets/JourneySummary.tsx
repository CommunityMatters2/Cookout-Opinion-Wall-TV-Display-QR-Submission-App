"use client";

import { growthTimeline } from "@/content/cm2Impact";
import styles from "./widgets.module.css";

export default function JourneySummary() {
  const latest = growthTimeline[growthTimeline.length - 1];

  return (
    <div className={styles.summaryStat}>
      <div className={styles.miniYearStrip} aria-hidden="true">
        {growthTimeline.map((m) => (
          <span key={m.year} className={styles.miniYearDot} />
        ))}
      </div>
      <span className={styles.summaryHeadline} style={{ fontSize: "1.6rem" }}>
        2018 → {latest.year}
      </span>
      <span className={styles.summaryLabel}>{latest.title}</span>
    </div>
  );
}
