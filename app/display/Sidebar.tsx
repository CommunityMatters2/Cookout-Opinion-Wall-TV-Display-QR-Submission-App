"use client";

import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { siteConfig } from "@/config/site";
import styles from "./display.module.css";

export default function Sidebar() {
  const { cm2 } = siteConfig;
  const submitUrl = process.env.NEXT_PUBLIC_SUBMIT_URL || "http://localhost:3000";

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarBrand}>
        <Image src={cm2.logo} alt={cm2.orgName} width={56} height={56} className={styles.sidebarLogo} />
        <span className={styles.sidebarOrgName}>{cm2.orgName}</span>
      </div>

      <div
        className={styles.sidebarPhoto}
        style={{ backgroundImage: `url(${cm2.heroPhoto})` }}
      />

      <p className={styles.sidebarMission}>&ldquo;{cm2.mission}&rdquo;</p>

      <div className={styles.impactCard}>
        <span className={styles.impactNumber}>$1 → $3–$12</span>
        <span className={styles.impactLabel}>saved for every dollar invested in youth programming</span>
      </div>

      <div
        className={styles.sidebarPhotoSmall}
        style={{ backgroundImage: `url(${cm2.muralPhoto})` }}
      />
      <p className={styles.sidebarCaption}>Our mural on N. Hamilton St, Poughkeepsie</p>

      <div className={styles.qrBlock}>
        <div className={styles.qrBox}>
          <QRCodeSVG value={submitUrl} size={112} />
        </div>
        <p className={styles.qrLabel}>Scan to join in — answer a few questions &amp; share your opinion!</p>
      </div>

      <div className={styles.sidebarSocial}>
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
      <p className={styles.sidebarWebsite}>{cm2.website}</p>
    </aside>
  );
}
