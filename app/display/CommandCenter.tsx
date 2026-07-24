"use client";

import type { Message } from "@/types/message";
import { useLiveOpinions } from "@/lib/hooks/useLiveOpinions";
import { useViewportSafetyRedirect } from "@/lib/hooks/useViewportSafetyRedirect";
import { useMilestoneWatcher } from "@/lib/hooks/useMilestoneWatcher";
import { useReactionBroadcast } from "@/lib/hooks/useReactionBroadcast";
import { useKioskWatchdog } from "@/lib/hooks/useKioskWatchdog";
import { PhotosProvider } from "@/lib/hooks/usePhotos";
import DisplayBackground from "@/app/display/DisplayBackground";
import Ticker from "@/app/display/Ticker";
import LiveZone from "@/app/display/LiveZone";
import ExploreZone from "@/app/display/ExploreZone";
import QrCorner from "@/app/display/QrCorner";
import QrCornerDonate from "@/app/display/QrCornerDonate";
import MilestoneBanner from "@/app/display/MilestoneBanner";
import GoldenOpinionSpotlight from "@/app/display/GoldenOpinionSpotlight";
import ReactionParticles from "@/app/display/ReactionParticles";
import ConnectionPip from "@/app/display/ConnectionPip";
import styles from "./display.module.css";

export default function CommandCenter({
  initialMessages,
  initialTotalCount,
  photos,
}: {
  initialMessages: Message[];
  initialTotalCount: number;
  photos: string[];
}) {
  const { messages, incomingMessage, consumeIncoming, connectionStatus } = useLiveOpinions(initialMessages);
  const milestone = useMilestoneWatcher(initialTotalCount, incomingMessage);
  const { incoming: incomingReaction } = useReactionBroadcast();
  useViewportSafetyRedirect("display");
  useKioskWatchdog(connectionStatus);

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
        <ReactionParticles incoming={incomingReaction} />
        <GoldenOpinionSpotlight />
        <MilestoneBanner milestone={milestone} />
        <ConnectionPip status={connectionStatus} />
      </div>
    </PhotosProvider>
  );
}
