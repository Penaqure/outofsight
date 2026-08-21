import Link from "next/link";
import { getAboutContent } from "@/lib/data/content";
import { Footer } from "@/components/site/Footer";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

// Reads the mutable in-memory store directly, so force dynamic rendering —
// see the same note in works/page.tsx.
export const dynamic = "force-dynamic";

// Every section here (hero image, intro, story, founder profile, process
// cards, trusted-by logos, CTA) comes from the admin About editor — see
// lib/data/content.ts.
export default async function AboutPage() {
  const content = await getAboutContent();

  return (
    <div className="flex flex-col bg-bone-white">
      <section
        {...(content.heroImage ? { "data-header-invert": true } : {})}
        className="relative flex h-[60vh] min-h-[420px] w-full items-center justify-center overflow-hidden bg-bone-white"
      >
        {content.heroImage && (
          <>
            <img
              src={content.heroImage}
              alt=""
              style={{ objectPosition: content.heroImagePosition }}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-obsidian/30" />
            <h1 className="relative max-w-4xl px-6 text-center text-3xl tracking-tight text-bone-white sm:px-10 sm:text-4xl md:text-5xl lg:px-16 lg:text-[48px]">
              {content.heroHeadline}
            </h1>
          </>
        )}
      </section>

      {content.introText && (
        <Section className="pb-0">
          <Container>
            <p className="text-center text-base leading-[1.3] text-obsidian/80">
              {content.introText}
            </p>
          </Container>
        </Section>
      )}

      {(content.storyText || content.storyImage) && (
        // Image bleeds to the right screen edge here (matches Figma) — only
        // the text column keeps the standard left padding, so this section
        // is NOT wrapped in <Container>, unlike the rest of the page.
        <Section>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-[1fr_2fr] sm:items-start">
            <p className="px-6 text-base leading-[1.3] text-obsidian/80 sm:pr-0 sm:pl-10 lg:pl-16">
              {content.storyText}
            </p>
            <div className="aspect-[1376/633] w-full overflow-hidden bg-obsidian/[.05]">
              {content.storyImage && (
                <img
                  src={content.storyImage}
                  alt=""
                  style={{ objectPosition: content.storyImagePosition }}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          </div>
        </Section>
      )}

      {/* Photo bleeds to the left screen edge here (matches Figma) — only
          the text column keeps the standard right padding, so this section
          is NOT wrapped in <Container>, unlike the rest of the page. */}
      <Section>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-[1fr_1.4fr]">
          <div className="aspect-square w-full overflow-hidden bg-obsidian/[.05]">
            {content.founderPhoto && (
              <img
                src={content.founderPhoto}
                alt={content.founderName}
                style={{ objectPosition: content.founderPhotoPosition }}
                className="h-full w-full object-cover grayscale"
              />
            )}
          </div>
          <div className="flex flex-col justify-between gap-10 px-6 sm:pr-10 sm:pl-0 sm:text-right lg:pr-16">
            <div>
              <p className="font-heading text-2xl leading-tight font-semibold tracking-tight text-obsidian">
                {content.founderName.includes(" ") ? (
                  <>
                    {content.founderName.slice(
                      0,
                      content.founderName.indexOf(" ")
                    )}
                    <br />
                    {content.founderName.slice(
                      content.founderName.indexOf(" ") + 1
                    )}
                  </>
                ) : (
                  content.founderName
                )}
              </p>
              <p className="text-base uppercase tracking-wider text-obsidian/50">
                {content.founderTitle}
              </p>
            </div>
            <div>
              <p className="ml-auto max-w-lg text-base leading-[1.3] text-obsidian/70">
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
      </Section>

      <Section className="pt-0">
        <Container>
          <div className="grid gap-10 sm:grid-cols-3">
            {content.processCards.map((card) => (
              <div key={card.title}>
                <p className="font-heading text-2xl font-semibold tracking-tight text-obsidian">{card.title}</p>
                <p className="mt-4 text-base leading-[1.3] text-obsidian/60">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {content.trustedByLogos.length > 0 && (
        // Figma gives this standalone block its own 96px box padding
        // (not the 64px reading-column padding the rest of the page uses),
        // so it gets a dedicated wrapper instead of <Container>.
        <Section className="pt-0">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-9 px-6 sm:px-10 lg:px-24">
            <p className="font-heading text-center text-2xl font-semibold tracking-tight text-obsidian">
              Trusted By
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
              {content.trustedByLogos.map((logo, index) => (
                <img
                  key={index}
                  src={logo}
                  alt=""
                  className="h-6 w-auto object-contain opacity-50 grayscale"
                />
              ))}
            </div>
          </div>
        </Section>
      )}

      <section
        data-header-invert
        className="relative flex h-[45vh] min-h-[320px] w-full items-center justify-center overflow-hidden bg-obsidian"
      >
        {content.ctaBackgroundImage && (
          <>
            <img
              src={content.ctaBackgroundImage}
              alt=""
              style={{ objectPosition: content.ctaBackgroundImagePosition }}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-obsidian/50" />
          </>
        )}
        <Link
          href="/contact"
          className="relative px-6 text-center text-2xl tracking-tight text-bone-white hover:underline sm:px-10 lg:px-16"
        >
          {content.ctaText}
        </Link>
      </section>

      <Footer />
    </div>
  );
}
