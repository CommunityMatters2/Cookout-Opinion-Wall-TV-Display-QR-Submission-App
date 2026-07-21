"use client";

import { useEffect, useState } from "react";
import { Vote } from "lucide-react";
import { useSurveyStats, type OptionCount } from "@/lib/hooks/useSurveyStats";
import CountUp from "@/app/display/CountUp";
import shared from "../display.module.css";
import styles from "./scenes.module.css";

function RankedList({
  title,
  items,
  topN,
  revealed,
}: {
  title: string;
  items: OptionCount[];
  topN: number;
  revealed: boolean;
}) {
  const top = items.slice(0, topN);
  const maxCount = top[0]?.count ?? 1;
  return (
    <div>
      <p className={styles.voiceRankTitle}>{title}</p>
      {top.map((item) => (
        <div key={item.option} className={styles.voiceRankRow}>
          <span className={styles.voiceRankLabel}>{item.option}</span>
          <div className={styles.voiceRankTrack}>
            <div
              className={styles.voiceRankFill}
              style={{ width: revealed ? `${Math.max(6, (item.count / maxCount) * 100)}%` : "0%" }}
            />
          </div>
          <span className={styles.voiceRankValue}>{item.percent}%</span>
        </div>
      ))}
      {top.length === 0 && <p className={styles.voiceEmpty}>Waiting for responses…</p>}
    </div>
  );
}

export default function CommunityVoiceScene() {
  const stats = useSurveyStats();
  // Bars start at 0 and grow in once real data has landed (rather than snapping
  // straight to their final width on mount) — the existing `transition: width`
  // rule on the fill classes then also re-animates them on every later poll.
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    if (stats.totalResponses === 0 && !stats.visitedBefore) return;
    const id = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(id);
  }, [stats]);

  return (
    <div className={styles.sceneRoot}>
      <div className={styles.headerBlock}>
        <p className={shared.kicker}>
          <Vote size={14} style={{ verticalAlign: "-2px", marginRight: 6 }} />
          Community Voice
        </p>
        <div className={styles.voiceHero}>
          <CountUp value={`${stats.totalResponses}`} className={styles.voiceHeroValue} />
          <span className={styles.voiceHeroLabel}>Neighbors Weighed In</span>
        </div>
      </div>

      {stats.visitedBefore && stats.cityNeedsCenter && (
        <div className={styles.voiceGrid} style={{ marginBottom: 28 }}>
          <div className={`${shared.glassPanel} ${styles.voiceMeterBlock}`} style={{ padding: "18px 22px" }}>
            <div className={styles.voiceMeterHeader}>
              <span>Have visited a community center before</span>
              <span className={styles.voiceMeterPercent}>{stats.visitedBefore.yesPercent}% yes</span>
            </div>
            <div className={styles.voiceMeterTrack}>
              <div
                className={styles.voiceMeterFill}
                style={{ width: revealed ? `${stats.visitedBefore.yesPercent}%` : "0%" }}
              />
            </div>
          </div>
          <div className={`${shared.glassPanel} ${styles.voiceMeterBlock}`} style={{ padding: "18px 22px" }}>
            <div className={styles.voiceMeterHeader}>
              <span>Poughkeepsie needs a community center</span>
              <span className={styles.voiceMeterPercent}>{stats.cityNeedsCenter.yesPercent}% yes</span>
            </div>
            <div className={styles.voiceMeterTrack}>
              <div
                className={styles.voiceMeterFill}
                style={{ width: revealed ? `${stats.cityNeedsCenter.yesPercent}%` : "0%" }}
              />
            </div>
          </div>
        </div>
      )}

      <div className={styles.voiceGrid}>
        <div className={`${shared.glassPanel}`} style={{ padding: "22px 26px" }}>
          <RankedList title="Most-wanted programs" items={stats.desiredPrograms} topN={5} revealed={revealed} />
        </div>
        <div className={`${shared.glassPanel}`} style={{ padding: "22px 26px" }}>
          <RankedList title="Priority spaces" items={stats.prioritySpaces} topN={5} revealed={revealed} />
        </div>
      </div>
    </div>
  );
}
