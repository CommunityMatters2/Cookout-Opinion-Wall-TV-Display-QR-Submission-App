import { programs2026, signaturePrograms } from "@/content/cm2Impact";
import styles from "./display.module.css";

export default function ProgramsSpotlightScene() {
  return (
    <div className={styles.scenePrograms}>
      <p className={styles.sceneKicker}>2026 Programs Expand</p>
      <ul className={styles.programList}>
        {programs2026.map((program) => (
          <li key={program.name} className={styles.programItem}>
            <span className={styles.programName}>{program.name}</span>
            {program.ageRange && <span className={styles.programAge}>{program.ageRange}</span>}
          </li>
        ))}
      </ul>
      <p className={styles.sceneKickerSecondary}>6 Core Programs</p>
      <div className={styles.programChipRow}>
        {signaturePrograms.map((program) => (
          <span key={program.name} className={styles.programChip}>
            {program.name}
          </span>
        ))}
      </div>
    </div>
  );
}
