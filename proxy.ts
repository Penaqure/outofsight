import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginRoute = pathname === "/admin/login";
  const isApiRoute = pathname.startsWith("/api/");

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const isAuthenticated = await verifySessionToken(token);

  // Content/works/upload API routes are only ever called by the admin
  // dashboard (public site pages read content directly via lib/data, not
  // through these routes) — so unlike /admin pages, an unauthenticated hit
  // gets a 401 instead of a redirect, since these are fetched by scripts,
  // not browsed.
  if (isApiRoute) {
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  if (!isLoginRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isLoginRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/content/:path*",
    "/api/works",
    "/api/works/:path*",
    "/api/upload",
  ],
};
