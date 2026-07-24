import { NextRequest, NextResponse } from "next/server";
import { DEVICE_ID_COOKIE } from "@/lib/deviceId";

// If TV_DOMAIN is set and matches the incoming host, serve /display at that
// domain's root — gives the TV a clean URL while the main domain's root
// keeps serving the submit form. No branch/second deployment needed.
const TV_HOST = process.env.TV_DOMAIN;

export function proxy(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0];
  const response =
    TV_HOST && host === TV_HOST && request.nextUrl.pathname === "/"
      ? NextResponse.rewrite(new URL("/display", request.url))
      : NextResponse.next();

  if (!request.cookies.get(DEVICE_ID_COOKIE)) {
    response.cookies.set(DEVICE_ID_COOKIE, crypto.randomUUID(), {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
  }

  return response;
}

export const config = {
  // Broadened from the original "/" so the device-id cookie exists before a
  // guest reaches the message form, whichever page they land on first. The
  // TV_DOMAIN rewrite above stays scoped to exactly "/" in the handler body.
  matcher: "/((?!_next|.*\\..*).*)",
};
