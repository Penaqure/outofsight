import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Lekton, Open_Sans } from "next/font/google";
import { siteConfig } from "@/lib/config";
import "./globals.css";

const lekton = Lekton({
  weight: "400",
  variable: "--font-lekton",
  subsets: ["latin"],
});

const openSans = Open_Sans({
  weight: ["400", "500", "600", "700"],
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.tagline,
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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${lekton.variable} ${openSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
