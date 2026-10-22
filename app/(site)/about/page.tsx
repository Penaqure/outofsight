import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAboutContent } from "@/lib/data/content";
import { metaDescription } from "@/lib/seo";
import { Footer } from "@/components/site/Footer";
import { TeamMembers } from "@/components/site/TeamMembers";
import { TrustedByMarquee } from "@/components/site/TrustedBy";
import { Container } from "@/components/ui/Container";

// Reads the mutable in-memory store directly, so force dynamic rendering —
// see the same note in works/page.tsx.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getAboutContent();
  const description = metaDescription(content.introText || content.storyText);
  return {
    title: "About Us",
    description,
    alternates: { canonical: "/about" },
    openGraph: {
      title: `About Us — OUTOFSIGHT`,
      description,
      url: "/about",
      images: content.heroImage ? [{ url: content.heroImage }] : undefined,
    },
  };
}

// Every section here (hero image, intro, story, founder's message, team
// members, process cards, Trusted By logos, CTA) comes from the admin About
// editor — see lib/data/content.ts. Layout follows the Figma "Website
// Desktop. v2" About frame.
export default async function AboutPage() {
  const content = await getAboutContent();

  return (
    <div className="flex flex-col bg-bone-white">
      <section
        {...(content.heroImage ? { "data-header-invert": true } : {})}
        className="relative flex h-[450px] w-full items-center justify-center overflow-hidden bg-bone-white sm:h-[50vh] sm:min-h-[420px]"
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
            <div className="absolute inset-0 bg-obsidian/20" />
            <h1 className="relative max-w-4xl px-6 text-center text-xl tracking-tight text-bone-white sm:px-10 sm:text-4xl md:text-5xl lg:px-16 lg:text-[48px]">
              {content.heroHeadline}
            </h1>
          </>
        )}
      </section>

      {content.introText && (
        <Container className="py-16 sm:py-[126px]">
          <p className="text-center text-xs leading-[1.3] tracking-tight whitespace-pre-line text-obsidian sm:text-base">
            {content.introText}
          </p>
        </Container>
      )}

      {(content.storyText || content.storyImage) && (
        // Image bleeds to the right screen edge here (matches Figma) — only
        // the text column keeps the standard left padding, so this section
        // is NOT wrapped in <Container>, unlike the rest of the page.
        // Same 544/1376 column split as the Founder's Message below, so this
        // image's bottom-left corner meets the founder portrait's top-right
        // corner exactly (Figma: 64 padding + 444 text + 36 gap = 544). The
        // minmax(0, …) stops content from nudging the split. Side by side
        // only from lg: any narrower and the text outgrows the image's
        // height, pushing the portrait down and breaking the corner touch.
        // Below lg: image full-bleed on top, text below.
        <section className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,544fr)_minmax(0,1376fr)] lg:items-start lg:gap-0">
          <p className="order-2 px-6 text-xs leading-[1.3] tracking-tight whitespace-pre-line text-obsidian sm:px-10 sm:text-base lg:order-none lg:mr-9 lg:pr-0 lg:pl-16">
            {content.storyText}
          </p>
          <div className="relative order-1 aspect-[412/190] w-full overflow-hidden bg-obsidian/[.05] lg:order-none lg:aspect-[1376/633]">
            {content.storyImage && (
              <Image
                src={content.storyImage}
                alt=""
                fill
                sizes="(min-width: 1024px) 72vw, 100vw"
                style={{ objectPosition: content.storyImagePosition }}
                className="object-cover"
              />
            )}
          </div>
        </section>
      )}

      {(content.founderMessage || content.founderImage) && (
        // Founder's Message: portrait bleeds to the LEFT edge, meeting the
        // story image corner-to-corner above it (no gap, as in Figma).
        // Heading top-right, message + signature bottom-right.
        <section className="mt-10 flex flex-col gap-6 pb-16 sm:grid sm:grid-cols-[minmax(0,544fr)_minmax(0,1376fr)] sm:gap-0 sm:pb-24 lg:mt-0">
          <div className="relative aspect-[412/300] w-full overflow-hidden bg-obsidian/[.05] sm:aspect-[544/676]">
            {content.founderImage && (
              <Image
                src={content.founderImage}
                alt={content.founderName}
                fill
                sizes="(min-width: 640px) 28vw, 100vw"
                style={{ objectPosition: content.founderImagePosition }}
                className="object-cover"
              />
            )}
          </div>
          <div className="flex flex-col gap-6 px-6 sm:items-end sm:justify-between sm:pt-16 sm:pr-10 sm:pl-10 sm:text-right lg:pr-16">
            <h2 className="font-heading text-base leading-none font-semibold tracking-tight text-obsidian sm:text-2xl">
              {content.founderHeading}
            </h2>
            <div className="flex max-w-[976px] flex-col gap-4 text-xs leading-[1.23] tracking-tight text-obsidian sm:gap-8 sm:text-base">
              <p className="whitespace-pre-line">{content.founderMessage}</p>
              {content.founderName && <p>{content.founderName}</p>}
            </div>
          </div>
        </section>
      )}

      {content.teamMembers.length > 0 && (
        <Container className="pb-16 sm:py-24">
          <TeamMembers intro={content.teamIntro} members={content.teamMembers} />
        </Container>
      )}

      <Container className="pb-10 sm:py-24">
        <div className="grid gap-8 sm:grid-cols-3 sm:gap-16">
          {content.processCards.map((card) => (
            <div key={card.title}>
              <p className="font-heading text-base leading-none font-semibold tracking-tight text-obsidian sm:text-2xl">
                {card.title}
              </p>
              <p className="mt-3 text-xs leading-[1.23] tracking-tight text-obsidian sm:mt-4 sm:text-base">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </Container>

      <TrustedByMarquee logos={content.trustedByLogos} />

      <section
        data-header-invert
        className="relative flex h-[256px] w-full items-center justify-center overflow-hidden bg-obsidian sm:h-[372px]"
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
            <div className="absolute inset-0 bg-obsidian/30" />
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
