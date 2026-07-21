"use client";

import type { Message } from "@/types/message";
import LiveOpinionsScene from "@/app/display/scenes/LiveOpinionsScene";
import styles from "./display.module.css";

export default function LiveZone({
  messages,
  incomingMessage,
  onIncomingConsumed,
}: {
  messages: Message[];
  incomingMessage: Message | null;
  onIncomingConsumed: () => void;
}) {
  return (
    <div className={styles.liveZone}>
      <LiveOpinionsScene messages={messages} incomingMessage={incomingMessage} onIncomingConsumed={onIncomingConsumed} />
    </div>
  );
}
