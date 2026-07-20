"use client";

import { useSyncExternalStore } from "react";

export const MOBILE_BREAKPOINT_PX = 900;

function subscribe(callback: () => void) {
  const query = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX}px)`);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX}px)`).matches;
}

function getServerSnapshot() {
  return false;
}

// Bridges the browser's matchMedia state into React without a setState-in-effect
// (useSyncExternalStore is the recommended pattern for external, subscribable
// browser state and avoids hydration-mismatch warnings by design).
export function useIsMobile(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
