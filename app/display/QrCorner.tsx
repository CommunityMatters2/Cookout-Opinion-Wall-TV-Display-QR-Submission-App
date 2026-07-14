"use client";

import { QRCodeSVG } from "qrcode.react";
import styles from "./display.module.css";

export default function QrCorner() {
  const submitUrl = process.env.NEXT_PUBLIC_SUBMIT_URL || "http://localhost:3000";

  return (
    <div className={styles.qrCorner}>
      <div className={styles.qrBox}>
        <QRCodeSVG value={submitUrl} size={120} />
      </div>
      <p className={styles.qrLabel}>Scan to join in — answer a few questions &amp; share your opinion!</p>
    </div>
  );
}
