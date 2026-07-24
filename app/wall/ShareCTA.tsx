"use client";

import { siteConfig } from "@/config/site";
import ShareButton from "@/app/wall/ShareButton";
import styles from "./wall.module.css";

export default function ShareCTA() {
  const url = typeof window !== "undefined" ? `${window.location.origin}/wall` : "/wall";

  return (
    <div className={styles.shareCta}>
      <p className={styles.shareCtaText}>
        Share {siteConfig.shareTitle} with friends — get a chance to be <strong>FEATURED</strong> on the big
        screen! ⭐
      </p>
      <ShareButton
        title={siteConfig.shareTitle}
        url={url}
        text={siteConfig.shareText}
        targetType="wall"
        targetId="home"
      />
    </div>
  );
}
