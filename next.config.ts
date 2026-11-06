import type { NextConfig } from "next";

// Canonical links, the sitemap, robots.txt, structured data and share images
// all use NEXT_PUBLIC_SITE_URL (see siteConfig.url). It's inlined at build
// time, so a production build without it silently points search engines at
// localhost — say so loudly.
if (process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_SITE_URL) {
  console.warn(
    "\n⚠ NEXT_PUBLIC_SITE_URL is not set — SEO URLs will point at http://localhost:3000.\n" +
      "  Set it (e.g. NEXT_PUBLIC_SITE_URL=https://outofsight.com) before `npm run build`.\n"
  );
}

const isDev = process.env.NODE_ENV === "development";
const isHttps = (process.env.NEXT_PUBLIC_SITE_URL ?? "").startsWith("https://");

// Content Security Policy — "without nonces" setup from the Next.js CSP
// guide. Everything (scripts, styles, fonts, uploads, video) is served from
// this origin, so 'self' covers it; blob: is for the admin's local
// image/video previews. 'unsafe-inline' scripts are needed for Next's
// inline bootstrap and the JSON-LD tags (a nonce-based policy would force
// every page to render per request). Dev adds eval + websockets for HMR.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "media-src 'self' blob:",
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  // Only once the site really is served over HTTPS — on plain HTTP this
  // would turn every asset request into a failing https:// one.
  ...(isHttps ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Browsers ignore HSTS over plain HTTP, so it's harmless before TLS is
  // set up. No includeSubDomains/preload: those would force HTTPS on every
  // subdomain too, which isn't ours to promise.
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Legacy twin of frame-ancestors 'none' — no one may frame the site
  // (clickjacking).
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  // Don't advertise the framework in an X-Powered-By header.
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Uploaded files are served from this origin, and SVG can contain
      // scripts. This stricter CSP (it overrides the site one above — the
      // last matching rule wins) blocks any script in an uploaded file if
      // it's opened directly; <img>/<video> embeds are unaffected.
      {
        source: "/uploads/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'none'; img-src 'self'; media-src 'self'; style-src 'unsafe-inline'; sandbox",
          },
        ],
      },
      // Admin data and admin pages must never sit in a shared or browser
      // cache.
      {
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
      {
        source: "/admin/:path*",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
    ];
  },
  experimental: {
    // /api/upload runs through proxy.ts (auth check), which makes Next clone
    // and buffer the whole request body in memory. That buffer is capped at
    // 10MB by default, truncating larger uploads before the route handler's
    // own 1GB limit ever applies. Raise it to match.
    proxyClientMaxBodySize: "1gb",
  },
  images: {
    // Uploaded artwork is stored at full resolution (14MB+ PNGs are common)
    // and served raw by app/uploads/[...path]/route.ts. next/image on the
    // public pages fetches those originals once, then transcodes them to
    // AVIF/WebP at the requested device size and disk-caches the result
    // under .next/cache/images — so visitors download ~1-2% of the bytes.
    formats: ["image/avif", "image/webp"],
    // Originals are content-addressed (random filename prefix) and never
    // mutated in place, so a long optimizer cache TTL is safe.
    minimumCacheTTL: 2678400, // 31 days
  },
};

export default nextConfig;
