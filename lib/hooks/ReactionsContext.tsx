"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useReactionBroadcast } from "@/lib/hooks/useReactionBroadcast";

type ReactionsValue = { react: (messageId: string, emoji: string) => void };

const ReactionsContext = createContext<ReactionsValue | null>(null);

// One shared broadcast channel for the whole /wall subtree, instead of one
// per rendered opinion card — mirrors LiveOpinionsContext's pattern for the
// same reason (avoid a subscription-per-list-item explosion).
export function ReactionsProvider({ children }: { children: ReactNode }) {
  const { react } = useReactionBroadcast();
  return <ReactionsContext.Provider value={{ react }}>{children}</ReactionsContext.Provider>;
}

export function useReactionsContext(): ReactionsValue {
  const ctx = useContext(ReactionsContext);
  if (!ctx) throw new Error("useReactionsContext must be used within a ReactionsProvider");
  return ctx;
}
