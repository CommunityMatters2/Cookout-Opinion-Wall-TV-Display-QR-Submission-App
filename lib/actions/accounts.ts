"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Account } from "@/types/account";
import type { Message } from "@/types/message";

export type CreateAccountResult = { ok: boolean; error?: string; id?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s()+-]{7,20}$/;

// No email/SMS verification by design — this is a lightweight community perk,
// not a security boundary, so we skip the friction (and the need for an
// external email provider) of a real magic-link flow.
export async function createAccount(formData: FormData): Promise<CreateAccountResult> {
  const name = String(formData.get("name") ?? "").trim();
  const contact = String(formData.get("contact") ?? "").trim();

  if (!name) return { ok: false, error: "Please enter your name." };
  if (!contact) return { ok: false, error: "Please enter an email or phone number." };

  const contactType = EMAIL_RE.test(contact) ? "email" : PHONE_RE.test(contact) ? "phone" : null;
  if (!contactType) return { ok: false, error: "That doesn't look like a valid email or phone number." };
  if (name.length > 60) return { ok: false, error: "Name is too long." };

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("accounts")
    .insert({ name, contact, contact_type: contactType })
    .select("id")
    .single();

  if (error || !data) return { ok: false, error: "Something went wrong, please try again." };

  return { ok: true, id: data.id };
}

export async function getMyAccount(
  accountId: string
): Promise<{ account: Account; messages: Message[] } | null> {
  const supabase = createServerSupabaseClient();
  const { data: account, error: accountError } = await supabase
    .from("accounts")
    .select("*")
    .eq("id", accountId)
    .single();

  if (accountError || !account) return null;

  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("account_id", accountId)
    .order("created_at", { ascending: false });

  return { account: account as Account, messages: (messages as Message[]) ?? [] };
}

const CLAIM_WINDOW_MINUTES = 10;

// Claims a message submitted just before signup. Bounded so an id someone
// merely guesses can't be used to steal credit for someone else's opinion:
// only unlinked, recent messages are claimable.
export async function linkMessageToAccount(messageId: string, accountId: string): Promise<{ ok: boolean }> {
  const supabase = createServerSupabaseClient();
  const cutoff = new Date(Date.now() - CLAIM_WINDOW_MINUTES * 60_000).toISOString();

  const { data, error } = await supabase
    .from("messages")
    .update({ account_id: accountId })
    .eq("id", messageId)
    .is("account_id", null)
    .gt("created_at", cutoff)
    .select("id");

  return { ok: !error && !!data?.length };
}
