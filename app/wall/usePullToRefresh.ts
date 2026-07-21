"use client";

import { useEffect, useRef, useState } from "react";

const PULL_THRESHOLD = 70;

// Minimal touch-driven pull-to-refresh: only arms when the page is already
// scrolled to the top, so it never fights normal vertical scrolling.
export function usePullToRefresh(onRefresh: () => void | Promise<void>) {
  const [pulling, setPulling] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef<number | null>(null);

  useEffect(() => {
    function handleTouchStart(e: TouchEvent) {
      startY.current = window.scrollY <= 0 ? e.touches[0].clientY : null;
    }

    function handleTouchMove(e: TouchEvent) {
      if (startY.current === null) return;
      const delta = e.touches[0].clientY - startY.current;
      setPulling(delta > PULL_THRESHOLD && window.scrollY <= 0);
    }

    async function handleTouchEnd() {
      if (startY.current === null) return;
      if (pulling) {
        setRefreshing(true);
        await onRefresh();
        setRefreshing(false);
      }
      setPulling(false);
      startY.current = null;
    }

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [pulling, onRefresh]);

  return { refreshing };
}
