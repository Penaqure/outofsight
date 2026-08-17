"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/config";
import { Container } from "@/components/ui/Container";
import logo from "@/public/logo/outofsight-logo.png";

// One header for every page, fixed to the top of the viewport. mix-blend-mode
// was tried first so the header could auto-invert against any background,
// but position:fixed elements get isolated into their own compositing layer
// in real browsers, so the blend against page content underneath doesn't
// reliably apply. Explicitly tracking which routes are dark is what actually
// works everywhere.
const darkPages = (pathname: string) =>
  pathname === "/" || (pathname.startsWith("/works/") && pathname !== "/works/");

export function Header() {
  const pathname = usePathname();
  const isDark = darkPages(pathname);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <Container>
        <div className="flex h-20 items-center justify-between">
          <Link href="/">
            <Image
              src={logo}
              alt={siteConfig.name}
              className={`h-24 w-auto ${isDark ? "invert" : ""}`}
              priority
            />
          </Link>
          <nav
            className={`flex gap-10 text-xs tracking-wider uppercase ${
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
