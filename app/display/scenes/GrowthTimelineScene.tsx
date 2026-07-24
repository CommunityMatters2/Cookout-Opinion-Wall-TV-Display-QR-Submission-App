"use client";

import { motion } from "framer-motion";
import { growthTimeline } from "@/content/cm2Impact";
import shared from "../display.module.css";
import styles from "./scenes.module.css";

const MAX_ITEMS_SHOWN = 3;

export default function GrowthTimelineScene() {
  return (
    <div className={`${styles.sceneRoot} ${styles.timelineScene}`}>
      <div className={styles.headerBlock}>
        <p className={shared.kicker}>
          Growth Line · {growthTimeline[0].year} – {growthTimeline[growthTimeline.length - 1].year}
        </p>
        <h1 className={shared.headline}>Our Journey</h1>
      </div>

      <div className={styles.timelineTrackWrap}>
        <motion.div
          className={styles.timelineLine}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
        />
        <motion.div
          className={styles.timelineNodes}
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.18, delayChildren: 0.3 } } }}
        >
          {growthTimeline.map((milestone) => (
            <motion.div
              key={milestone.year}
              className={styles.timelineNode}
              variants={{
                hidden: { opacity: 0, y: 20, scale: 0.9 },
                show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 20 } },
              }}
            >
              <span className={`${styles.timelineDot} ${milestone.isCurrent ? styles.timelineDotCurrent : ""}`} />
              <span className={styles.timelineYear}>{milestone.year}</span>
              <div
                className={`${shared.glassPanel} ${styles.timelineCard} ${
                  milestone.isCurrent ? styles.timelineCardCurrent : ""
                }`}
              >
                {milestone.isCurrent && <span className={styles.timelineCurrentBadge}>This Year</span>}
                <p className={styles.timelineTitle}>{milestone.title}</p>
                <ul className={styles.timelineItems}>
                  {milestone.items.slice(0, MAX_ITEMS_SHOWN).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
