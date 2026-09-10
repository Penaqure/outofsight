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
  // Mobile only: the inline nav is replaced by a hamburger that opens a
  // full-screen overlay (see the Figma "Website Mobile" menu frame). On sm+
  // the overlay is never shown and the inline nav is always visible.
  const [menuOpen, setMenuOpen] = useState(false);
  const intersecting = useRef<Set<Element>>(new Set());

  // Lock body scroll and allow Esc to dismiss while the overlay is open.
  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

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

  // While the overlay is open the header sits on a dark scrim, so the logo
  // and hamburger always take the light treatment regardless of what's
  // scrolled underneath.
  const light = isDark || menuOpen;

  const isNavActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Mobile menu overlay. Transparent-to-dark scrim so the links stay
          legible on any page, not just the dark landing hero. Tapping the
          scrim (but not the links) closes it. */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-obsidian/95 backdrop-blur-sm sm:hidden"
          onClick={() => setMenuOpen(false)}
        >
          <nav
            className="flex flex-col items-center gap-6 px-6 pt-28 text-xs tracking-wider text-bone-white uppercase"
            onClick={(event) => event.stopPropagation()}
          >
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`whitespace-nowrap pb-1 ${
                  isNavActive(item.href)
                    ? "border-b border-bone-white"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      <Container>
        <div className="relative flex h-20 items-center justify-between">
          <Link href="/" className="shrink-0">
            <Image
              src={logo}
              alt={siteConfig.name}
              className={`h-8 w-auto transition-[filter] duration-200 sm:h-14 lg:h-24 ${light ? "invert" : ""}`}
              priority
            />
          </Link>

          <nav
            className={`hidden gap-2 text-[10px] tracking-wider uppercase transition-colors duration-200 sm:flex sm:gap-6 sm:text-xs lg:gap-10 ${
              isDark ? "text-white" : "text-obsidian"
            }`}
          >
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap ${
                  isNavActive(item.href)
                    ? isDark
                      ? "border-b border-white"
                      : "border-b border-obsidian"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className={`-mr-2 inline-flex h-10 w-10 items-center justify-center transition-colors duration-200 sm:hidden ${
              light ? "text-bone-white" : "text-obsidian"
            }`}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              className="h-6 w-6"
            >
              {menuOpen ? (
                <>
                  <path d="M6 6l12 12" />
                  <path d="M18 6L6 18" />
                </>
              ) : (
                <>
                  <path d="M3 6h18" />
                  <path d="M3 12h18" />
                  <path d="M3 18h18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </Container>
    </header>
  );
}
