"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { impactNumbers } from "@/content/cm2Impact";
import SurveyFlow from "@/app/SurveyFlow";
import styles from "./Hub.module.css";

const IMPACT_CHIP_COUNT = 4;

export default function Hub() {
  const [showSurvey, setShowSurvey] = useState(false);
  const { cm2 } = siteConfig;

  if (showSurvey) {
    return <SurveyFlow />;
  }

  const impactChips = impactNumbers.slice(0, IMPACT_CHIP_COUNT);

  return (
    <div className={styles.page}>
      <div className={styles.hero} style={{ backgroundImage: `url(${cm2.heroPhoto})` }}>
        <div className={styles.heroOverlay}>
          <Image src={cm2.logo} alt={cm2.orgName} width={76} height={76} className={styles.heroLogo} />
          <h1 className={styles.heroTitle}>{siteConfig.eventTitle}</h1>
          <p className={styles.heroTagline}>{siteConfig.tagline}</p>
        </div>
      </div>

      <div className={styles.impactStrip}>
        {impactChips.map((stat) => (
          <div key={stat.label} className={styles.impactChip}>
            <span className={styles.impactChipValue}>{stat.value}</span>
            <span className={styles.impactChipLabel}>{stat.label}</span>
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.actionCardPrimary} onClick={() => setShowSurvey(true)}>
          <span className={styles.actionEmoji} aria-hidden="true">📝</span>
          <span className={styles.actionTitle}>Take the 60-second survey</span>
          <span className={styles.actionBody}>
            Help shape Poughkeepsie&rsquo;s next community center, then share your cookout opinion on
            the big screen.
          </span>
          <span className={styles.actionCta}>Let&rsquo;s go →</span>
        </button>

        <Link href="/display" className={styles.actionCard}>
          <span className={styles.actionEmoji} aria-hidden="true">📺</span>
          <span className={styles.actionTitle}>Watch the Live Wall</span>
          <span className={styles.actionBody}>
            See photos, live opinions, CM2 impact stats, and Community Voice results — right on your
            phone.
          </span>
          <span className={styles.actionCta}>Open the wall →</span>
        </Link>
      </div>

      <footer className={styles.footer}>
        <p className={styles.footerMission}>&ldquo;{cm2.mission}&rdquo;</p>
        <div className={styles.socialRow}>
          <a href={cm2.social.facebook} target="_blank" rel="noopener noreferrer" className={styles.socialButton}>
            Facebook
          </a>
          <a href={cm2.social.instagram} target="_blank" rel="noopener noreferrer" className={styles.socialButton}>
            Instagram
          </a>
          <a href={cm2.social.tiktok} target="_blank" rel="noopener noreferrer" className={styles.socialButton}>
            TikTok
          </a>
        </div>
        <p className={styles.footerAddress}>{cm2.address}</p>
      </footer>
    </div>
  );
}
