"use client";

import { AnimatePresence, motion } from "framer-motion";
import ConfettiBurst from "@/app/wall/ConfettiBurst";
import styles from "./display.module.css";

export default function MilestoneBanner({ milestone }: { milestone: number | null }) {
  return (
    <AnimatePresence>
      {milestone !== null && (
        <>
          <ConfettiBurst />
          <div className={styles.milestoneOverlay}>
            <motion.div
              className={styles.milestoneBanner}
              initial={{ opacity: 0, scale: 0.7, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: -20 }}
              transition={{ type: "spring", stiffness: 240, damping: 18 }}
            >
              {milestone} voices strong! 🎉
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
