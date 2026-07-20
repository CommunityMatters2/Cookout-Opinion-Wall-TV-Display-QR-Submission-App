import { summerCamp } from "@/content/cm2Impact";
import CountUp from "@/app/display/CountUp";
import shared from "../display.module.css";
import styles from "./scenes.module.css";

export default function SummerCampScene() {
  const cadenceBadges = summerCamp.cadence.split(" · ");

  return (
    <div className={styles.sceneRoot}>
      <div className={styles.headerBlock}>
        <p className={shared.kicker}>Extraordinary Youth Summer Camp</p>
        <h1 className={shared.headline}>By The Numbers</h1>
      </div>

      <div className={styles.campCadenceRow}>
        {cadenceBadges.map((badge) => (
          <span key={badge} className={styles.campCadenceBadge}>
            {badge}
          </span>
        ))}
      </div>

      <div className={styles.campGrid}>
        {summerCamp.stats.map((stat, i) => (
          <div key={stat.label} className={`${shared.glassPanel} ${styles.campTile}`}>
            <CountUp value={stat.value} className={styles.campValue} delayMs={i * 70} />
            <span className={styles.campLabel}>{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
