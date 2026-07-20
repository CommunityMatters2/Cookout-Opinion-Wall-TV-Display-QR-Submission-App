"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import styles from "./display.module.css";

const COUNT_DURATION_MS = 1400;

function splitValue(value: string): { prefix: string; target: number | null; suffix: string } {
  const match = value.match(/^([^\d]*)([\d,]+)(.*)$/);
  if (!match) return { prefix: "", target: null, suffix: value };
  const [, prefix, digits, suffix] = match;
  return { prefix, target: parseInt(digits.replace(/,/g, ""), 10), suffix };
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

// Animates the numeric portion of a stat string (e.g. "1,000+", "$350K+", "2 Tons")
// from 0 up to its target, then fires a brief glow pulse once it lands. Respects
// prefers-reduced-motion by skipping straight to the final value.
export default function CountUp({
  value,
  className,
  delayMs = 0,
}: {
  value: string;
  className?: string;
  delayMs?: number;
}) {
  const { prefix, target, suffix } = splitValue(value);
  const prefersReduced = useReducedMotion();
  const [display, setDisplay] = useState<number | null>(target === null || prefersReduced ? target : 0);
  const [landed, setLanded] = useState(false);
  const showGlow = landed || target === null || Boolean(prefersReduced);

  useEffect(() => {
    if (target === null || prefersReduced) return;
    const numericTarget = target;
    let raf: number;
    const startTimer = setTimeout(() => {
      const start = performance.now();
      function tick(now: number) {
        const progress = Math.min(1, (now - start) / COUNT_DURATION_MS);
        setDisplay(Math.round(easeOutCubic(progress) * numericTarget));
        if (progress < 1) {
          raf = requestAnimationFrame(tick);
        } else {
          setLanded(true);
        }
      }
      raf = requestAnimationFrame(tick);
    }, delayMs);

    return () => {
      clearTimeout(startTimer);
      cancelAnimationFrame(raf);
    };
  }, [target, prefersReduced, delayMs]);

  return (
    <span className={`${styles.countUp} ${showGlow ? styles.countUpLanded : ""} ${className ?? ""}`}>
      {prefix}
      {target === null ? "" : display!.toLocaleString()}
      {suffix}
    </span>
  );
}
