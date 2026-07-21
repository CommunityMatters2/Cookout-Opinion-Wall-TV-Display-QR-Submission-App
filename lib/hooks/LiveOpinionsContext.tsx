"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Message } from "@/types/message";
import { useLiveOpinions } from "@/lib/hooks/useLiveOpinions";

type LiveOpinionsValue = {
  messages: Message[];
  incomingMessage: Message | null;
  consumeIncoming: () => void;
};

const LiveOpinionsContext = createContext<LiveOpinionsValue | null>(null);

// Mobile has nested routes (/wall, /wall/[widget]) that all need the same live
// feed, so the Supabase subscription is opened once here at the layout level
// instead of once per page.
export function LiveOpinionsProvider({
  initialMessages,
  children,
}: {
  initialMessages: Message[];
  children: ReactNode;
}) {
  const value = useLiveOpinions(initialMessages);
  return <LiveOpinionsContext.Provider value={value}>{children}</LiveOpinionsContext.Provider>;
}

export function useLiveOpinionsContext(): LiveOpinionsValue {
  const ctx = useContext(LiveOpinionsContext);
  if (!ctx) throw new Error("useLiveOpinionsContext must be used within a LiveOpinionsProvider");
  return ctx;
}
