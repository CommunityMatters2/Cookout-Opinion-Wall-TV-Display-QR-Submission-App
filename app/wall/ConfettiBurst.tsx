"use client";

import { useState } from "react";
import styles from "./wall.module.css";

const COLORS = ["#ff6b35", "#f5a623", "#ffd166", "#1e9fb3", "#ff5a5f", "#43a75b"];
const PIECE_COUNT = 46;

// Zero-dependency confetti, matching the ParticleBurst pattern already used on
// the display wall (app/display/scenes/LiveOpinionsScene.tsx) — randomized
// per-piece CSS custom properties drive a single shared @keyframes fall.
export default function ConfettiBurst() {
  const [pieces] = useState(() =>
    Array.from({ length: PIECE_COUNT }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: COLORS[i % COLORS.length],
      delay: Math.random() * 0.3,
      duration: 1.6 + Math.random() * 0.9,
      drift: Math.round((Math.random() - 0.5) * 160),
      rotate: Math.round(Math.random() * 540 - 270),
      width: 6 + Math.round(Math.random() * 6),
    }))
  );

  return (
    <div className={styles.confettiRoot} aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className={styles.confettiPiece}
          style={
            {
              left: `${p.left}%`,
              width: `${p.width}px`,
              height: `${Math.round(p.width * 0.4)}px`,
              background: p.color,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              "--drift": `${p.drift}px`,
              "--rotate": `${p.rotate}deg`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
