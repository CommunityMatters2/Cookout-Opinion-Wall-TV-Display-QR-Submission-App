"use client";

import { useSurveyStats } from "@/lib/hooks/useSurveyStats";
import styles from "./widgets.module.css";

export default function CommunityVoiceSummary() {
  const stats = useSurveyStats();
  return (
    <div className={styles.summaryStat}>
      <span className={styles.summaryHeadline}>{stats.totalResponses}</span>
      <span className={styles.summaryLabel}>neighbors weighed in</span>
      {stats.cityNeedsCenter && (
        <div className={styles.miniMeter}>
          <div className={styles.miniMeterTrack}>
            <div className={styles.miniMeterFill} style={{ width: `${stats.cityNeedsCenter.yesPercent}%` }} />
          </div>
          <span className={styles.miniMeterLabel}>{stats.cityNeedsCenter.yesPercent}% say Poughkeepsie needs it</span>
        </div>
      )}
    </div>
  );
}
