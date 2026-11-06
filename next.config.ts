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

const nextConfig: NextConfig = {
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
