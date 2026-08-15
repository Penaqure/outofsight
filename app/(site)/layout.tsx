import type { ReactNode } from "react";

// No shared chrome here — Home renders only its full-bleed hero (its own
// HeroHeader, no Footer, no scroll), while every other page renders the
// standard <Header /> and <Footer /> itself. See app/(site)/page.tsx and
// components/site/HeroHeader.tsx.
export default function SiteLayout({ children }: { children: ReactNode }) {
  return <div className="flex min-h-full flex-col">{children}</div>;
}
