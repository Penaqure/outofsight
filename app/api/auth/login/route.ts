import { NextResponse } from "next/server";
import {
  createSessionToken,
  safeEqual,
  sessionSecretProblem,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/auth";
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit";
import { clientIp, isSameOrigin, readJson } from "@/lib/request-security";

const LOGIN_ATTEMPT_LIMIT = 5;
const LOGIN_ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
// Cap across ALL addresses, so a botnet rotating IPs still only gets this
// many guesses per window. The trade-off: during such an attack the real
// admin may also be told to wait until the window resets.
const GLOBAL_LOGIN_ATTEMPT_LIMIT = 50;

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Single hardcoded admin account, so brute-forcing the password is the
  // realistic attack here — a per-IP window keeps guessing slow without
  // needing an account-lockout system for the one account that exists.
  const ip = clientIp(request);
  const perIp = checkRateLimit(
    `login:${ip}`,
    LOGIN_ATTEMPT_LIMIT,
    LOGIN_ATTEMPT_WINDOW_MS
  );
  const rateLimit = perIp.allowed
    ? checkRateLimit("login:*", GLOBAL_LOGIN_ATTEMPT_LIMIT, LOGIN_ATTEMPT_WINDOW_MS)
    : perIp;
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      }
    );
  }

  const parsed = await readJson(request);
  if ("error" in parsed) return parsed.error;
  const { email, password } = (parsed.body ?? {}) as {
    email?: unknown;
    password?: unknown;
  };
  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 }
    );
  }

  const validEmail = process.env.ADMIN_EMAIL;
  const validPassword = process.env.ADMIN_PASSWORD;

  if (!validEmail || !validPassword || sessionSecretProblem()) {
    console.error(
      "Admin login is not configured:",
      sessionSecretProblem() ?? "ADMIN_EMAIL / ADMIN_PASSWORD missing"
    );
    return NextResponse.json(
      { error: "Admin credentials are not configured on the server." },
      { status: 500 }
    );
  }

  const [emailOk, passwordOk] = await Promise.all([
    safeEqual(email, validEmail),
    safeEqual(password, validPassword),
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

  // Only failed guesses should count towards this address's limit.
  resetRateLimit(`login:${ip}`);

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
