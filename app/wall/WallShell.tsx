"use client";

import type { ReactNode } from "react";
import type { Message } from "@/types/message";
import { LiveOpinionsProvider } from "@/lib/hooks/LiveOpinionsContext";
import { ReactionsProvider } from "@/lib/hooks/ReactionsContext";
import { useViewportSafetyRedirect } from "@/lib/hooks/useViewportSafetyRedirect";
import WallTopBar from "@/app/wall/WallTopBar";
import WallBottomNav from "@/app/wall/WallBottomNav";
import styles from "./wall.module.css";

export default function WallShell({
  initialMessages,
  children,
}: {
  initialMessages: Message[];
  children: ReactNode;
}) {
  useViewportSafetyRedirect("wall");

  return (
    <LiveOpinionsProvider initialMessages={initialMessages}>
      <ReactionsProvider>
        <div className={styles.page}>
          <WallTopBar />
          <main className={styles.main}>{children}</main>
          <WallBottomNav />
        </div>
      </ReactionsProvider>
    </LiveOpinionsProvider>
  );
}
