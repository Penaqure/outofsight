import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { RevealItem, RevealWords, afterWords } from "@/components/ui/RevealText";

// 404 for unknown URLs and for notFound() (e.g. a project slug that doesn't
// exist). It renders under the root layout only — outside (site)/layout — so
// it brings its own Header. Same full-screen centred treatment and
// word-by-word entrance as the Contact page.
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

const HEADING = "This page is out of sight.";

const links = [
  { href: "/", label: "Back to home" },
  { href: "/works", label: "View our work" },
];

export default function NotFound() {
  const itemsStart = afterWords(HEADING);

  return (
    <div className="flex min-h-full flex-col bg-bone-white">
      <Header />
      <main className="flex h-dvh flex-col items-center justify-center text-center">
        <Reveal>
          <Container>
            <RevealItem
              as="p"
              className="text-xs tracking-[0.2em] text-obsidian/50 uppercase"
            >
              Error 404
            </RevealItem>
            <h1 className="mt-4 text-4xl tracking-tight text-obsidian sm:text-5xl lg:text-[48px]">
              <RevealWords text={HEADING} startMs={100} />
            </h1>
            <RevealItem
              as="p"
              startMs={afterWords(HEADING, 100)}
              className="mx-auto mt-6 max-w-md text-base text-obsidian/70"
            >
              The page you’re looking for doesn’t exist or has been moved.
            </RevealItem>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {links.map((link, index) => (
                <RevealItem
                  key={link.href}
                  startMs={itemsStart + 100}
                  index={index + 1}
                >
                  <Link
                    href={link.href}
                    className="border-b border-obsidian pb-1 text-sm tracking-wider text-obsidian uppercase transition-opacity hover:opacity-60"
                  >
                    {link.label}
                  </Link>
                </RevealItem>
              ))}
            </div>
          </Container>
        </Reveal>
      </main>
      <Footer />
    </div>
  );
}
