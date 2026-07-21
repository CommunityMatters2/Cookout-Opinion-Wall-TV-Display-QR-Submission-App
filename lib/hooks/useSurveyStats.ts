"use client";

import { useEffect, useState } from "react";

const POLL_MS = 20000;

export type YesNoSplit = { yes: number; no: number; yesPercent: number; noPercent: number };
export type OptionCount = { option: string; count: number; percent: number };

export type SurveyStats = {
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

// Polls the Community Voice survey aggregate, shared by the TV widget and the
// mobile widget so both re-animate off the same 20s-fresh data.
export function useSurveyStats(): SurveyStats {
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
