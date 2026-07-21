"use client";

import { useRef, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { widgetRegistry } from "@/lib/widgets/registry";
import { useExploreZoneController } from "@/app/display/useExploreZoneController";
import Widget from "@/app/display/Widget";
import styles from "./display.module.css";

const COLUMNS = 3;

export default function ExploreZone() {
  const { mode, expandedIndex, focusedIndex, expand, collapse, moveFocus, noteInteraction } =
    useExploreZoneController(widgetRegistry.length);
  const containerRef = useRef<HTMLDivElement>(null);

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    noteInteraction();
    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        moveFocus(1);
        break;
      case "ArrowLeft":
        e.preventDefault();
        moveFocus(-1);
        break;
      case "ArrowDown":
        e.preventDefault();
        moveFocus(COLUMNS);
        break;
      case "ArrowUp":
        e.preventDefault();
        moveFocus(-COLUMNS);
        break;
      case "Enter":
        e.preventDefault();
        expand(focusedIndex);
        break;
      case "Escape":
        e.preventDefault();
        collapse();
        break;
    }
  }

  const expandedWidget = expandedIndex !== null ? widgetRegistry[expandedIndex] : null;

  return (
    <div
      ref={containerRef}
      className={styles.exploreZone}
      role="group"
      aria-label="Explore CM2 impact widgets"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.widgetGrid}>
        {widgetRegistry.map((widget, i) => {
          const Summary = widget.Summary;
          const Icon = widget.icon;
          return (
            <Widget
              key={widget.id}
              title={widget.title}
              icon={<Icon size={17} strokeWidth={2} />}
              accent={widget.accent}
              focused={mode !== "tour" && focusedIndex === i}
              onExpand={() => expand(i)}
            >
              <Summary />
            </Widget>
          );
        })}
      </div>

      {mode === "grid" && (
        <span className={styles.exploreHint} aria-hidden="true">
          Tap to explore 👆
        </span>
      )}

      <AnimatePresence>
        {expandedWidget && (
          <motion.div
            key={expandedWidget.id}
            className={styles.widgetDetailOverlay}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            role="dialog"
            aria-label={expandedWidget.title}
          >
            {mode !== "tour" && (
              <button type="button" className={styles.widgetCloseButton} onClick={collapse} aria-label="Close">
                <X size={20} />
              </button>
            )}
            <div className={styles.widgetDetailContent}>
              <expandedWidget.Detail />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
