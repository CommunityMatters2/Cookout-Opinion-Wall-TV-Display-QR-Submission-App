"use client";

import { motion } from "framer-motion";
import styles from "./widgets.module.css";

export default function ROISummary() {
  return (
    <div className={styles.summaryStat}>
      <motion.div
        className={styles.miniCoin}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
      >
        $1
      </motion.div>
      <span className={styles.summaryLabel}>saves $3–$12 later</span>
    </div>
  );
}
