import Link from "next/link";
import Image from "next/image";
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
        className="relative flex h-[450px] w-full items-center justify-center overflow-hidden bg-bone-white sm:h-[60vh] sm:min-h-[420px]"
      >
        {content.heroImage && (
          <>
            <Image
              src={content.heroImage}
              alt=""
              fill
              priority
              sizes="100vw"
              style={{ objectPosition: content.heroImagePosition }}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-obsidian/30" />
            <h1 className="relative max-w-4xl px-6 text-center text-xl tracking-tight text-bone-white sm:px-10 sm:text-4xl md:text-5xl lg:px-16 lg:text-[48px]">
              {content.heroHeadline}
            </h1>
          </>
        )}
      </section>

      {content.introText && (
        <Section className="pb-0">
          <Container>
            <p className="text-center text-xs leading-[1.23] text-obsidian/80 sm:text-base sm:leading-[1.3]">
              {content.introText}
            </p>
          </Container>
        </Section>
      )}

      {(content.storyText || content.storyImage) && (
        // Image bleeds to the right screen edge here (matches Figma) — only
        // the text column keeps the standard left padding, so this section
        // is NOT wrapped in <Container>, unlike the rest of the page. No
        // bottom padding: its bottom-right corner touches the founder
        // image directly below (same column split, so their edges align).
        <Section className="pb-0 sm:pb-0">
          {/* Mobile (Figma): image full-bleed on top, text below. Desktop:
              narrow text column left, image bleeding to the right edge. */}
          <div className="flex flex-col gap-6 sm:grid sm:grid-cols-[1fr_2fr] sm:items-start sm:gap-0">
            <p className="order-2 px-6 text-xs leading-[1.23] text-obsidian/80 sm:order-none sm:pr-0 sm:pl-10 sm:text-base sm:leading-[1.3] lg:pl-16">
              {content.storyText}
            </p>
            <div className="relative order-1 aspect-[412/190] w-full overflow-hidden bg-obsidian/[.05] sm:order-none sm:aspect-[1376/633]">
              {content.storyImage && (
                <Image
                  src={content.storyImage}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 66vw, 100vw"
                  style={{ objectPosition: content.storyImagePosition }}
                  className="object-cover"
                />
              )}
            </div>
          </div>
        </Section>
      )}

      {/* Photo bleeds to the left screen edge here (matches Figma), using
          the same column split as the story section above (so the story
          image's left edge lines up with this photo's right edge, with no
          gap between the two sections). Only the text column keeps the
          standard right padding, so this section is NOT wrapped in
          <Container>, unlike the rest of the page. */}
      <Section className="pt-0 sm:pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr]">
          <div className="relative aspect-[412/512] w-full overflow-hidden bg-obsidian/[.05] sm:aspect-square">
            {content.founderPhoto && (
              <Image
                src={content.founderPhoto}
                alt={content.founderName}
                fill
                sizes="(min-width: 640px) 33vw, 100vw"
                style={{ objectPosition: content.founderPhotoPosition }}
                className="object-cover grayscale"
              />
            )}
          </div>
          <div className="flex flex-col justify-between gap-9 px-6 pr-16 pt-8 text-right sm:gap-10 sm:pr-10 sm:pl-0 sm:pt-16 lg:pr-16">
            <div>
              <p className="font-heading text-base leading-tight font-semibold tracking-tight text-obsidian sm:text-2xl">
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
              <p className="text-xs uppercase tracking-wider text-obsidian/50 sm:text-base">
                {content.founderTitle}
              </p>
            </div>
            <div>
              <p className="ml-auto max-w-4xl text-xs leading-[1.23] text-obsidian/70 sm:text-base sm:leading-[1.3]">
                {content.bio}
              </p>
              {(content.linkedinUrl || content.instagramUrl) && (
                <div className="mt-4 flex justify-end gap-3">
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
          <div className="grid gap-8 sm:grid-cols-3 sm:gap-10">
            {content.processCards.map((card) => (
              <div key={card.title}>
                <p className="font-heading text-base font-semibold tracking-tight text-obsidian sm:text-2xl">
                  {card.title}
                </p>
                <p className="mt-3 text-xs leading-[1.23] text-obsidian/60 sm:mt-4 sm:text-base sm:leading-[1.3]">
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
          <div className="px-6 sm:px-10 lg:px-24">
            <p className="font-heading text-center text-base font-semibold tracking-tight text-obsidian sm:text-2xl">
              Trusted By
            </p>
          </div>
          {/* Figma shows the logos as one long horizontal strip. Rendered as
              a slow continuous marquee: two identical copies on the track and
              a -50% shift give a seamless loop, the edge mask fades logos in
              and out, and hovering pauses it. Honors prefers-reduced-motion
              (see .animate-marquee in globals.css). */}
          <div className="mt-6 overflow-hidden sm:mt-9 [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
            <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
              {[0, 1].map((copy) => (
                <ul
                  key={copy}
                  aria-hidden={copy === 1}
                  className="flex shrink-0 items-center gap-x-16 pr-16"
                >
                  {[...content.trustedByLogos].reverse().map((logo, index) => (
                    <li key={index}>
                      {/* Plain <img>: client logos have no fixed aspect ratio
                          and render tiny (24px tall), so next/image's required
                          width/height and optimizer round-trip would cost more
                          than they save. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={logo}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="h-6 w-auto object-contain opacity-50 grayscale"
                      />
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </Section>
      )}

      <section
        data-header-invert
        className="relative flex h-[256px] w-full items-center justify-center overflow-hidden bg-obsidian sm:h-[45vh] sm:min-h-[320px]"
      >
        {content.ctaBackgroundImage && (
          <>
            <Image
              src={content.ctaBackgroundImage}
              alt=""
              fill
              sizes="100vw"
              style={{ objectPosition: content.ctaBackgroundImagePosition }}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-obsidian/50" />
          </>
        )}
        <Link
          href="/contact"
          className="relative px-6 text-center text-base tracking-tight text-bone-white hover:underline sm:px-10 sm:text-2xl lg:px-16"
        >
          {content.ctaText}
        </Link>
      </section>

      <Footer />
    </div>
  );
}
