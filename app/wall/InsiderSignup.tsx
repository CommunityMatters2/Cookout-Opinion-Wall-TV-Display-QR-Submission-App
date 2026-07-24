"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { createAccount, linkMessageToAccount } from "@/lib/actions/accounts";
import defaultStyles from "./wall.module.css";

const ACCOUNT_KEY = "cm2_account_id";
const DRAFT_KEY = "cm2_optimistic_message";

export type InsiderFormStyles = Record<string, string>;

// Styles are injectable (default: the dark /wall theme) so the same signup
// logic can be reused with the light survey theme (see app/SurveyFlow.tsx)
// without duplicating the form.
export default function InsiderSignup({
  onSignedUp,
  styles = defaultStyles,
}: {
  onSignedUp: (accountId: string) => void;
  styles?: InsiderFormStyles;
}) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(undefined);

    const formData = new FormData();
    formData.set("name", name);
    formData.set("contact", contact);
    const result = await createAccount(formData);
    setPending(false);

    if (!result.ok || !result.id) {
      setError(result.error ?? "Something went wrong, please try again.");
      return;
    }

    localStorage.setItem(ACCOUNT_KEY, result.id);

    // Claim a just-submitted message if one is still sitting unlinked —
    // most people sign up right after posting their first opinion.
    const draftRaw = sessionStorage.getItem(DRAFT_KEY);
    if (draftRaw) {
      try {
        const draft = JSON.parse(draftRaw) as { id: string };
        await linkMessageToAccount(draft.id, result.id);
      } catch {
        // Non-critical — the account still works without the claim.
      }
    }

    onSignedUp(result.id);
  }

  return (
    <form className={styles.insiderForm} onSubmit={handleSubmit}>
      <input
        className={styles.insiderInput}
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={60}
        autoComplete="name"
        required
      />
      <input
        className={styles.insiderInput}
        type="text"
        placeholder="Email or phone"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        autoComplete="email"
        required
      />
      {error && <p className={styles.insiderError}>{error}</p>}
      <motion.button type="submit" className={styles.insiderSubmit} disabled={pending} whileTap={{ scale: 0.97 }}>
        {pending ? "Joining…" : "Join as an Insider 💛"}
      </motion.button>
    </form>
  );
}
