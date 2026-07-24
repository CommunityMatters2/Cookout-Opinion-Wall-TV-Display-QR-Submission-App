"use client";

import { useState } from "react";
import { approveMessage, rejectMessage } from "@/lib/actions/moderation";
import type { Message } from "@/types/message";
import styles from "./mod.module.css";

export default function ModerationQueue({
  initialPending,
  initialApproved,
}: {
  initialPending: Message[];
  initialApproved: Message[];
}) {
  const [pending, setPending] = useState(initialPending);
  const [approved, setApproved] = useState(initialApproved);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleApprove(id: string) {
    setBusyId(id);
    const result = await approveMessage(id);
    if (result.ok) {
      const message = pending.find((m) => m.id === id);
      setPending((prev) => prev.filter((m) => m.id !== id));
      if (message) setApproved((prev) => [{ ...message, status: "approved" }, ...prev]);
    }
    setBusyId(null);
  }

  async function handleReject(id: string, fromApproved: boolean) {
    setBusyId(id);
    const result = await rejectMessage(id);
    if (result.ok) {
      if (fromApproved) setApproved((prev) => prev.filter((m) => m.id !== id));
      else setPending((prev) => prev.filter((m) => m.id !== id));
    }
    setBusyId(null);
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <p className={styles.headerTitle}>Moderation Queue</p>
      </div>

      <section className={styles.section}>
        <p className={styles.sectionTitle}>Pending review ({pending.length})</p>
        {pending.length === 0 ? (
          <p className={styles.empty}>Nothing flagged right now.</p>
        ) : (
          pending.map((m) => (
            <div key={m.id} className={styles.row}>
              <div className={styles.rowBody}>
                <p className={styles.rowName}>{m.name}</p>
                <p className={styles.rowMessage}>{m.message}</p>
              </div>
              <div className={styles.rowActions}>
                <button
                  type="button"
                  className={styles.approveButton}
                  disabled={busyId === m.id}
                  onClick={() => handleApprove(m.id)}
                >
                  Approve
                </button>
                <button
                  type="button"
                  className={styles.rejectButton}
                  disabled={busyId === m.id}
                  onClick={() => handleReject(m.id, false)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      <section className={styles.section}>
        <p className={styles.sectionTitle}>Live on the wall ({approved.length})</p>
        {approved.length === 0 ? (
          <p className={styles.empty}>Nothing posted yet.</p>
        ) : (
          approved.map((m) => (
            <div key={m.id} className={styles.row}>
              <div className={styles.rowBody}>
                <p className={styles.rowName}>{m.name}</p>
                <p className={styles.rowMessage}>{m.message}</p>
              </div>
              <div className={styles.rowActions}>
                <button
                  type="button"
                  className={styles.rejectButton}
                  disabled={busyId === m.id}
                  onClick={() => handleReject(m.id, true)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
