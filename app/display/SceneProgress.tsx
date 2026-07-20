import styles from "./display.module.css";

export default function SceneProgress({
  count,
  activeIndex,
  showingLive,
}: {
  count: number;
  activeIndex: number;
  showingLive: boolean;
}) {
  return (
    <div className={styles.sceneProgress} role="tablist" aria-label="Scene rotation progress">
      {Array.from({ length: count }).map((_, i) => {
        const isActive = i === activeIndex;
        return (
          <span
            key={i}
            role="tab"
            aria-selected={isActive}
            className={`${styles.progressDot} ${isActive ? styles.progressDotActive : ""} ${
              isActive && showingLive ? styles.progressDotLive : ""
            }`}
          />
        );
      })}
    </div>
  );
}
