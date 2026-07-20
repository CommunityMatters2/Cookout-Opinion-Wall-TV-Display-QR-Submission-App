"use client";

import { useEffect, useState } from "react";
import { Vote } from "lucide-react";
import CountUp from "@/app/display/CountUp";
import shared from "../display.module.css";
import styles from "./scenes.module.css";

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

function RankedList({ title, items, topN }: { title: string; items: OptionCount[]; topN: number }) {
  const top = items.slice(0, topN);
  const maxCount = top[0]?.count ?? 1;
  return (
    <div>
      <p className={styles.voiceRankTitle}>{title}</p>
      {top.map((item) => (
        <div key={item.option} className={styles.voiceRankRow}>
          <span className={styles.voiceRankLabel}>{item.option}</span>
          <div className={styles.voiceRankTrack}>
            <div className={styles.voiceRankFill} style={{ width: `${Math.max(6, (item.count / maxCount) * 100)}%` }} />
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
              <div className={styles.voiceMeterFill} style={{ width: `${stats.visitedBefore.yesPercent}%` }} />
            </div>
          </div>
          <div className={`${shared.glassPanel} ${styles.voiceMeterBlock}`} style={{ padding: "18px 22px" }}>
            <div className={styles.voiceMeterHeader}>
              <span>Poughkeepsie needs a community center</span>
              <span className={styles.voiceMeterPercent}>{stats.cityNeedsCenter.yesPercent}% yes</span>
            </div>
            <div className={styles.voiceMeterTrack}>
              <div className={styles.voiceMeterFill} style={{ width: `${stats.cityNeedsCenter.yesPercent}%` }} />
            </div>
          </div>
        </div>
      )}

      <div className={styles.voiceGrid}>
        <div className={`${shared.glassPanel}`} style={{ padding: "22px 26px" }}>
          <RankedList title="Most-wanted programs" items={stats.desiredPrograms} topN={5} />
        </div>
        <div className={`${shared.glassPanel}`} style={{ padding: "22px 26px" }}>
          <RankedList title="Priority spaces" items={stats.prioritySpaces} topN={5} />
        </div>
      </div>
    </div>
  );
}
