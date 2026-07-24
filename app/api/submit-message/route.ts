import { NextRequest, NextResponse } from "next/server";
import { submitMessage } from "@/lib/submitMessage";
import { DEVICE_ID_COOKIE } from "@/lib/deviceId";

export const dynamic = "force-dynamic";

// Plain JSON twin of the submitMessage Server Action (app/actions.ts) — same
// validate-and-insert logic (lib/submitMessage.ts), but reachable over a
// stable HTTP endpoint. Exists for two reasons: it's what the client-side
// retry-with-backoff wrapper calls (imperative fetch is easier to retry than
// a Server Action bound to useActionState), and it's the load-test target in
// scripts/load-test.mjs — Server Actions use internal per-build action-id
// headers that can't be hand-crafted from an external script.
export async function POST(request: NextRequest) {
  let body: { name?: unknown; message?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name : "";
  const message = typeof body.message === "string" ? body.message : "";
  const deviceId = request.cookies.get(DEVICE_ID_COOKIE)?.value;

  const result = await submitMessage(name, message, deviceId);
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
