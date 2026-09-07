import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // /api/upload runs through proxy.ts (auth check), which makes Next clone
    // and buffer the whole request body in memory. That buffer is capped at
    // 10MB by default, truncating larger uploads before the route handler's
    // own 1GB limit ever applies. Raise it to match.
    proxyClientMaxBodySize: "1gb",
  },
};

export default nextConfig;
