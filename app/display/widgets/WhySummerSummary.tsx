"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { summerWhyItMatters } from "@/content/cm2Impact";
import styles from "./widgets.module.css";

const CYCLE_MS = 5000;

export default function WhySummerSummary() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % summerWhyItMatters.length), CYCLE_MS);
    return () => clearInterval(id);
  }, []);

  const fact = summerWhyItMatters[index];

  return (
    <div className={styles.summaryStat}>
      <AnimatePresence mode="wait">
        <motion.div
          key={fact.key}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
        >
          <span className={styles.summaryHeadline}>{fact.value}</span>
          <span className={styles.summaryLabel}>{fact.label}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
