"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { siteConfig } from "@/config/site";
import ImpactDashboardScene from "@/app/display/ImpactDashboardScene";
import ProgramsSpotlightScene from "@/app/display/ProgramsSpotlightScene";
import CommunityVoicePanel from "@/app/display/CommunityVoicePanel";
import styles from "./display.module.css";

const SCENE_DURATION_MS = 9000;
const SCENES = ["hype", "impact", "programs", "voice"] as const;
type Scene = (typeof SCENES)[number];

function HypeScene({ hype }: { hype: { headline: string; sub: string } }) {
  return (
    <div className={styles.hypeBlock}>
      <p className={styles.hypeHeadline}>{hype.headline}</p>
      <p className={styles.hypeSub}>{hype.sub}</p>
    </div>
  );
}

export default function BroadcastPanel() {
  const { cm2 } = siteConfig;
  const submitUrl = process.env.NEXT_PUBLIC_SUBMIT_URL || "http://localhost:3000";
  const [sceneIndex, setSceneIndex] = useState(0);
  const [hypeIndex, setHypeIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSceneIndex((i) => (i + 1) % SCENES.length), SCENE_DURATION_MS);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setHypeIndex((i) => (i + 1) % cm2.hypeLines.length), SCENE_DURATION_MS);
    return () => clearInterval(id);
  }, [cm2.hypeLines.length]);

  const scene: Scene = SCENES[sceneIndex];

  return (
    <aside className={styles.broadcastPanel}>
      <div className={styles.infoBrand}>
        <Image src={cm2.logo} alt={cm2.orgName} width={44} height={44} className={styles.infoLogo} />
        <span className={styles.infoOrgName}>{cm2.orgName}</span>
      </div>

      <div className={styles.sceneStage} key={scene}>
        {scene === "hype" && <HypeScene hype={cm2.hypeLines[hypeIndex]} />}
        {scene === "impact" && <ImpactDashboardScene compact />}
        {scene === "programs" && <ProgramsSpotlightScene />}
        {scene === "voice" && <CommunityVoicePanel variant="teaser" />}
      </div>

      <div className={styles.sceneDots}>
        {SCENES.map((s, i) => (
          <span key={s} className={`${styles.sceneDot} ${i === sceneIndex ? styles.sceneDotActive : ""}`} />
        ))}
      </div>

      <div className={styles.qrBlock}>
        <div className={styles.qrBox}>
          <QRCodeSVG value={submitUrl} size={92} />
        </div>
        <p className={styles.qrLabel}>Scan to join in — answer a few questions &amp; share your opinion!</p>
        <div className={styles.infoSocial}>
          <a href={cm2.social.facebook} target="_blank" rel="noopener noreferrer" className={styles.socialPill}>
            Facebook
          </a>
          <a href={cm2.social.instagram} target="_blank" rel="noopener noreferrer" className={styles.socialPill}>
            Instagram
          </a>
          <a href={cm2.social.tiktok} target="_blank" rel="noopener noreferrer" className={styles.socialPill}>
            TikTok
          </a>
        </div>
      </div>
    </aside>
  );
}
