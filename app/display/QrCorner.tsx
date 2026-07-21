"use client";

import { QRCodeSVG } from "qrcode.react";
import styles from "./display.module.css";

export default function QrCorner() {
  const submitUrl = process.env.NEXT_PUBLIC_SUBMIT_URL || "http://localhost:3000";

  return (
    <div className={styles.qrCorner} role="complementary" aria-label="Scan to join the survey and opinion wall">
      <div className={styles.qrBox}>
        <QRCodeSVG value={submitUrl} size={104} level="H" />
      </div>
      <span className={styles.qrNudge} aria-hidden="true">
        Scan me 👆
      </span>
    </div>
  );
}
