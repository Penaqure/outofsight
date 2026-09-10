import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Lekton } from "next/font/google";
import localFont from "next/font/local";
import { siteConfig } from "@/lib/config";
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
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    url: "/",
    locale: "en_US",
    // TODO: replace with a purpose-built 1200×630 social card. The logo is a
    // stopgap so shared links aren't completely image-less.
    images: [{ url: "/logo/outofsight-logo.png", alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: ["/logo/outofsight-logo.png"],
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
  // default state regardless of theme. The icon itself carries a light
  // halo behind its dark linework (see public/logo/favicon.png) so it
  // stays legible on both light and dark tab bars without needing any
  // theme detection to work.
  icons: {
    icon: "/logo/favicon.png",
  },
};

export const viewport: Viewport = {
  // --obsidian / --bone-white from app/globals.css — tints the mobile
  // browser chrome to match the site's dark/light grounds.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#efece8" },
    { media: "(prefers-color-scheme: dark)", color: "#232323" },
  ],
};

// Organization + WebSite structured data — helps search engines show the
// brand name/logo and a sitelinks search box. Rendered once, site-wide.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}/logo/outofsight-logo.png`,
      description: siteConfig.description,
    },
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: siteConfig.name,
      publisher: { "@id": `${siteConfig.url}/#organization` },
    },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${lekton.variable} ${openSauce.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
