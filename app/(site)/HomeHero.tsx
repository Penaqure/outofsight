"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { HomeContent } from "@/types/content";
import { siteConfig } from "@/lib/config";
import logoOnly from "@/public/logo/logo_only.png";
import { Reveal } from "@/components/ui/Reveal";
import { RevealItem, RevealWords } from "@/components/ui/RevealText";

// Browser smooth scrolling is quick and its speed can't be tuned, so the
// scroll cue drives its own slow, eased glide instead. Reduced-motion users
// jump straight there.
const SCROLL_DURATION = 1600;

function slowScrollTo(target: HTMLElement) {
  const startY = window.scrollY;
  const distance = target.getBoundingClientRect().top;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo(0, startY + distance);
    return;
  }
  const startTime = performance.now();
  const easeInOut = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  function step(now: number) {
    const progress = Math.min((now - startTime) / SCROLL_DURATION, 1);
    window.scrollTo(0, startY + distance * easeInOut(progress));
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// While the background video downloads, show the logo instead of a blank
// frame (see https://auteurstudios.au/ for the reference behavior). Once
// the video has buffered enough to play, fade it in and fade the loading
// logo out — regardless of the configured display mode.
export default function HomeHero({
  content,
  poster,
  showScrollCue,
}: {
  content: HomeContent;
  poster: string | undefined;
  showScrollCue: boolean;
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

      {/* Logo-only and blank modes show no hero text, but the page still
          needs one <h1> for search engines and screen readers. */}
      {content.displayMode !== "body-text" && (
        <h1 className="sr-only">{siteConfig.name}</h1>
      )}
      {content.displayMode === "blank" ? null : (
        // Plays once the video is ready, so the entrance isn't spent
        // behind the loading overlay.
        <Reveal
          active={videoReady}
          className="relative px-6 text-center sm:px-10 lg:px-16"
        >
          {content.displayMode === "logo-only" ? (
            <RevealItem>
              <Image
                src={logoOnly}
                alt={siteConfig.name}
                className="mx-auto w-24 sm:w-28"
                priority
              />
            </RevealItem>
          ) : (
            <h1 className="max-w-4xl text-3xl font-normal tracking-tight text-bone-white sm:text-4xl md:text-5xl lg:text-[48px]">
              <RevealWords text={content.heroText} />
            </h1>
          )}
        </Reveal>
      )}

      {/* Scroll cue: slowly glides to the section below the hero (the
          #home-next TrustedBy in page.tsx), which then animates in. Placed
          before the loading overlay so it stays hidden until the video is
          ready. A link, so it still jumps there with JS disabled. Left out when
          the section is off, since there would be nothing to scroll to. */}
      {showScrollCue && (
        <a
          href="#home-next"
          onClick={(event) => {
            event.preventDefault();
            const target = document.getElementById("home-next");
            if (target) slowScrollTo(target);
          }}
          aria-label="Scroll to next section"
          className="group absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] tracking-[0.2em] text-bone-white/70 uppercase transition-colors hover:text-bone-white sm:bottom-10 sm:text-xs"
        >
          Scroll
          <span className="relative block h-10 w-px overflow-hidden bg-bone-white/25 sm:h-12">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-scroll-cue bg-bone-white" />
          </span>
        </a>
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
