"use client";

import type { CSSProperties } from "react";
import { ViewTransition } from "react";
import Link from "next/link";
import type { WidgetDef } from "@/lib/widgets/registry";
import styles from "./wall.module.css";

export default function WallWidgetCard({ widget, anchorId }: { widget: WidgetDef; anchorId?: string }) {
  const Summary = widget.Summary;
  const Icon = widget.icon;

  return (
    <div id={anchorId} className={styles.widgetCardAnchor}>
      <Link
        href={`/wall/${widget.id}`}
        transitionTypes={["nav-forward"]}
        className={styles.widgetCard}
        style={{ "--card-accent": widget.accent } as CSSProperties}
      >
        <ViewTransition name={`widget-${widget.id}`}>
          <div className={styles.widgetCardInner}>
            <div className={styles.widgetCardHeader}>
              <span className={styles.widgetCardIcon}>
                <Icon size={18} strokeWidth={2} />
              </span>
              <span className={styles.widgetCardTitle}>{widget.title}</span>
              <span className={styles.widgetCardChevron} aria-hidden="true">
                ›
              </span>
            </div>
            <div className={styles.widgetCardSummary}>
              <Summary />
            </div>
          </div>
        </ViewTransition>
      </Link>
    </div>
  );
}
