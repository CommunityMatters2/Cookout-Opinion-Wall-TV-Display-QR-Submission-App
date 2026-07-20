import { impactNumbers } from "@/content/cm2Impact";
import CountUpValue from "@/app/display/CountUpValue";
import styles from "./display.module.css";

const COMPACT_COUNT = 6;

export default function ImpactDashboardScene({ compact = true }: { compact?: boolean }) {
  const items = compact ? impactNumbers.slice(0, COMPACT_COUNT) : impactNumbers;

  return (
    <div className={styles.sceneImpact}>
      <p className={styles.sceneKicker}>CM2 Impact By The Numbers</p>
      <div className={styles.impactGrid}>
        {items.map((stat) => (
          <div key={stat.label} className={styles.impactTile}>
            <CountUpValue value={stat.value} className={styles.impactValue} />
            <span className={styles.impactLabel}>{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
