"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./display.module.css";

const SLIDE_DURATION_MS = 8000;

// Fixed (not random) so the server-rendered HTML and the client's first hydration
// pass produce identical markup — Math.random() in a useState initializer would
// differ between the two and trigger a hydration mismatch.
const EMBERS = [
  { left: 6, duration: 13, delay: 0, drift: 24, size: 4 },
  { left: 16, duration: 16, delay: 2.4, drift: -18, size: 5 },
  { left: 27, duration: 11, delay: 5.1, drift: 30, size: 3 },
  { left: 38, duration: 15, delay: 1.2, drift: -26, size: 6 },
  { left: 48, duration: 12, delay: 7.8, drift: 20, size: 4 },
  { left: 58, duration: 17, delay: 3.6, drift: -34, size: 5 },
  { left: 67, duration: 10, delay: 9.4, drift: 16, size: 3 },
  { left: 74, duration: 14, delay: 0.6, drift: -22, size: 6 },
  { left: 83, duration: 13, delay: 6.2, drift: 28, size: 4 },
  { left: 91, duration: 16, delay: 4.4, drift: -30, size: 5 },
  { left: 95, duration: 11, delay: 8.6, drift: 14, size: 3 },
  { left: 12, duration: 18, delay: 10.5, drift: -16, size: 6 },
];

function EmberField() {
  return (
    <div className={styles.embers} aria-hidden="true">
      {EMBERS.map((e, i) => (
        <span
          key={i}
          className={styles.ember}
          style={
            {
              left: `${e.left}%`,
              width: e.size,
              height: e.size,
              animationDuration: `${e.duration}s`,
              animationDelay: `${e.delay}s`,
              "--drift": `${e.drift}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

export default function DisplayBackground({ photos, dimmed = false }: { photos: string[]; dimmed?: boolean }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (photos.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % photos.length), SLIDE_DURATION_MS);
    return () => clearInterval(id);
  }, [photos.length]);

  const visibleWindow = new Set<number>();
  if (photos.length > 0) {
    visibleWindow.add(index);
    visibleWindow.add((index + 1) % photos.length);
    visibleWindow.add((index - 1 + photos.length) % photos.length);
  }

  return (
    <>
      <div className={styles.bgLayer}>
        {photos.length === 0 && <div className={styles.bgEmpty} />}
        {photos.map((src, i) => {
          if (!visibleWindow.has(i)) return null;
          const isActive = i === index;
          return (
            <div key={src} className={`${styles.bgSlide} ${isActive ? styles.bgSlideActive : ""}`}>
              <Image
                src={src}
                alt=""
                fill
                priority={isActive}
                sizes="100vw"
                className={styles.bgSlideImg}
              />
            </div>
          );
        })}
      </div>
      <div className={`${styles.bgOverlay} ${dimmed ? styles.bgOverlayDimmed : ""}`} />
      <div className={styles.grainOverlay} />
      <EmberField />
    </>
  );
}
