"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useGoldenOpinion } from "@/lib/hooks/useGoldenOpinion";
import styles from "./display.module.css";

// Recomputed centrally every 15 minutes by a Vercel Cron job (see
// app/api/cron/golden-opinion/route.ts) and read here via a shared poll, so
// every screen spotlights the same opinion at the same time.
export default function GoldenOpinionSpotlight() {
  const opinion = useGoldenOpinion();

  return (
    <AnimatePresence>
      {opinion && (
        <div className={styles.goldenOverlay}>
          <motion.div
            className={styles.goldenCard}
            initial={{ opacity: 0, scale: 0.7, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -20 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
          >
            <span className={styles.goldenBadge}>✨ Voice of the Moment</span>
            <p className={styles.goldenName}>{opinion.name}</p>
            <p className={styles.goldenMessage}>{opinion.message}</p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
