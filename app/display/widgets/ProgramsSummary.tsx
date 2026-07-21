"use client";

import { Waves, Flag, UtensilsCrossed, Tent, Briefcase, Cpu } from "lucide-react";
import { signaturePrograms } from "@/content/cm2Impact";
import styles from "./widgets.module.css";

const ICONS = [Waves, Flag, UtensilsCrossed, Tent, Briefcase, Cpu];

export default function ProgramsSummary() {
  return (
    <div className={styles.summaryStat}>
      <div className={styles.miniIconRow} aria-hidden="true">
        {ICONS.map((Icon, i) => (
          <span key={i} className={styles.miniIconChip}>
            <Icon size={15} strokeWidth={2} />
          </span>
        ))}
      </div>
      <span className={styles.summaryHeadline} style={{ fontSize: "1.8rem" }}>
        {signaturePrograms.length}
      </span>
      <span className={styles.summaryLabel}>signature programs</span>
    </div>
  );
}
