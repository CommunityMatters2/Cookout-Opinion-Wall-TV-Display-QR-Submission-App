"use client";

import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { useLiveOpinionsContext } from "@/lib/hooks/LiveOpinionsContext";
import DonateButton from "@/app/wall/DonateButton";
import styles from "./wall.module.css";

export default function WallTopBar() {
  const { messages } = useLiveOpinionsContext();
  const { cm2 } = siteConfig;

  return (
    <header className={styles.topBar}>
      <Link href="/wall" className={styles.topBarBrand}>
        <Image src={cm2.logo} alt={cm2.orgName} width={30} height={30} className={styles.topBarLogo} />
      </Link>
      <span className={styles.topBarLive}>
        <span className={styles.topBarLiveDot} aria-hidden="true" />
        LIVE <strong>{messages.length}</strong>
      </span>
      <Link href="/" className={styles.postAnotherLink}>
        + Post an opinion
      </Link>
      <DonateButton compact />
    </header>
  );
}
