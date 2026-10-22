import type { Metadata } from "next";
import {
  getAboutContent,
  getHomeContent,
  getWorksContent,
} from "@/lib/data/content";
import { videoPosterUrl } from "@/lib/media";
import { siteConfig } from "@/lib/config";
import { Footer } from "@/components/site/Footer";
import { TrustedBy } from "@/components/site/TrustedBy";
import { Reveal } from "@/components/ui/Reveal";
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

// Full-viewport hero, then (Figma v2) the Trusted International Clients
// block and the Footer. Hero text/logo mode, copy and background video come
// from the admin Home editor; the Trusted block reuses the Works heading/
// description and the About logos, same as the Works page — see
// lib/data/content.ts.
export default async function HomePage() {
  const [content, works, about] = await Promise.all([
    getHomeContent(),
    getWorksContent(),
    getAboutContent(),
  ]);
  const backgroundVideoPoster = await videoPosterUrl(content.backgroundVideoUrl);

  return (
    <div className="flex flex-col bg-bone-white">
      <HomeHero content={content} poster={backgroundVideoPoster} />
      {/* Target of the hero's "Scroll" cue; slowly fades in on first view. */}
      <Reveal id="home-next">
        <TrustedBy
          heading={works.trustedByHeading}
          description={works.trustedByDescription}
          logos={about.trustedByLogos}
          animated
        />
      </Reveal>
      <Footer />
    </div>
  );
}
