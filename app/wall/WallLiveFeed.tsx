"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLiveOpinionsContext } from "@/lib/hooks/LiveOpinionsContext";
import { usePullToRefresh } from "@/app/wall/usePullToRefresh";
import styles from "./wall.module.css";

const FEED_LIMIT = 30;

export default function WallLiveFeed() {
  const { messages } = useLiveOpinionsContext();
  const searchParams = useSearchParams();
  const highlightId = searchParams.get("highlight");
  const router = useRouter();
  const { refreshing } = usePullToRefresh(() => router.refresh());

  const visible = messages.slice(0, FEED_LIMIT);

  return (
    <section className={styles.liveFeedSection} aria-label="Live cookout opinions">
      <div className={styles.liveFeedHeader}>
        <span className={styles.liveFeedBadge}>
          <span className={styles.liveFeedDot} aria-hidden="true" />
          LIVE
        </span>
        <h2 className={styles.liveFeedTitle}>Cookout Opinions</h2>
      </div>

      {refreshing && <p className={styles.pullRefreshIndicator}>Refreshing…</p>}

      {visible.length === 0 ? (
        <p className={styles.liveFeedEmpty}>Waiting for the first opinion&hellip; 👀</p>
      ) : (
        <ul className={styles.liveFeedList}>
          <AnimatePresence initial={false}>
            {visible.map((m) => {
              const isHighlighted = m.id === highlightId;
              return (
                <motion.li
                  key={m.id}
                  className={`${styles.feedBubble} ${isHighlighted ? styles.feedBubbleHighlighted : ""}`}
                  initial={{ opacity: 0, scale: 0.9, y: -12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                >
                  {isHighlighted && <span className={styles.feedYouBanner}>You&rsquo;re on the wall! 🎉</span>}
                  <p className={styles.feedBubbleName}>{m.name}</p>
                  <p className={styles.feedBubbleMessage}>{m.message}</p>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}
    </section>
  );
}
