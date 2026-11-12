import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Lekton } from "next/font/google";
import localFont from "next/font/local";
import { siteConfig } from "@/lib/config";
import { defaultShareImage } from "@/lib/seo";
import "./globals.css";

const lekton = Lekton({
  weight: "400",
  variable: "--font-lekton",
  subsets: ["latin"],
});

const openSauce = localFont({
  src: [
    {
      path: "../fonts/OpenSauceOne/OpenSauceOne-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/OpenSauceOne/OpenSauceOne-LightItalic.ttf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../fonts/OpenSauceOne/OpenSauceOne-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/OpenSauceOne/OpenSauceOne-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../fonts/OpenSauceOne/OpenSauceOne-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/OpenSauceOne/OpenSauceOne-MediumItalic.ttf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../fonts/OpenSauceOne/OpenSauceOne-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/OpenSauceOne/OpenSauceOne-SemiBoldItalic.ttf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../fonts/OpenSauceOne/OpenSauceOne-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/OpenSauceOne/OpenSauceOne-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../fonts/OpenSauceOne/OpenSauceOne-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../fonts/OpenSauceOne/OpenSauceOne-ExtraBoldItalic.ttf",
      weight: "800",
      style: "italic",
    },
    {
      path: "../fonts/OpenSauceOne/OpenSauceOne-Black.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../fonts/OpenSauceOne/OpenSauceOne-BlackItalic.ttf",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-open-sauce",
  display: "swap",
});

export const metadata: Metadata = {
  // Resolves every relative URL below (canonical, OG images, …) against the
  // deployed origin. See siteConfig.url / NEXT_PUBLIC_SITE_URL.
  metadataBase: new URL(siteConfig.url),
  // Child pages set a bare `title` string; this wraps it as "Page — OUTOFSIGHT".
  // The home page overrides with `title.absolute` to show just the brand name.
  title: {
    default: siteConfig.name,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "OUTOFSIGHT",
    "brand storytelling",
    "film production",
    "creative studio",
    "video production",
    "filmmaking",
    "creative direction",
  ],
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    url: "/",
    locale: "en_US",
    images: [defaultShareImage],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [defaultShareImage.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  // One icon, no light/dark variants: favicon dark-mode switching
  // (`prefers-color-scheme`, whether via the `media` attribute on <link>
  // or embedded in an SVG's own stylesheet) isn't reliably applied to
  // favicons across browsers — Chrome in particular just renders the
  // default state regardless of theme. The icon is the dark mark on a
  // solid white circle (see public/logo/favicon.png) so it stays legible
  // on both light and dark tab bars without any theme detection. The
  // Apple icon is the same on a full white square: iOS fills transparent
  // corners with black.
  icons: {
    icon: "/logo/favicon.png",
    apple: "/logo/apple-icon.png",
  },
  // Google Search Console ownership check — set GOOGLE_SITE_VERIFICATION to
  // the token from the "HTML tag" method (only the content="…" value).
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export const viewport: Viewport = {
  // --obsidian / --bone-white from app/globals.css — tints the mobile
  // browser chrome to match the site's dark/light grounds.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#efece8" },
    { media: "(prefers-color-scheme: dark)", color: "#232323" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${lekton.variable} ${openSauce.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
