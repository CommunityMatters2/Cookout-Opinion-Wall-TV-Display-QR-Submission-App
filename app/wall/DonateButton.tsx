"use client";

import { siteConfig } from "@/config/site";
import styles from "./wall.module.css";

export default function DonateButton({ compact = false }: { compact?: boolean }) {
  return (
    <a
      href={siteConfig.cm2.donateUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={compact ? styles.donateButtonCompact : styles.donateButton}
    >
      💛 {compact ? "Donate" : "Support Our Youth — Donate"}
    </a>
  );
}
