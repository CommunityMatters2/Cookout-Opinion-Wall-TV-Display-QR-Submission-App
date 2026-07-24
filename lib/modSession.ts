import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const MOD_COOKIE = "cm2_mod_session";
const SESSION_TTL_MS = 4 * 60 * 60 * 1000;

function getSecret(): string {
  const secret = process.env.MOD_PASSWORD;
  if (!secret) throw new Error("MOD_PASSWORD is not set");
  return secret;
}

function sign(value: string): string {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function verifyModPassword(candidate: string): boolean {
  return safeEqual(candidate, getSecret());
}

// A short-lived HMAC-signed cookie — enough of a barrier to keep a random
// guest who finds the URL from wiping the public wall, without standing up a
// full auth/session-table system for one internal tool.
export async function createModSession(): Promise<void> {
  const issuedAt = Date.now().toString();
  const cookieStore = await cookies();
  cookieStore.set(MOD_COOKIE, `${issuedAt}.${sign(issuedAt)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
    path: "/",
  });
}

export async function hasValidModSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(MOD_COOKIE)?.value;
  if (!raw) return false;

  const [issuedAt, signature] = raw.split(".");
  if (!issuedAt || !signature) return false;
  if (Date.now() - Number(issuedAt) > SESSION_TTL_MS) return false;

  return safeEqual(signature, sign(issuedAt));
}
