"use client";

import type { ReactNode, CSSProperties } from "react";
import styles from "./display.module.css";

export default function Widget({
  title,
  icon,
  accent,
  focused,
  onExpand,
  children,
}: {
  title: string;
  icon: ReactNode;
  accent?: string;
  focused: boolean;
  onExpand: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className={`${styles.widgetTile} ${focused ? styles.widgetTileFocused : ""}`}
      style={accent ? ({ "--widget-accent": accent } as CSSProperties) : undefined}
      role="button"
      tabIndex={-1}
      aria-expanded={false}
      onClick={onExpand}
    >
      <div className={styles.widgetTileHeader}>
        <span className={styles.widgetTileIcon}>{icon}</span>
        <span className={styles.widgetTileTitle}>{title}</span>
      </div>
      <div className={styles.widgetTileSummary}>{children}</div>
    </div>
  );
}
