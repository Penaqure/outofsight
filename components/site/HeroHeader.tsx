"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/config";
import { Container } from "@/components/ui/Container";
import logo from "@/public/logo/outofsight-logo.png";

// Transparent overlay header used on hero banners (Home, About), where it
// sits on top of the background media rather than in normal document flow.
// Other pages use the standard <Header /> instead.
export function HeroHeader() {
  const pathname = usePathname();

  return (
    <header className="absolute inset-x-0 top-0 z-10">
      <Container>
        <div className="flex h-20 items-center justify-between">
          <Link href="/">
            <Image src={logo} alt={siteConfig.name} className="h-6 w-auto invert" priority />
          </Link>
          <nav className="flex gap-8 text-sm text-bone-white/80">
            {siteConfig.nav.map((item) => {
              const isActive =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    isActive
                      ? "border-b border-bone-white text-bone-white"
                      : "text-bone-white/80 hover:text-bone-white"
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
