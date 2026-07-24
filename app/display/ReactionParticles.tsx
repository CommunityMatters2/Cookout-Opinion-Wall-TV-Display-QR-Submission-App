"use client";

import { useEffect, useState } from "react";
import type { ReactionEvent } from "@/lib/hooks/useReactionBroadcast";
import styles from "./display.module.css";

const PARTICLE_LIFETIME_MS = 3200;
const MAX_PARTICLES = 24;

let particleIdCounter = 0;

export default function ReactionParticles({ incoming }: { incoming: ReactionEvent | null }) {
  const [particles, setParticles] = useState<{ id: number; emoji: string; left: number }[]>([]);

  useEffect(() => {
    function addParticle() {
      if (!incoming) return;
      const id = ++particleIdCounter;
      const left = 10 + Math.random() * 80;
      setParticles((prev) => [...prev.slice(-MAX_PARTICLES + 1), { id, emoji: incoming.emoji, left }]);
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== id));
      }, PARTICLE_LIFETIME_MS);
    }
    addParticle();
  }, [incoming]);

  return (
    <div className={styles.reactionParticleLayer} aria-hidden="true">
      {particles.map((p) => (
        <span key={p.id} className={styles.reactionParticle} style={{ left: `${p.left}%` }}>
          {p.emoji}
        </span>
      ))}
    </div>
  );
}
