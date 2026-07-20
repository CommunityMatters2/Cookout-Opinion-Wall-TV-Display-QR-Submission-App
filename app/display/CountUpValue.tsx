"use client";

import { useEffect, useState } from "react";

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
// from 0 up to its target once the component mounts, keeping any prefix/suffix static.
export default function CountUpValue({ value, className }: { value: string; className?: string }) {
  const { prefix, target, suffix } = splitValue(value);
  const [display, setDisplay] = useState(target === null ? target : 0);

  useEffect(() => {
    if (target === null) return;
    let raf: number;
    const start = performance.now();

    function tick(now: number) {
      const progress = Math.min(1, (now - start) / COUNT_DURATION_MS);
      setDisplay(Math.round(easeOutCubic(progress) * target!));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  if (target === null) {
    return <span className={className}>{suffix}</span>;
  }

  return (
    <span className={className}>
      {prefix}
      {display!.toLocaleString()}
      {suffix}
    </span>
  );
}
