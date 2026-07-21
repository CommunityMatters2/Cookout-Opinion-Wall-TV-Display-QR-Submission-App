"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Defensive safety net only — the normal path is link-based (Hub and
// SurveyFlow send phones to /wall; the TV_DOMAIN proxy sends the kiosk to
// /display). Each direction checks two conditions together so a resized
// desktop window or an oddly-sized TV can't trip the wrong redirect.
export function useViewportSafetyRedirect(currentRoute: "display" | "wall") {
  const router = useRouter();

  useEffect(() => {
    if (currentRoute === "display") {
      const isPhoneSized = window.matchMedia("(max-width: 600px)").matches;
      const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
      if (isPhoneSized && isCoarsePointer) router.replace("/wall");
    } else {
      const isTvSized = window.matchMedia("(min-width: 1280px)").matches;
      const isFinePointer = window.matchMedia("(pointer: fine)").matches;
      const isLandscape = window.matchMedia("(orientation: landscape)").matches;
      if (isTvSized && isFinePointer && isLandscape) router.replace("/display");
    }
  }, [currentRoute, router]);
}
