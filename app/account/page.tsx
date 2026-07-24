"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { getMyAccount } from "@/lib/actions/accounts";
import { insiderBenefits } from "@/lib/insiderBenefits";
import DonateButton from "@/app/wall/DonateButton";
import ShareCTA from "@/app/wall/ShareCTA";
import type { Account } from "@/types/account";
import type { Message } from "@/types/message";
import styles from "./account.module.css";

const ACCOUNT_KEY = "cm2_account_id";

export default function AccountPage() {
  const [status, setStatus] = useState<"loading" | "none" | "ready">("loading");
  const [account, setAccount] = useState<Account | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    function loadAccount() {
      const accountId = localStorage.getItem(ACCOUNT_KEY);
      if (!accountId) {
        setStatus("none");
        return;
      }
      getMyAccount(accountId).then((result) => {
        if (!result) {
          setStatus("none");
          return;
        }
        setAccount(result.account);
        setMessages(result.messages);
        setStatus("ready");
      });
    }
    loadAccount();
  }, []);

  if (status === "loading") {
    return (
      <div className={styles.page}>
        <p className={styles.loading}>Loading your account&hellip;</p>
      </div>
    );
  }

  if (status === "none" || !account) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <p className={styles.title}>No CM2 Insider account yet</p>
          <p className={styles.body}>Sign up from the Live Wall to join — it only takes a few seconds.</p>
        </div>
        <Link href="/wall" className={styles.backLink}>
          ← Back to the Live Wall
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <p className={styles.welcome}>Welcome to the CM2 family, {account.name}! 💛</p>
        {account.featured && (
          <span className={styles.featuredBadge}>
            <Star size={14} /> Featured on the wall
          </span>
        )}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Your opinions</h2>
          {messages.length === 0 ? (
            <p className={styles.body}>You haven&rsquo;t posted an opinion yet.</p>
          ) : (
            <ul className={styles.opinionList}>
              {messages.map((m) => (
                <li key={m.id} className={styles.opinionItem}>
                  <p className={styles.opinionText}>{m.message}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Why this account?</h2>
          <ul className={styles.benefitList}>
            {insiderBenefits.map(({ icon: Icon, text }) => (
              <li key={text}>
                <Icon size={16} /> {text}
              </li>
            ))}
          </ul>
        </section>

        <DonateButton />
      </div>

      <ShareCTA />

      <Link href="/wall" className={styles.backLink}>
        ← Back to the Live Wall
      </Link>
    </div>
  );
}
