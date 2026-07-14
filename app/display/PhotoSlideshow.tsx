"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import styles from "./display.module.css";

const SLIDE_DURATION_MS = 6500;

export default function PhotoSlideshow({ photos }: { photos: string[] }) {
  const [index, setIndex] = useState(0);
  const { cm2 } = siteConfig;

  useEffect(() => {
    if (photos.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % photos.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(id);
  }, [photos.length]);

  return (
    <div className={styles.slideshow}>
      {photos.map((src, i) => (
        <div
          key={src}
          className={`${styles.slide} ${i === index ? styles.slideActive : ""}`}
          style={{ backgroundImage: `url(${src})` }}
        />
      ))}

      {photos.length === 0 && (
        <p className={styles.slideshowEmpty}>Add photos to &ldquo;public/cm2 pictures&rdquo; to show a slideshow here.</p>
      )}

      {photos.length > 1 && (
        <div className={styles.slideProgressTrack}>
          <div
            key={index}
            className={styles.slideProgressFill}
            style={{ animationDuration: `${SLIDE_DURATION_MS}ms` }}
          />
        </div>
      )}

      <div className={styles.slideshowCaption}>
        <Image src={cm2.logo} alt={cm2.orgName} width={28} height={28} className={styles.slideshowCaptionLogo} />
        <span>{cm2.orgName} · Poughkeepsie, NY</span>
      </div>
    </div>
  );
}
