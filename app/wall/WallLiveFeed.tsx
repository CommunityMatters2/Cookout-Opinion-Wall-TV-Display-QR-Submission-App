"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLiveOpinionsContext } from "@/lib/hooks/LiveOpinionsContext";
import { usePullToRefresh } from "@/app/wall/usePullToRefresh";
import type { Message } from "@/types/message";
import ReactionBar from "./ReactionBar";
import styles from "./wall.module.css";

const FEED_LIMIT = 30;
const HIGHLIGHT_MS = 5000;
const DRAFT_KEY = "cm2_optimistic_message";

export default function WallLiveFeed() {
  const { messages } = useLiveOpinionsContext();
  const searchParams = useSearchParams();
  const highlightId = searchParams.get("highlight");
  const router = useRouter();
  const { refreshing } = usePullToRefresh(() => router.refresh());

  const [draft, setDraft] = useState<Message | null>(null);
  const [activeHighlightId, setActiveHighlightId] = useState<string | null>(null);
  const itemRefs = useRef(new Map<string, HTMLLIElement>());

  // The survey flow stashes the just-submitted message here before redirecting,
  // so it renders immediately even if realtime/the initial fetch hasn't caught
  // up yet. Dropped below once the real row shows up in `messages`.
  useEffect(() => {
    function loadDraft() {
      if (typeof window === "undefined") return;
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      try {
        setDraft(JSON.parse(raw) as Message);
      } catch {
        sessionStorage.removeItem(DRAFT_KEY);
      }
    }
    loadDraft();
  }, []);

  useEffect(() => {
    function reconcileDraft() {
      if (!draft) return;
      if (messages.some((m) => m.id === draft.id)) {
        setDraft(null);
        sessionStorage.removeItem(DRAFT_KEY);
      }
    }
    reconcileDraft();
  }, [draft, messages]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    function activateHighlight() {
      if (!highlightId) return;
      setActiveHighlightId(highlightId);
      timeoutId = setTimeout(() => setActiveHighlightId(null), HIGHLIGHT_MS);
    }
    activateHighlight();

    return () => clearTimeout(timeoutId);
  }, [highlightId]);

  useEffect(() => {
    if (!highlightId) return;
    itemRefs.current.get(highlightId)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [highlightId, draft, messages]);

  const showDraft = draft && !messages.some((m) => m.id === draft.id);
  const visible = (showDraft ? [draft as Message, ...messages] : messages).slice(0, FEED_LIMIT);

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
              const isHighlighted = m.id === activeHighlightId;
              const isPending = showDraft && m.id === draft?.id;
              return (
                <motion.li
                  key={m.id}
                  id={`msg-${m.id}`}
                  ref={(el) => {
                    if (el) itemRefs.current.set(m.id, el);
                    else itemRefs.current.delete(m.id);
                  }}
                  className={`${styles.feedBubble} ${isHighlighted ? styles.feedBubbleHighlighted : ""}`}
                  initial={{ opacity: 0, scale: 0.9, y: -12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                >
                  {isHighlighted && <span className={styles.feedYouBanner}>You&rsquo;re on the wall! 🎉</span>}
                  {isPending && !isHighlighted && <span className={styles.feedPendingBadge}>Posting&hellip;</span>}
                  <p className={styles.feedBubbleName}>{m.name}</p>
                  <p className={styles.feedBubbleMessage}>{m.message}</p>
                  {!isPending && <ReactionBar messageId={m.id} />}
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}
    </section>
  );
}
