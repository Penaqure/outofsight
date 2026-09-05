import type { Metadata } from "next";
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
      className={`${lekton.variable} ${openSauce.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
