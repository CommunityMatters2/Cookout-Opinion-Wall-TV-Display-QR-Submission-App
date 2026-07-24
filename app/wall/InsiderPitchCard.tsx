"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { insiderBenefits } from "@/lib/insiderBenefits";
import InsiderSignup, { type InsiderFormStyles } from "./InsiderSignup";
import defaultStyles from "./wall.module.css";

const ACCOUNT_KEY = "cm2_account_id";

export type InsiderCardStyles = InsiderFormStyles;

// Styles are injectable (default: the dark /wall theme) — also used on the
// light survey "thanks" screen (app/SurveyFlow.tsx) with its own tokens, so
// signing up doesn't require ever leaving the survey flow.
export default function InsiderPitchCard({ styles = defaultStyles }: { styles?: InsiderCardStyles } = {}) {
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
      <InsiderSignup onSignedUp={() => setJustSignedUp(true)} styles={styles} />
    </div>
  );
}
