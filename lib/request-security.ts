import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { siteConfig } from "@/lib/config";

// The client's IP for rate limiting. X-Forwarded-For is a list the client
// can pre-fill with anything, so its FIRST entry is attacker-controlled —
// keying on it let every login guess claim a fresh IP. The reverse proxy
// (nginx) appends the real address last, or sets X-Real-IP.
export function clientIp(request: Request): string {
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  const forwarded = request.headers.get("x-forwarded-for");
  const last = forwarded?.split(",").at(-1)?.trim();
  return last || "unknown";
}

// CSRF defence for state-changing requests: the browser always sends Origin
// on cross-site POST/PUT/DELETE, so reject any whose origin isn't this site.
// The session cookie is already SameSite=Lax; this is the second layer.
// Accepts the request's own host (direct or via a proxy's forwarded host)
// and the configured public URL.
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) {
    // Non-browser clients (curl, scripts) send no Origin; they also can't
    // carry a victim's cookies, so there's nothing to forge.
    return true;
  }
  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    return false;
  }
  const allowed = [
    request.headers.get("x-forwarded-host"),
    request.headers.get("host"),
    new URL(siteConfig.url).host,
  ];
  return allowed.some((host) => host && host.split(",")[0].trim() === originHost);
}

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export function isMutating(request: Request): boolean {
  return MUTATING_METHODS.has(request.method.toUpperCase());
}

// Auth check inside admin API route handlers. proxy.ts already guards these
// routes, but only those listed in its matcher — this second check means a
// route can't become public just because the matcher wasn't updated.
// Returns a response to send back when the request isn't allowed.
export async function requireAdmin(request: Request): Promise<NextResponse | null> {
  if (isMutating(request) && !isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!(await verifySessionToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

// Parses a JSON request body; malformed JSON gets a 400 instead of throwing
// out of the handler as a 500.
export async function readJson(
  request: Request
): Promise<{ body: unknown } | { error: NextResponse }> {
  try {
    return { body: await request.json() };
  } catch {
    return {
      error: NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }),
    };
  }
}
