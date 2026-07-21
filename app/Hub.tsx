"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { FileText, Tv, ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { impactNumbers } from "@/content/cm2Impact";
import CountUp from "@/app/display/CountUp";
import SurveyFlow from "@/app/SurveyFlow";
import styles from "./Hub.module.css";

const IMPACT_CHIP_COUNT = 4;

function ImpactChip({ stat }: { stat: { value: string; label: string } }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  return (
    <div ref={ref} className={styles.impactChip}>
      {inView ? (
        <CountUp value={stat.value} className={styles.impactChipValue} />
      ) : (
        <span className={styles.impactChipValue}>&nbsp;</span>
      )}
      <span className={styles.impactChipLabel}>{stat.label}</span>
    </div>
  );
}

export default function Hub() {
  const [showSurvey, setShowSurvey] = useState(false);
  const { cm2 } = siteConfig;
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.18]);

  if (showSurvey) {
    return <SurveyFlow />;
  }

  const impactChips = impactNumbers.slice(0, IMPACT_CHIP_COUNT);

  return (
    <div className={styles.page}>
      <div className={styles.ambientGlow} aria-hidden="true" />

      <div ref={heroRef} className={styles.hero}>
        <motion.div
          className={styles.heroImageWrap}
          style={{ y: heroY, scale: heroScale }}
        >
          <Image src={cm2.heroPhoto} alt="" fill priority sizes="100vw" className={styles.heroImage} />
        </motion.div>
        <div className={styles.heroOverlay}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={styles.heroContent}
          >
            <Image src={cm2.logo} alt={cm2.orgName} width={76} height={76} className={styles.heroLogo} />
            <h1 className={styles.heroTitle}>{siteConfig.eventTitle}</h1>
            <p className={styles.heroTagline}>{siteConfig.tagline}</p>
          </motion.div>
        </div>
      </div>

      <div className={styles.impactStrip}>
        {impactChips.map((stat) => (
          <ImpactChip key={stat.label} stat={stat} />
        ))}
      </div>

      <div className={styles.actions}>
        <motion.button
          type="button"
          className={styles.actionCardPrimary}
          onClick={() => setShowSurvey(true)}
          whileTap={{ scale: 0.97 }}
        >
          <span className={styles.sheen} aria-hidden="true" />
          <span className={styles.actionIcon}>
            <FileText size={26} strokeWidth={2} />
          </span>
          <span className={styles.actionTitle}>Take the 60-second survey</span>
          <span className={styles.actionBody}>
            Help shape Poughkeepsie&rsquo;s next community center, then share your cookout opinion on
            the big screen.
          </span>
          <span className={styles.actionCta}>
            Let&rsquo;s go <ArrowRight size={16} className={styles.ctaArrow} />
          </span>
        </motion.button>

        <Link href="/wall" className={styles.actionCard}>
          <span className={styles.actionIcon}>
            <Tv size={26} strokeWidth={2} />
          </span>
          <span className={styles.actionTitle}>Watch the Live Wall</span>
          <span className={styles.actionBody}>
            See photos, live opinions, CM2 impact stats, and Community Voice results — right on your
            phone.
          </span>
          <span className={styles.actionCta}>
            Open the wall <ArrowRight size={16} className={styles.ctaArrow} />
          </span>
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
