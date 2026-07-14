"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { siteConfig } from "@/config/site";
import styles from "./display.module.css";

const HYPE_DURATION_MS = 6000;

export default function InfoPanel() {
  const { cm2 } = siteConfig;
  const submitUrl = process.env.NEXT_PUBLIC_SUBMIT_URL || "http://localhost:3000";
  const [hypeIndex, setHypeIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setHypeIndex((i) => (i + 1) % cm2.hypeLines.length);
    }, HYPE_DURATION_MS);
    return () => clearInterval(id);
  }, [cm2.hypeLines.length]);

  const hype = cm2.hypeLines[hypeIndex];

  return (
    <aside className={styles.infoPanel}>
      <div className={styles.infoBrand}>
        <Image src={cm2.logo} alt={cm2.orgName} width={52} height={52} className={styles.infoLogo} />
        <span className={styles.infoOrgName}>{cm2.orgName}</span>
      </div>

      <div className={styles.hypeBlock}>
        <div key={hypeIndex} className={styles.hypeAnimated}>
          <p className={styles.hypeHeadline}>{hype.headline}</p>
          <p className={styles.hypeSub}>{hype.sub}</p>
        </div>
        <div className={styles.hypeDots}>
          {cm2.hypeLines.map((_, i) => (
            <span key={i} className={`${styles.hypeDot} ${i === hypeIndex ? styles.hypeDotActive : ""}`} />
          ))}
        </div>
      </div>

      <div className={styles.statRow}>
        {cm2.stats.map((s) => (
          <div key={s.label} className={styles.statTile}>
            <span className={styles.statValue}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      <div className={styles.qrBlock}>
        <div className={styles.qrBox}>
          <QRCodeSVG value={submitUrl} size={104} />
        </div>
        <p className={styles.qrLabel}>Scan to join in — answer a few questions &amp; share your opinion!</p>
      </div>

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
      <p className={styles.infoWebsite}>{cm2.website}</p>
    </aside>
  );
}
