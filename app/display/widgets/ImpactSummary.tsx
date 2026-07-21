"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { impactNumbers } from "@/content/cm2Impact";
import styles from "./widgets.module.css";

const CYCLE_MS = 4000;

export default function ImpactSummary() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % impactNumbers.length), CYCLE_MS);
    return () => clearInterval(id);
  }, []);

  const stat = impactNumbers[index];

  return (
    <div className={styles.summaryStat}>
      <AnimatePresence mode="wait">
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
        >
          <span className={styles.summaryHeadline}>{stat.value}</span>
          <span className={styles.summaryLabel}>{stat.label}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
