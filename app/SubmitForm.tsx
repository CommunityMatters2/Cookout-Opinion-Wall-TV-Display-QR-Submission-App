"use client";

import { useActionState, useRef } from "react";
import { submitMessage, type SubmitResult } from "@/app/actions";
import { siteConfig } from "@/config/site";
import styles from "./SubmitForm.module.css";

const initialState: SubmitResult = { ok: false };

export default function SubmitForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(
    async (prevState: SubmitResult, formData: FormData) => {
      const result = await submitMessage(prevState, formData);
      if (result.ok) {
        formRef.current?.reset();
      }
      return result;
    },
    initialState
  );

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>{siteConfig.eventTitle}</h1>
        <p className={styles.tagline}>{siteConfig.tagline}</p>

        <form ref={formRef} action={formAction} className={styles.form}>
          <div>
            <label className={styles.label} htmlFor="name">
              Your name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className={styles.input}
              maxLength={siteConfig.maxNameLength}
              placeholder="Jordan"
              autoComplete="name"
              required
            />
          </div>

          <div>
            <label className={styles.label} htmlFor="message">
              Your message
            </label>
            <textarea
              id="message"
              name="message"
              className={styles.textarea}
              maxLength={siteConfig.maxMessageLength}
              placeholder="What's on your mind?"
              required
            />
          </div>

          {state.error && <p className={styles.error}>{state.error}</p>}
          {state.ok && (
            <p className={styles.success}>{siteConfig.confirmationMessage}</p>
          )}

          <button type="submit" className={styles.submitButton} disabled={isPending}>
            {isPending ? "Sending…" : "Post it"}
          </button>
        </form>
      </div>
    </div>
  );
}
