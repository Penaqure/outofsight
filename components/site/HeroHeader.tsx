import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/config";
import { Container } from "@/components/ui/Container";
import logo from "@/public/logo/outofsight-logo.png";

// Transparent overlay header used only on the Home hero, where it sits on
// top of the background video/image rather than in normal document flow.
// Other pages use the standard <Header /> instead.
export function HeroHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-10">
      <Container>
        <div className="flex h-20 items-center justify-between">
          <Link href="/">
            <Image src={logo} alt={siteConfig.name} className="h-6 w-auto invert" priority />
          </Link>
          <nav className="flex gap-8 text-sm text-bone-white/80">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  item.href === "/"
                    ? "border-b border-bone-white text-bone-white"
                    : "hover:text-bone-white"
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </Container>
    </header>
  );
}
