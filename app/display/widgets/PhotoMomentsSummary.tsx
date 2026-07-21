"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePhotos } from "@/lib/hooks/usePhotos";
import styles from "./widgets.module.css";

const CYCLE_MS = 6000;

export default function PhotoMomentsSummary() {
  const photos = usePhotos();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (photos.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % photos.length), CYCLE_MS);
    return () => clearInterval(id);
  }, [photos.length]);

  return (
    <div className={styles.photoThumbWrap}>
      {photos.length > 0 ? (
        <Image src={photos[index]} alt="" fill sizes="240px" className={styles.photoThumbImg} />
      ) : (
        <span className={styles.summaryLabel}>Photos coming soon</span>
      )}
      <span className={styles.photoThumbLabel}>Photo Moments</span>
    </div>
  );
}
