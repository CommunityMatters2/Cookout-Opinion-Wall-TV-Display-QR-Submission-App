"use client";

import { motion } from "framer-motion";
import { roi } from "@/content/cm2Impact";
import CountUp from "@/app/display/CountUp";
import shared from "../display.module.css";
import styles from "./scenes.module.css";

export default function ROIScene() {
  return (
    <div className={`${styles.sceneRoot} ${styles.roiScene}`}>
      <p className={shared.kicker}>The Return On Investment</p>

      <motion.div
        className={styles.roiCoin}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
      >
        <span className={styles.roiCoinValue}>$1</span>
        <span className={styles.roiCoinLabel}>INVESTED</span>
      </motion.div>

      <motion.div
        className={styles.roiFiguresRow}
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15, delayChildren: 0.5 } } }}
      >
        {roi.breakdown.map((item, i) => (
          <motion.div
            key={item.label}
            className={`${shared.glassPanel} ${styles.roiFigure}`}
            variants={{
              hidden: { opacity: 0, y: -30, scale: 0.7 },
              show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 220, damping: 18 } },
            }}
          >
            <CountUp value={item.value} className={styles.roiFigureValue} delayMs={i * 100} />
            <span className={styles.roiFigureLabel}>{item.label}</span>
          </motion.div>
        ))}
      </motion.div>

      <motion.p
        className={styles.roiTagline}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
      >
        {roi.headline}
      </motion.p>
    </div>
  );
}
