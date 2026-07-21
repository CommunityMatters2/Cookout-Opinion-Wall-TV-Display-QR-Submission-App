"use client";

import { summerCamp } from "@/content/cm2Impact";
import styles from "./widgets.module.css";

export default function SummerCampSummary() {
  const flagship = summerCamp.stats.find((s) => s.label.includes("Youth Served")) ?? summerCamp.stats[0];

  return (
    <div className={styles.summaryStat}>
      <span className={styles.summaryHeadline}>{flagship.value}</span>
      <span className={styles.summaryLabel}>{flagship.label}</span>
      <span className={styles.summarySubLabel}>{summerCamp.ageRange}</span>
    </div>
  );
}
