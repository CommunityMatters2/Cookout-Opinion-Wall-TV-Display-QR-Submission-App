"use client";

import { QRCodeSVG } from "qrcode.react";
import { siteConfig } from "@/config/site";
import styles from "./display.module.css";

export default function QrCornerDonate() {
  return (
    <div className={`${styles.qrCorner} ${styles.qrCornerDonate}`} role="complementary" aria-label="Scan to donate to CM2">
      <div className={styles.qrBox}>
        <QRCodeSVG value={siteConfig.cm2.donateUrl} size={104} level="H" />
      </div>
      <span className={styles.qrDonateLabel} aria-hidden="true">
        💛 Support Our Youth
      </span>
      <span className={`${styles.qrNudge} ${styles.qrNudgeDonate}`} aria-hidden="true">
        Scan to Donate
      </span>
    </div>
  );
}
