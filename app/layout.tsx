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
  // favicon.ico (obsidian icon) is the universal fallback for browsers that
  // don't support prefers-color-scheme favicons. These two entries layer on
  // top for browsers that do, so the icon stays visible against the tab bar
  // either way — a dark icon on a light tab bar, a light icon on a dark one.
  icons: {
    icon: [
      {
        url: "/logo/favicon-light-theme.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/logo/favicon-dark-theme.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
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
