"use server";

import { redirect } from "next/navigation";
import { verifyModPassword, createModSession } from "@/lib/modSession";

export type LoginResult = { ok: boolean; error?: string };

export async function loginAction(_prevState: LoginResult, formData: FormData): Promise<LoginResult> {
  const password = String(formData.get("password") ?? "");
  if (!password || !verifyModPassword(password)) {
    return { ok: false, error: "Incorrect password." };
  }
  await createModSession();
  redirect("/mod");
}
