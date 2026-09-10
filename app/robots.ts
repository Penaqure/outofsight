import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

// Served at /robots.txt. The admin dashboard and API routes are not content
// pages — keep crawlers out of them.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
