"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { widgetRegistry } from "@/lib/widgets/registry";
import WallLiveFeed from "@/app/wall/WallLiveFeed";
import WallWidgetCard from "@/app/wall/WallWidgetCard";
import ConfettiWelcome from "@/app/wall/ConfettiWelcome";
import InsiderPitchCard from "@/app/wall/InsiderPitchCard";
import ShareCTA from "@/app/wall/ShareCTA";
import styles from "./wall.module.css";

export default function WallHomePage() {
  const searchParams = useSearchParams();
  const scrollTo = searchParams.get("scrollTo");

  useEffect(() => {
    if (!scrollTo) return;
    const id = requestAnimationFrame(() => {
      document.getElementById(scrollTo)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => cancelAnimationFrame(id);
  }, [scrollTo]);

  return (
    <div className={styles.homeRoot}>
      <ConfettiWelcome />
      <WallLiveFeed />
      <InsiderPitchCard />
      <ShareCTA />

      <div className={styles.widgetStack}>
        {widgetRegistry.map((widget, i) => (
          <WallWidgetCard
            key={widget.id}
            widget={widget}
            anchorId={i === 0 ? "impact" : i === 2 ? "about" : undefined}
          />
        ))}
      </div>
    </div>
  );
}
