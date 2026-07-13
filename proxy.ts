import { NextRequest, NextResponse } from "next/server";

// If TV_DOMAIN is set and matches the incoming host, serve /display at that
// domain's root — gives the TV a clean URL while the main domain's root
// keeps serving the submit form. No branch/second deployment needed.
const TV_HOST = process.env.TV_DOMAIN;

export function proxy(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0];
  if (TV_HOST && host === TV_HOST && request.nextUrl.pathname === "/") {
    return NextResponse.rewrite(new URL("/display", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/",
};
