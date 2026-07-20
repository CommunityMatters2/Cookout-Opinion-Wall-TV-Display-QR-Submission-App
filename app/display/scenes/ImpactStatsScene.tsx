import {
  Users,
  UtensilsCrossed,
  Briefcase,
  Handshake,
  Sparkles,
  HeartHandshake,
  Recycle,
  GraduationCap,
  Clock,
  Droplet,
  Cpu,
  CalendarDays,
  type LucideIcon,
} from "lucide-react";
import type { ImpactNumber } from "@/content/cm2Impact";
import CountUp from "@/app/display/CountUp";
import shared from "../display.module.css";
import styles from "./scenes.module.css";

function iconFor(label: string): LucideIcon {
  const l = label.toLowerCase();
  if (l.includes("youth served")) return Users;
  if (l.includes("meals")) return UtensilsCrossed;
  if (l.includes("employment invested")) return Briefcase;
  if (l.includes("partnership")) return Handshake;
  if (l.includes("cleanups") || l.includes("city-wide")) return Sparkles;
  if (l.includes("volunteer")) return HeartHandshake;
  if (l.includes("trash")) return Recycle;
  if (l.includes("programs developed")) return GraduationCap;
  if (l.includes("service hours")) return Clock;
  if (l.includes("workforce")) return Briefcase;
  if (l.includes("water bottles")) return Droplet;
  if (l.includes("technical") || l.includes(" ai ")) return Cpu;
  if (l.includes("years of impact")) return CalendarDays;
  return Sparkles;
}

export default function ImpactStatsScene({ stats }: { stats: ImpactNumber[] }) {
  return (
    <div className={styles.sceneRoot}>
      <div className={styles.headerBlock}>
        <p className={shared.kicker}>CM2 Impact</p>
        <h1 className={shared.headline}>By The Numbers</h1>
      </div>
      <div className={styles.impactGrid}>
        {stats.map((stat, i) => {
          const Icon = iconFor(stat.label);
          return (
            <div key={stat.label} className={`${shared.glassPanel} ${styles.impactCard}`}>
              <div className={styles.impactIcon}>
                <Icon size={26} strokeWidth={2} />
              </div>
              <CountUp value={stat.value} className={styles.impactValue} delayMs={i * 120} />
              <span className={styles.impactLabel}>{stat.label}</span>
              {stat.detail && <span className={styles.impactDetail}>{stat.detail}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
