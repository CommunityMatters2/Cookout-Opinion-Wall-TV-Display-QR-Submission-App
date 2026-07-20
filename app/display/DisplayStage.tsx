"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { Message } from "@/types/message";
import { impactNumberPages } from "@/content/cm2Impact";
import DisplayBackground from "@/app/display/DisplayBackground";
import Ticker from "@/app/display/Ticker";
import QrCorner from "@/app/display/QrCorner";
import SceneProgress from "@/app/display/SceneProgress";
import LiveOpinionsScene from "@/app/display/scenes/LiveOpinionsScene";
import ImpactStatsScene from "@/app/display/scenes/ImpactStatsScene";
import GrowthTimelineScene from "@/app/display/scenes/GrowthTimelineScene";
import SignatureProgramsScene from "@/app/display/scenes/SignatureProgramsScene";
import SummerCampScene from "@/app/display/scenes/SummerCampScene";
import ROIScene from "@/app/display/scenes/ROIScene";
import WhySummerMattersScene from "@/app/display/scenes/WhySummerMattersScene";
import MissionQuoteScene from "@/app/display/scenes/MissionQuoteScene";
import PhotoMomentScene from "@/app/display/scenes/PhotoMomentScene";
import CommunityVoiceScene from "@/app/display/scenes/CommunityVoiceScene";
import styles from "./display.module.css";

const MAX_MESSAGES = 150;
const LIVE_HOLD_MS = 26000;
const OTHER_HOLD_MS = 22000;

// "live" is the anchor scene the rotation always returns to, alternating with one
// entry from this list at a time. Impact Stats gets one entry per pre-chunked page
// (see content/cm2Impact.ts) so all 13 numbers get shown across the full rotation
// without cramming them onto one screen.
const OTHER_SCENES: string[] = [
  "impact-0",
  "timeline",
  "programs",
  "impact-1",
  "summerCamp",
  "roi",
  "impact-2",
  "whySummer",
  "mission",
  "photo",
  "voice",
].filter((id) => !id.startsWith("impact-") || impactNumberPages[parseInt(id.split("-")[1], 10)]);

function renderScene(sceneId: string, messages: Message[], incomingMessage: Message | null, onConsumed: () => void) {
  if (sceneId === "live") {
    return <LiveOpinionsScene messages={messages} incomingMessage={incomingMessage} onIncomingConsumed={onConsumed} />;
  }
  if (sceneId.startsWith("impact-")) {
    const idx = parseInt(sceneId.split("-")[1], 10);
    return <ImpactStatsScene stats={impactNumberPages[idx] ?? impactNumberPages[0]} />;
  }
  switch (sceneId) {
    case "timeline":
      return <GrowthTimelineScene />;
    case "programs":
      return <SignatureProgramsScene />;
    case "summerCamp":
      return <SummerCampScene />;
    case "roi":
      return <ROIScene />;
    case "whySummer":
      return <WhySummerMattersScene />;
    case "mission":
      return <MissionQuoteScene />;
    case "photo":
      return <PhotoMomentScene />;
    case "voice":
      return <CommunityVoiceScene />;
    default:
      return null;
  }
}

export default function DisplayStage({
  initialMessages,
  photos,
}: {
  initialMessages: Message[];
  photos: string[];
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [incomingMessage, setIncomingMessage] = useState<Message | null>(null);
  const [sceneId, setSceneId] = useState<string>("live");
  const [otherIndex, setOtherIndex] = useState(0);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    const channel = supabase
      .channel("messages-wall")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const row = payload.new as Message;
          if (!row.approved) return;
          setMessages((prev) => [row, ...prev].slice(0, MAX_MESSAGES));
          setIncomingMessage(row);
          setSceneId("live");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const holdMs = sceneId === "live" ? LIVE_HOLD_MS : OTHER_HOLD_MS;
    const id = setTimeout(() => {
      if (sceneId === "live") {
        setSceneId(OTHER_SCENES[otherIndex]);
      } else {
        setOtherIndex((i) => (i + 1) % OTHER_SCENES.length);
        setSceneId("live");
      }
    }, holdMs);
    return () => clearTimeout(id);
  }, [sceneId, otherIndex]);

  const isPhoto = sceneId === "photo";

  return (
    <div className={styles.stage}>
      <DisplayBackground photos={photos} dimmed={isPhoto} />
      <div className={styles.content}>
        <Ticker liveCount={messages.length} />
        <div className={styles.sceneViewport}>
          <AnimatePresence mode="wait">
            <motion.div
              key={sceneId}
              className={styles.sceneInner}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
            >
              {renderScene(sceneId, messages, incomingMessage, () => setIncomingMessage(null))}
            </motion.div>
          </AnimatePresence>
        </div>
        <SceneProgress count={OTHER_SCENES.length} activeIndex={otherIndex} showingLive={sceneId === "live"} />
      </div>
      <QrCorner />
    </div>
  );
}
