"use client";

import { motion } from "framer-motion";
import { Waves, Flag, UtensilsCrossed, Tent, Briefcase, Cpu, type LucideIcon } from "lucide-react";
import { signaturePrograms } from "@/content/cm2Impact";
import shared from "../display.module.css";
import styles from "./scenes.module.css";

const META: Record<string, { tag: string; color: string; icon: LucideIcon }> = {
  "Swim With A Friend": { tag: "HEALTH", color: "#1E9FB3", icon: Waves },
  "TEE TIME! Golf Program": { tag: "CHARACTER", color: "#F5A623", icon: Flag },
  "Etiquette & Spice Masterclass": { tag: "LIFE SKILLS", color: "#43A75B", icon: UtensilsCrossed },
  "Extraordinary Youth Summer Camp": { tag: "CAMP", color: "#FF6B35", icon: Tent },
  "NexGen Career Connections": { tag: "CAREER", color: "#8452D9", icon: Briefcase },
  "IGNITE Academy": { tag: "MEDIA & TECH", color: "#FF5A5F", icon: Cpu },
};

export default function SignatureProgramsScene() {
  return (
    <div className={styles.sceneRoot}>
      <div className={styles.headerBlock}>
        <p className={shared.kicker}>6 Core Programs</p>
        <h1 className={shared.headline}>Signature Programs</h1>
      </div>

      <motion.div
        className={styles.programsGrid}
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
      >
        {signaturePrograms.map((program) => {
          const meta = META[program.name] ?? { tag: "PROGRAM", color: "#F5A623", icon: Flag };
          const Icon = meta.icon;
          return (
            <motion.div
              key={program.name}
              className={`${shared.glassPanel} ${styles.programCard}`}
              style={{ "--card-accent": meta.color } as React.CSSProperties}
              variants={{
                hidden: { opacity: 0, rotateX: -35, y: 24 },
                show: { opacity: 1, rotateX: 0, y: 0, transition: { type: "spring", stiffness: 240, damping: 22 } },
              }}
            >
              <div className={styles.programIconWrap}>
                <Icon size={22} strokeWidth={2} />
              </div>
              <span className={styles.programTag}>{meta.tag}</span>
              <span className={styles.programName}>{program.name}</span>
              <p className={styles.programDesc}>{program.description}</p>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
