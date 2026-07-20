"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { missionStatement } from "@/content/cm2Impact";
import { siteConfig } from "@/config/site";
import shared from "../display.module.css";
import styles from "./scenes.module.css";

const HYPE_DURATION_MS = 6000;
const words = (text: string) => text.split(" ");

export default function MissionQuoteScene() {
  const { cm2 } = siteConfig;
  const [hypeIndex, setHypeIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setHypeIndex((i) => (i + 1) % cm2.hypeLines.length), HYPE_DURATION_MS);
    return () => clearInterval(id);
  }, [cm2.hypeLines.length]);

  const hype = cm2.hypeLines[hypeIndex];

  return (
    <div className={styles.missionScene}>
      <p className={shared.kicker}>Our Mission</p>

      <p className={styles.missionQuoteText}>
        {words(missionStatement).map((word, i) => (
          <motion.span
            key={i}
            style={{ display: "inline-block", marginRight: "0.3em" }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.045, duration: 0.4 }}
          >
            {word}
          </motion.span>
        ))}
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={hypeIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
        >
          <p className={styles.missionAttribution}>{hype.headline}</p>
          <p className={styles.missionHypeLine}>{hype.sub}</p>
        </motion.div>
      </AnimatePresence>

      <p className={styles.missionTagline}>
        {cm2.mission} — Empowering Youth Since 2018 · {cm2.address}
      </p>
    </div>
  );
}
