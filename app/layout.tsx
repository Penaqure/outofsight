import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Lekton } from "next/font/google";
import { siteConfig } from "@/lib/config";
import "./globals.css";

const lekton = Lekton({
  weight: "400",
  variable: "--font-lekton",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.tagline,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${lekton.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
