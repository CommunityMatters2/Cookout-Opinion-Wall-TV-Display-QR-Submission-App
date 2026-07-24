"use client";

import type { CSSProperties } from "react";
import { ViewTransition } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { WidgetDef } from "@/lib/widgets/registry";
import { useTiltHover } from "@/lib/hooks/useTiltHover";
import styles from "./wall.module.css";

export default function WallWidgetCard({ widget, anchorId }: { widget: WidgetDef; anchorId?: string }) {
  const Summary = widget.Summary;
  const Icon = widget.icon;
  const tilt = useTiltHover();

  return (
    <div id={anchorId} className={styles.widgetCardAnchor}>
      <Link
        href={`/wall/${widget.id}`}
        transitionTypes={["nav-forward"]}
        className={styles.widgetCard}
        style={{ "--card-accent": widget.accent } as CSSProperties}
        onPointerMove={tilt.onPointerMove}
        onPointerLeave={tilt.onPointerLeave}
      >
        <ViewTransition name={`widget-${widget.id}`}>
          <motion.div
            className={styles.widgetCardInner}
            style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY, transformPerspective: 800 }}
          >
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
          </motion.div>
        </ViewTransition>
      </Link>
    </div>
  );
}
