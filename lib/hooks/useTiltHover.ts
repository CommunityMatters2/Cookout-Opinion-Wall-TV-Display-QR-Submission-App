"use client";

import type { PointerEvent } from "react";
import { useMotionValue, useSpring, useTransform } from "framer-motion";

const MAX_TILT_DEG = 6;

// Subtle 3D tilt on pointer move — gated to mouse input only (touch/TV have
// no hover), so this is purely a nice-to-have on desktop browsers without
// affecting the primary mobile/TV experience.
export function useTiltHover() {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(y, [0, 1], [MAX_TILT_DEG, -MAX_TILT_DEG]), { stiffness: 300, damping: 25 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-MAX_TILT_DEG, MAX_TILT_DEG]), { stiffness: 300, damping: 25 });

  function onPointerMove(e: PointerEvent<HTMLElement>) {
    if (e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  }

  function onPointerLeave() {
    x.set(0.5);
    y.set(0.5);
  }

  return { rotateX, rotateY, onPointerMove, onPointerLeave };
}
