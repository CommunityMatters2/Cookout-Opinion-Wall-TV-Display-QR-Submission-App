"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { insiderBenefits } from "@/lib/insiderBenefits";
import InsiderSignup from "./InsiderSignup";
import styles from "./wall.module.css";

const ACCOUNT_KEY = "cm2_account_id";

// Lives on /wall home, never in the submit flow, so it can never gate the
// automatic post-submit redirect (see app/SurveyFlow.tsx).
export default function InsiderPitchCard() {
  const [hasAccount, setHasAccount] = useState<boolean | null>(null);
  const [justSignedUp, setJustSignedUp] = useState(false);

  useEffect(() => {
    function loadAccountFlag() {
      setHasAccount(!!localStorage.getItem(ACCOUNT_KEY));
    }
    loadAccountFlag();
  }, []);

  if (hasAccount === null) return null; // avoid a signup-card flash before localStorage is read

  if (hasAccount || justSignedUp) {
    if (!justSignedUp) return null;
    return (
      <div className={styles.insiderCard}>
        <p className={styles.insiderWelcome}>Welcome to the CM2 family! 💛</p>
        <Link href="/account" className={styles.insiderAccountLink}>
          View your Insider account →
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.insiderCard}>
      <p className={styles.insiderTitle}>Become a CM2 Insider 💛</p>
      <ul className={styles.insiderBenefits}>
        {insiderBenefits.map(({ icon: Icon, text }) => (
          <li key={text}>
            <Icon size={16} /> {text}
          </li>
        ))}
      </ul>
      <InsiderSignup onSignedUp={() => setJustSignedUp(true)} />
    </div>
  );
}
