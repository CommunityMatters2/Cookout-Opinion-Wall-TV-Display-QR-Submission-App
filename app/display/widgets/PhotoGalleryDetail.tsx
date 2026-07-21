"use client";

import Image from "next/image";
import { usePhotos } from "@/lib/hooks/usePhotos";
import { missionStatement } from "@/content/cm2Impact";
import shared from "@/app/display/display.module.css";
import styles from "./widgets.module.css";

export default function PhotoGalleryDetail() {
  const photos = usePhotos();

  return (
    <div className={styles.galleryRoot}>
      <div className={styles.headerBlockGallery}>
        <p className={shared.kicker}>Photo Moments</p>
        <h1 className={shared.headline}>Tonight at CM2</h1>
      </div>
      <div className={styles.galleryGrid}>
        {photos.map((src) => (
          <div key={src} className={styles.galleryTile}>
            <Image src={src} alt="" fill sizes="220px" className={styles.galleryTileImg} />
          </div>
        ))}
        {photos.length === 0 && <p className={styles.summaryLabel}>Photos coming soon</p>}
      </div>
      <p className={styles.galleryMission}>{missionStatement}</p>
    </div>
  );
}
