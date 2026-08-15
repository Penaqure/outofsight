import Link from "next/link";
import { getAboutContent } from "@/lib/data/content";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

// Reads the mutable in-memory store directly, so force dynamic rendering —
// see the same note in works/page.tsx.
export const dynamic = "force-dynamic";

// Every section here (hero image, founder profile, process cards, trusted-by
// logos, CTA) comes from the admin About editor — see lib/data/content.ts.
export default async function AboutPage() {
  const content = await getAboutContent();

  return (
    <div className="flex flex-col bg-bone-white">
      <Header />

      <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden bg-bone-white">
        {content.heroImage && (
          <img
            src={content.heroImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
      </section>

      <Section>
        <Container>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-[1fr_1.4fr]">
            <div className="aspect-square w-full overflow-hidden bg-obsidian/[.05]">
              {content.founderPhoto && (
                <img
                  src={content.founderPhoto}
                  alt={content.founderName}
                  className="h-full w-full object-cover grayscale"
                />
              )}
            </div>
            <div className="flex flex-col justify-between gap-10 sm:text-right">
              <div>
                <p className="text-lg font-semibold tracking-tight">
                  {content.founderName}
                </p>
                <p className="text-xs uppercase tracking-wider text-obsidian/50">
                  {content.founderTitle}
                </p>
              </div>
              <div>
                <p className="ml-auto max-w-lg text-sm text-obsidian/70">
                  {content.bio}
                </p>
                {(content.linkedinUrl || content.instagramUrl) && (
                  <div className="mt-4 flex gap-3 sm:justify-end">
                    {content.linkedinUrl && (
                      <a
                        href={content.linkedinUrl}
                        className="text-xs text-obsidian/60 hover:text-obsidian"
                      >
                        Linkedin
                      </a>
                    )}
                    {content.linkedinUrl && content.instagramUrl && (
                      <span className="text-xs text-obsidian/30">|</span>
                    )}
                    {content.instagramUrl && (
                      <a
                        href={content.instagramUrl}
                        className="text-xs text-obsidian/60 hover:text-obsidian"
                      >
                        Instagram
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <div className="grid gap-10 sm:grid-cols-3">
            {content.processCards.map((card) => (
              <div key={card.title}>
                <p className="font-medium">{card.title}</p>
                <p className="mt-2 text-sm text-obsidian/60">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {content.trustedByLogos.length > 0 && (
        <Section className="pt-0">
          <Container>
            <p className="text-center text-sm text-obsidian/50">Trusted By</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
              {content.trustedByLogos.map((logo, index) => (
                <img
                  key={index}
                  src={logo}
                  alt=""
                  className="h-6 w-auto object-contain opacity-50 grayscale"
                />
              ))}
            </div>
          </Container>
        </Section>
      )}

      <section className="relative flex h-[45vh] min-h-[320px] w-full items-center justify-center overflow-hidden bg-bone-white">
        {content.ctaBackgroundImage && (
          <>
            <img
              src={content.ctaBackgroundImage}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-bone-white/70" />
          </>
        )}
        <Link
          href="/contact"
          className="relative text-xl font-medium text-obsidian hover:underline sm:text-2xl"
        >
          {content.ctaText}
        </Link>
      </section>

      <Footer />
    </div>
  );
}
