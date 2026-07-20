"use client";

import { motion } from "framer-motion";
import { TrendingDown, ShieldCheck, Briefcase, Rocket, HeartHandshake, type LucideIcon } from "lucide-react";
import { summerWhyItMatters, summerInfrastructureLine } from "@/content/cm2Impact";
import shared from "../display.module.css";
import styles from "./scenes.module.css";

const ICONS: Record<string, LucideIcon> = {
  learningLoss: TrendingDown,
  reducedRisk: ShieldCheck,
  workingParents: Briefcase,
  workforceReady: Rocket,
  lessIsolation: HeartHandshake,
};

export default function WhySummerMattersScene() {
  return (
    <div className={styles.sceneRoot}>
      <div className={styles.headerBlock}>
        <p className={shared.kicker}>Why Summer Matters</p>
        <h1 className={shared.headline}>The Case For Summer</h1>
      </div>

      <motion.div
        className={styles.whyGrid}
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
      >
        {summerWhyItMatters.map((fact) => {
          const Icon = ICONS[fact.key] ?? Rocket;
          return (
            <motion.div
              key={fact.key}
              className={`${shared.glassPanel} ${styles.whyCard}`}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 240, damping: 22 } },
              }}
            >
              <span className={styles.whyIcon}>
                <Icon size={22} strokeWidth={2} />
              </span>
              <span className={styles.whyValue}>{fact.value}</span>
              <span className={styles.whyLabel}>{fact.label}</span>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.p
        className={styles.whyClosing}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
      >
        {summerInfrastructureLine}
      </motion.p>
    </div>
  );
}
