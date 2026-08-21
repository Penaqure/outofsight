"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/config";
import { Container } from "@/components/ui/Container";
import logo from "@/public/logo/outofsight-logo.png";

// Must match the h-20 row below. The observed band is centered on this
// height rather than spanning all of it: the header's content (logo, nav
// text) sits vertically centered within it, so what matters is whether
// that centerline is over dark or light content — not the full band. Using
// the full height flips the header on a thin sliver of the "wrong" color
// touching just the very top or bottom edge, inverting text against a
// background it isn't actually sitting on.
const HEADER_HEIGHT = 80;
const HEADER_CENTER_BAND = 8;

// One header for every page, fixed to the top of the viewport. A static
// per-route light/dark flag doesn't work: several pages (Home, Works
// listing, About) start on a dark hero but turn into a plain Bone White
// body further down, and every page ends on the dark Footer — so the
// header needs to react to what's actually scrolled underneath it, not
// just which route it's on.
//
// mix-blend-mode was tried first so the header could auto-invert against
// any background, but position:fixed elements get isolated into their own
// compositing layer in real browsers, so the blend against page content
// underneath doesn't reliably apply. Instead, any section that needs the
// light/inverted header treatment while it's behind the header is marked
// with `data-header-invert` (Home hero, Works listing hero, About hero/CTA,
// the Footer). An IntersectionObserver watches all of them against a root
// shrunk to the header's own height, so "dark" just means "at least one
// marked section currently overlaps the header band."
export function Header() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(pathname === "/");
  const intersecting = useRef<Set<Element>>(new Set());

  useEffect(() => {
    // Recreated (not reused) whenever the header's own re-render would
    // otherwise be picked up as a DOM change — see the note below on why
    // this intentionally does NOT watch the DOM for mutations.
    let observer: IntersectionObserver | null = null;

    function observeCurrentTargets() {
      document
        .querySelectorAll("[data-header-invert]")
        .forEach((el) => observer!.observe(el));
    }

    function buildObserver() {
      observer?.disconnect();
      intersecting.current = new Set();
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              intersecting.current.add(entry.target);
            } else {
              intersecting.current.delete(entry.target);
            }
          }
          setIsDark(intersecting.current.size > 0);
        },
        {
          rootMargin: `-${(HEADER_HEIGHT - HEADER_CENTER_BAND) / 2}px 0px -${Math.max(
            window.innerHeight - (HEADER_HEIGHT + HEADER_CENTER_BAND) / 2,
            0
          )}px 0px`,
        }
      );
      observeCurrentTargets();
    }

    buildObserver();

    // Catch marked sections that mount slightly after this effect runs
    // (e.g. the Footer is an async Server Component). observer.observe()
    // is a no-op for a target that's already observed, so this is safe to
    // run again without duplicating entries. Deliberately NOT a
    // MutationObserver on document.body: this header's own re-renders
    // toggle its className (invert/text-white), which are themselves DOM
    // mutations — watching the whole subtree would re-trigger on every
    // state change it causes, tearing the observer down mid-flight and
    // destabilizing the reading.
    const lateScan = setTimeout(observeCurrentTargets, 300);

    window.addEventListener("resize", buildObserver);

    return () => {
      observer?.disconnect();
      clearTimeout(lateScan);
      window.removeEventListener("resize", buildObserver);
    };
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <Container>
        <div className="flex h-20 items-center justify-between">
          <Link href="/">
            <Image
              src={logo}
              alt={siteConfig.name}
              className={`h-24 w-auto transition-[filter] duration-200 ${isDark ? "invert" : ""}`}
              priority
            />
          </Link>
          <nav
            className={`flex gap-10 text-xs tracking-wider uppercase transition-colors duration-200 ${
              isDark ? "text-white" : "text-obsidian"
            }`}
          >
            {siteConfig.nav.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    isActive
                      ? isDark
                        ? "border-b border-white"
                        : "border-b border-obsidian"
                      : "opacity-70 hover:opacity-100"
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </Container>
    </header>
  );
}
