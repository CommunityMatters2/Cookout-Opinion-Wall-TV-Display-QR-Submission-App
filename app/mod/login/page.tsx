"use client";

import { useActionState } from "react";
import { loginAction, type LoginResult } from "@/lib/actions/modAuth";
import styles from "../mod.module.css";

const initialState: LoginResult = { ok: false };

export default function ModLoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <div className={styles.loginWrap}>
      <form action={formAction} className={styles.loginCard}>
        <p className={styles.title}>CM2 Moderator Login</p>
        <input
          type="password"
          name="password"
          placeholder="Password"
          className={styles.input}
          autoComplete="current-password"
          required
        />
        {state.error && <p className={styles.error}>{state.error}</p>}
        <button type="submit" className={styles.submit} disabled={pending}>
          {pending ? "Checking…" : "Log in"}
        </button>
      </form>
    </div>
  );
}
