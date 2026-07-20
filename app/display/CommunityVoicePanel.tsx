"use client";

import { useEffect, useState } from "react";
import CountUpValue from "@/app/display/CountUpValue";
import styles from "./display.module.css";

const POLL_MS = 20000;

type YesNoSplit = { yes: number; no: number; yesPercent: number; noPercent: number };
type OptionCount = { option: string; count: number; percent: number };

type SurveyStats = {
  totalResponses: number;
  visitedBefore: YesNoSplit | null;
  cityNeedsCenter: YesNoSplit | null;
  desiredPrograms: OptionCount[];
  prioritySpaces: OptionCount[];
  likelyUsers: OptionCount[];
  bestTimes: OptionCount[];
};

const EMPTY_STATS: SurveyStats = {
  totalResponses: 0,
  visitedBefore: null,
  cityNeedsCenter: null,
  desiredPrograms: [],
  prioritySpaces: [],
  likelyUsers: [],
  bestTimes: [],
};

function useSurveyStats(): SurveyStats {
  const [stats, setStats] = useState<SurveyStats>(EMPTY_STATS);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/survey-stats", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as SurveyStats;
        if (!cancelled) setStats(data);
      } catch {
        // Keep showing the last-known stats if a poll fails.
      }
    }

    load();
    const id = setInterval(load, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return stats;
}

function YesNoMeter({ label, split }: { label: string; split: YesNoSplit }) {
  return (
    <div className={styles.voiceMeterBlock}>
      <div className={styles.voiceMeterHeader}>
        <span>{label}</span>
        <span className={styles.voiceMeterPercent}>{split.yesPercent}% yes</span>
      </div>
      <div className={styles.voiceMeterTrack}>
        <div className={styles.voiceMeterFill} style={{ width: `${split.yesPercent}%` }} />
      </div>
    </div>
  );
}

function RankedList({ title, items, topN }: { title: string; items: OptionCount[]; topN: number }) {
  const top = items.slice(0, topN);
  const maxCount = top[0]?.count ?? 1;
  return (
    <div className={styles.voiceRankBlock}>
      <p className={styles.voiceRankTitle}>{title}</p>
      <div className={styles.voiceRankList}>
        {top.map((item) => (
          <div key={item.option} className={styles.voiceRankRow}>
            <span className={styles.voiceRankLabel}>{item.option}</span>
            <div className={styles.voiceRankTrack}>
              <div
                className={styles.voiceRankFill}
                style={{ width: `${Math.max(6, (item.count / maxCount) * 100)}%` }}
              />
            </div>
            <span className={styles.voiceRankValue}>{item.percent}%</span>
          </div>
        ))}
        {top.length === 0 && <p className={styles.voiceEmpty}>Waiting for responses…</p>}
      </div>
    </div>
  );
}

export default function CommunityVoicePanel({ variant = "teaser" }: { variant?: "teaser" | "full" }) {
  const stats = useSurveyStats();
  const isFull = variant === "full";
  const topN = isFull ? 5 : 3;

  return (
    <div className={isFull ? styles.voiceFull : styles.voiceTeaser}>
      <div className={styles.voiceHeader}>
        <p className={styles.sceneKicker}>Community Voice</p>
        <div className={styles.voiceHero}>
          <CountUpValue value={`${stats.totalResponses}`} className={styles.voiceHeroValue} />
          <span className={styles.voiceHeroLabel}>Neighbors Weighed In</span>
        </div>
      </div>

      {stats.visitedBefore && stats.cityNeedsCenter && (
        <div className={styles.voiceMeterRow}>
          <YesNoMeter label="Have visited a community center before" split={stats.visitedBefore} />
          {isFull && (
            <YesNoMeter label="Poughkeepsie needs a community center" split={stats.cityNeedsCenter} />
          )}
        </div>
      )}

      <div className={isFull ? styles.voiceRankGrid : undefined}>
        <RankedList title="Most-wanted programs" items={stats.desiredPrograms} topN={topN} />
        {isFull && <RankedList title="Priority spaces" items={stats.prioritySpaces} topN={topN} />}
      </div>
    </div>
  );
}
