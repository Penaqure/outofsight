import type { NextConfig } from "next";

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
