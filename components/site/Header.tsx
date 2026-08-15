"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/config";
import { Container } from "@/components/ui/Container";
import logo from "@/public/logo/outofsight-logo.png";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-black/[.08] dark:border-white/[.1]">
      <Container>
        <div className="flex h-20 items-center justify-between">
          <Link href="/">
            <Image src={logo} alt={siteConfig.name} className="h-6 w-auto" priority />
          </Link>
          <nav className="flex gap-10 text-xs tracking-wider text-obsidian/60 uppercase">
            {siteConfig.nav.map((item) => {
              const isActive =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    isActive
                      ? "border-b border-obsidian text-obsidian"
                      : "text-obsidian/60 hover:text-obsidian"
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
