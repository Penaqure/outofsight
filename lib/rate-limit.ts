// In-memory fixed-window rate limiter. Fine for a single-process, always-on
// server (this app's whole point in moving to Contabo) — it wouldn't
// survive multiple instances or serverless cold starts, but there's only
// one login endpoint on one admin site to protect here.
const buckets = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();

  // Opportunistic sweep so the map doesn't grow unbounded from one-off
  // callers (e.g. bots hitting the login route from many IPs).
  for (const [bucketKey, bucket] of buckets) {
    if (now > bucket.resetAt) buckets.delete(bucketKey);
  }

  const bucket = buckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}
