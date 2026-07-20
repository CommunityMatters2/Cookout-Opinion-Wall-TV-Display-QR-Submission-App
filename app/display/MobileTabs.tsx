"use client";

import styles from "./display.module.css";

export type MobileTab = "photos" | "feed" | "impact" | "voice";

const TABS: { key: MobileTab; label: string; emoji: string }[] = [
  { key: "photos", label: "Photos", emoji: "📸" },
  { key: "feed", label: "Live Wall", emoji: "💬" },
  { key: "impact", label: "Impact", emoji: "📊" },
  { key: "voice", label: "Voice", emoji: "🗳️" },
];

export default function MobileTabs({
  active,
  onChange,
}: {
  active: MobileTab;
  onChange: (tab: MobileTab) => void;
}) {
  return (
    <nav className={styles.mobileTabs}>
      {TABS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          className={`${styles.mobileTab} ${active === tab.key ? styles.mobileTabActive : ""}`}
          onClick={() => onChange(tab.key)}
        >
          <span aria-hidden="true">{tab.emoji}</span>
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
