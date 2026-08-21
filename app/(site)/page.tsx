import Image from "next/image";
import { getHomeContent } from "@/lib/data/content";
import { siteConfig } from "@/lib/config";
import logo from "@/public/logo/outofsight-logo.png";

// Reads the mutable in-memory store directly, so force dynamic rendering —
// see the same note in works/page.tsx.
export const dynamic = "force-dynamic";

// Home is the hero and nothing else — full viewport, no footer, no scroll.
// Everything shown (text/logo mode, hero copy, background video) comes
// from the admin Home editor; see lib/data/content.ts.
export default async function HomePage() {
  const content = await getHomeContent();

  return (
    <section
      data-header-invert
      className="relative flex h-dvh w-full items-center justify-center overflow-hidden bg-obsidian"
    >
      {content.backgroundVideoUrl ? (
        <video
          src={content.backgroundVideoUrl}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-obsidian to-black" />
      )}
      <div className="absolute inset-0 bg-obsidian/40" />

      <div className="relative px-6 text-center sm:px-10 lg:px-16">
        {content.displayMode === "logo-only" ? (
          <Image
            src={logo}
            alt={siteConfig.name}
            className="mx-auto w-72 invert"
            priority
          />
        ) : (
          <h1 className="max-w-4xl text-3xl font-normal tracking-tight text-bone-white sm:text-4xl md:text-5xl lg:text-[48px]">
            {content.heroText}
          </h1>
        )}
      </div>
    </section>
  );
}
