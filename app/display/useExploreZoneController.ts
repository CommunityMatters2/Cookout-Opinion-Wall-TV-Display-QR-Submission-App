"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const AUTO_COLLAPSE_MS = 60000;
const IDLE_TOUR_MS = 90000;
const TOUR_HOLD_MS = 11000;
const TICK_MS = 1000;

export type ZoneMode = "grid" | "expanded" | "tour";

// Drives the Explore Zone's three states off a single "last interaction" clock:
// grid (nothing open) <-> expanded (one widget open manually, auto-collapses
// after AUTO_COLLAPSE_MS) -> tour (ambient auto-showcase after IDLE_TOUR_MS of
// silence from either state). Any interaction snaps straight back to grid.
//
// The widget actually shown while expanded/touring is derived from mode +
// tourIndex/expandedIndex during render rather than mirrored into its own
// state via an effect, so there's nothing to keep in sync.
export function useExploreZoneController(widgetCount: number) {
  const [mode, setMode] = useState<ZoneMode>("grid");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [tourIndex, setTourIndex] = useState(0);

  const lastInteractionRef = useRef(0);
  const modeRef = useRef<ZoneMode>("grid");

  useEffect(() => {
    lastInteractionRef.current = Date.now();
  }, []);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  const noteInteraction = useCallback(() => {
    lastInteractionRef.current = Date.now();
    if (modeRef.current === "tour") {
      setMode("grid");
      setFocusedIndex(0);
    }
  }, []);

  // Whole-screen taps (Live Zone, ticker, QR corners) also count as interaction,
  // even though they're outside the Explore Zone's own keydown handler.
  useEffect(() => {
    const handle = () => noteInteraction();
    window.addEventListener("pointerdown", handle);
    window.addEventListener("touchstart", handle);
    return () => {
      window.removeEventListener("pointerdown", handle);
      window.removeEventListener("touchstart", handle);
    };
  }, [noteInteraction]);

  useEffect(() => {
    const id = setInterval(() => {
      const idleFor = Date.now() - lastInteractionRef.current;
      setMode((prev) => {
        if (prev === "expanded" && idleFor >= AUTO_COLLAPSE_MS) return "grid";
        if (prev !== "tour" && idleFor >= IDLE_TOUR_MS) return "tour";
        return prev;
      });
    }, TICK_MS);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (mode !== "tour" || widgetCount === 0) return;
    const id = setTimeout(() => {
      setTourIndex((i) => (i + 1) % widgetCount);
    }, TOUR_HOLD_MS);
    return () => clearTimeout(id);
  }, [mode, tourIndex, widgetCount]);

  const expand = useCallback(
    (index: number) => {
      noteInteraction();
      setExpandedIndex(index);
      setFocusedIndex(index);
      setMode("expanded");
    },
    [noteInteraction]
  );

  const collapse = useCallback(() => {
    noteInteraction();
    setMode("grid");
  }, [noteInteraction]);

  const moveFocus = useCallback(
    (delta: number) => {
      noteInteraction();
      setFocusedIndex((i) => Math.min(widgetCount - 1, Math.max(0, i + delta)));
    },
    [noteInteraction, widgetCount]
  );

  const effectiveExpandedIndex =
    mode === "tour" ? (widgetCount > 0 ? tourIndex % widgetCount : null) : mode === "expanded" ? expandedIndex : null;

  return { mode, expandedIndex: effectiveExpandedIndex, focusedIndex, expand, collapse, moveFocus, noteInteraction };
}
