import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

// Served at /manifest.webmanifest — name, colours and icon used when the site
// is added to a phone's home screen. Colours match app/globals.css.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#efece8",
    theme_color: "#232323",
    icons: [
      { src: "/logo/favicon.png", sizes: "256x256", type: "image/png" },
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
    ],
  };
}
