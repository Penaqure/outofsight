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

  const token = await createSessionToken(email);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return response;
}
