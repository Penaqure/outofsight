"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { HomeContent } from "@/types/content";
import { siteConfig } from "@/lib/config";
import logoOnly from "@/public/logo/logo_only.png";

// While the background video downloads, show the logo instead of a blank
// frame (see https://auteurstudios.au/ for the reference behavior). Once
// the video has buffered enough to play, fade it in and fade the loading
// logo out — regardless of the configured display mode.
export default function HomeHero({
  content,
  poster,
}: {
  content: HomeContent;
  poster: string | undefined;
}) {
  const [videoReady, setVideoReady] = useState(!content.backgroundVideoUrl);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <section
      data-header-invert
      className="relative flex h-dvh w-full items-center justify-center overflow-hidden bg-obsidian"
    >
      {content.backgroundVideoUrl ? (
        <video
          ref={videoRef}
          src={content.backgroundVideoUrl}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          // "auto" made the browser pull the entire file (often 50MB+)
          // before rendering anything; "metadata" lets playback start once
          // the first chunk is buffered, and the poster covers the gap.
          preload="metadata"
          onCanPlay={() => setVideoReady(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            videoReady ? "opacity-100" : "opacity-0"
          }`}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-obsidian to-black" />
      )}
      <div className="absolute inset-0 bg-obsidian/40" />

      {content.displayMode === "blank" ? null : (
        <div className="relative px-6 text-center sm:px-10 lg:px-16">
          {content.displayMode === "logo-only" ? (
            <Image
              src={logoOnly}
              alt={siteConfig.name}
              className="mx-auto w-24 sm:w-28"
              priority
            />
          ) : (
            <h1 className="max-w-4xl text-3xl font-normal tracking-tight text-bone-white sm:text-4xl md:text-5xl lg:text-[48px]">
              {content.heroText}
            </h1>
          )}
        </div>
      )}

      {/* Loading state: only the logo, shown until the video can play. */}
      <div
        aria-hidden={videoReady}
        className={`absolute inset-0 flex items-center justify-center bg-obsidian transition-opacity duration-500 ${
          videoReady ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <Image
          src={logoOnly}
          alt={siteConfig.name}
          className="w-12 animate-pulse sm:w-14"
          priority
        />
      </div>
    </section>
  );
}
