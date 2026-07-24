"use client";

import { motion } from "framer-motion";
import { useReactionsContext } from "@/lib/hooks/ReactionsContext";
import styles from "./wall.module.css";

const EMOJIS = ["🔥", "❤️", "👏", "😂"];

export default function ReactionBar({ messageId }: { messageId: string }) {
  const { react } = useReactionsContext();

  return (
    <div className={styles.reactionBar} aria-label="React to this opinion">
      {EMOJIS.map((emoji) => (
        <motion.button
          key={emoji}
          type="button"
          className={styles.reactionButton}
          whileTap={{ scale: 0.75 }}
          onClick={() => react(messageId, emoji)}
        >
          {emoji}
        </motion.button>
      ))}
    </div>
  );
}
