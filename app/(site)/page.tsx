import type { Metadata } from "next";
import { getHomeContent } from "@/lib/data/content";
import { videoPosterUrl } from "@/lib/media";
import { siteConfig } from "@/lib/config";
import HomeHero from "./HomeHero";

// Reads the mutable in-memory store directly, so force dynamic rendering —
// see the same note in works/page.tsx.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  // Landing page shows just the brand name, not "Home — OUTOFSIGHT".
  title: { absolute: siteConfig.name },
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

// Home is the hero and nothing else — full viewport, no footer, no scroll.
// Everything shown (text/logo mode, hero copy, background video) comes
// from the admin Home editor; see lib/data/content.ts.
export default async function HomePage() {
  const content = await getHomeContent();
  const backgroundVideoPoster = await videoPosterUrl(content.backgroundVideoUrl);

  return <HomeHero content={content} poster={backgroundVideoPoster} />;
}
