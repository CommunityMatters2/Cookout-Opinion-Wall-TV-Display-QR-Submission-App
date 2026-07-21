"use client";

import type { Message } from "@/types/message";
import { useLiveOpinions } from "@/lib/hooks/useLiveOpinions";
import { useViewportSafetyRedirect } from "@/lib/hooks/useViewportSafetyRedirect";
import { PhotosProvider } from "@/lib/hooks/usePhotos";
import DisplayBackground from "@/app/display/DisplayBackground";
import Ticker from "@/app/display/Ticker";
import LiveZone from "@/app/display/LiveZone";
import ExploreZone from "@/app/display/ExploreZone";
import QrCorner from "@/app/display/QrCorner";
import QrCornerDonate from "@/app/display/QrCornerDonate";
import styles from "./display.module.css";

export default function CommandCenter({
  initialMessages,
  photos,
}: {
  initialMessages: Message[];
  photos: string[];
}) {
  const { messages, incomingMessage, consumeIncoming } = useLiveOpinions(initialMessages);
  useViewportSafetyRedirect("display");

  return (
    <PhotosProvider photos={photos}>
      <div className={styles.stage}>
        <DisplayBackground photos={photos} dimmed />
        <div className={styles.content}>
          <Ticker liveCount={messages.length} />
          <div className={styles.zonesRow}>
            <LiveZone messages={messages} incomingMessage={incomingMessage} onIncomingConsumed={consumeIncoming} />
            <ExploreZone />
          </div>
        </div>
        <QrCornerDonate />
        <QrCorner />
      </div>
    </PhotosProvider>
  );
}
