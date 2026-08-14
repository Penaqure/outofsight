import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Placeholder route guard for the admin panel. This only checks for the
// presence of a cookie — replace with real session verification once an
// auth strategy (e.g. NextAuth, a custom JWT session) is wired up.
export function proxy(request: NextRequest) {
  const isLoginRoute = request.nextUrl.pathname === "/admin/login";
  const hasSession = request.cookies.has("session");

  if (!isLoginRoute && !hasSession) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
