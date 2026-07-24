"use client";

import { useState } from "react";
import { submitMessage, type SubmitResult } from "@/app/actions";

const RETRY_DELAYS_MS = [0, 1500, 4000];

// Server Actions are callable as plain async functions outside <form action>,
// so this wraps submitMessage directly rather than moving to a fetch-based
// endpoint — retries only cover thrown/network errors (a dropped connection
// mid-request), never a validation ok:false, since retrying a blocked-word
// rejection or a "please enter a message" error is pointless.
export function useSubmitWithRetry() {
  const [pending, setPending] = useState(false);

  async function submitWithRetry(name: string, message: string): Promise<SubmitResult> {
    setPending(true);
    const formData = new FormData();
    formData.set("name", name);
    formData.set("message", message);

    let lastResult: SubmitResult = { ok: false, error: "Something went wrong, please try again." };

    for (let attempt = 0; attempt < RETRY_DELAYS_MS.length; attempt++) {
      if (RETRY_DELAYS_MS[attempt] > 0) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS_MS[attempt]));
      }
      try {
        const result = await submitMessage({ ok: false }, formData);
        setPending(false);
        return result;
      } catch {
        lastResult = { ok: false, error: "Couldn't reach the server — check your connection and try again." };
      }
    }

    setPending(false);
    return lastResult;
  }

  return { submitWithRetry, pending };
}
