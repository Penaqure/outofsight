import { NextResponse } from "next/server";
import {
  createSessionToken,
  safeEqual,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

const LOGIN_ATTEMPT_LIMIT = 5;
const LOGIN_ATTEMPT_WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: Request) {
  // Single hardcoded admin account, so brute-forcing the password is the
  // realistic attack here — a per-IP window keeps guessing slow without
  // needing an account-lockout system for the one account that exists.
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rateLimit = checkRateLimit(
    `login:${ip}`,
    LOGIN_ATTEMPT_LIMIT,
    LOGIN_ATTEMPT_WINDOW_MS
  );
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      }
    );
  }

  const { email, password } = await request.json();

  const validEmail = process.env.ADMIN_EMAIL;
  const validPassword = process.env.ADMIN_PASSWORD;

  if (!validEmail || !validPassword) {
    return NextResponse.json(
      { error: "Admin credentials are not configured on the server." },
      { status: 500 }
    );
  }

  const [emailOk, passwordOk] = await Promise.all([
    safeEqual(email ?? "", validEmail),
    safeEqual(password ?? "", validPassword),
  ]);
  if (!emailOk || !passwordOk) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 }
    );
  }

  // `Secure` must match how the request actually arrived, not just
  // NODE_ENV — `next start` sets NODE_ENV=production regardless of whether
  // TLS is in front of it. A `Secure` cookie set while served over plain
  // HTTP is silently dropped by the browser (never stored), which looks
  // like a login-then-bounce-back-to-login loop: the POST succeeds and the
  // Set-Cookie header goes out, but the browser discards it, so the very
  // next request has no session. x-forwarded-proto covers being behind a
  // reverse proxy that terminates TLS; the request URL covers serving TLS
  // directly.
  const isHttps =
    request.headers.get("x-forwarded-proto") === "https" ||
    new URL(request.url).protocol === "https:";

  const token = await createSessionToken(email);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isHttps,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return response;
}
