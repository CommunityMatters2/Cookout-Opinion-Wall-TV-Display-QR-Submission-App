"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import ConfettiBurst from "./ConfettiBurst";
import styles from "./wall.module.css";

const VISIBLE_MS = 2500;

// Fires once per submitted message id (guarded via sessionStorage so a page
// refresh or back-navigation to the same ?highlight= link doesn't replay it).
export default function ConfettiWelcome() {
  const searchParams = useSearchParams();
  const highlightId = searchParams.get("highlight");
  const [show, setShow] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    function maybeShow() {
      if (!highlightId || typeof window === "undefined") return;
      const flagKey = `cm2_confetti_shown_${highlightId}`;
      if (sessionStorage.getItem(flagKey)) return;
      sessionStorage.setItem(flagKey, "1");
      setShow(true);
      timeoutId = setTimeout(() => setShow(false), VISIBLE_MS);
    }
    maybeShow();

    return () => clearTimeout(timeoutId);
  }, [highlightId]);

  return (
    <AnimatePresence>
      {show && (
        <>
          <ConfettiBurst />
          <div className={styles.confettiToastWrap}>
            <motion.div
              className={styles.confettiToast}
              initial={{ opacity: 0, y: -16, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              Your voice is live! 🎉
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
