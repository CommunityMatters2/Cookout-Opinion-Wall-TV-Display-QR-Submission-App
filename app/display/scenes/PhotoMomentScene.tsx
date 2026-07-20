import Image from "next/image";
import { photoMomentCaption } from "@/content/cm2Impact";
import { siteConfig } from "@/config/site";
import styles from "./scenes.module.css";

export default function PhotoMomentScene() {
  const { cm2 } = siteConfig;
  return (
    <div className={styles.photoCaptionChip}>
      <Image src={cm2.logo} alt={cm2.orgName} width={26} height={26} style={{ borderRadius: "50%" }} />
      <span>{photoMomentCaption}</span>
    </div>
  );
}
