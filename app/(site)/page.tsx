import type { Metadata } from "next";
import { getHomeContent } from "@/lib/data/content";
import { videoPosterUrl } from "@/lib/media";
import { siteConfig } from "@/lib/config";
import { pageMetadata } from "@/lib/seo";
import { Footer } from "@/components/site/Footer";
import { TrustedBy } from "@/components/site/TrustedBy";
import HomeHero from "./HomeHero";

// Reads the mutable in-memory store directly, so force dynamic rendering —
// see the same note in works/page.tsx.
export const dynamic = "force-dynamic";

// Landing page shows just the brand name, not "Home — OUTOFSIGHT".
export const metadata: Metadata = pageMetadata({
  title: null,
  description: siteConfig.description,
  path: "/",
});

// Full-viewport hero, then (Figma v2) the Trusted International Clients
// section and the Footer. Everything comes from the admin Home editor,
// including the section's on/off switch; see lib/data/content.ts. With the
// section off (or no logos) the Footer goes too, leaving just the hero.
export default async function HomePage() {
  const content = await getHomeContent();
  const backgroundVideoPoster = await videoPosterUrl(content.backgroundVideoUrl);
  const showClients = content.clientsEnabled && content.clientsLogos.length > 0;

  return (
    <div className="flex flex-col bg-bone-white">
      <HomeHero
        content={content}
        poster={backgroundVideoPoster}
        showScrollCue={showClients}
      />
      {/* Target of the hero's "Scroll" cue. */}
      {showClients && (
        <>
          <TrustedBy
            id="home-next"
            heading={content.clientsHeading}
            description={content.clientsDescription}
            logos={content.clientsLogos}
          />
          <Footer />
        </>
      )}
    </div>
  );
}
