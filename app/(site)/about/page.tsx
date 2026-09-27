import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAboutContent } from "@/lib/data/content";
import { metaDescription } from "@/lib/seo";
import { Footer } from "@/components/site/Footer";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

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

// Every section here (hero image, intro, story, team members, process
// cards, CTA) comes from the admin About editor — see lib/data/content.ts.
// The Trusted By logos are edited there too but render on the Works page.
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
        // is NOT wrapped in <Container>, unlike the rest of the page.
        <Section>
          {/* Mobile (Figma): image full-bleed on top, text below. Desktop:
              narrow text column left, image bleeding to the right edge. */}
          <div className="flex flex-col gap-6 sm:grid sm:grid-cols-[1fr_2fr] sm:items-start sm:gap-0">
            <p className="order-2 px-6 text-xs leading-[1.23] text-obsidian/80 sm:order-none sm:mr-9 sm:pr-0 sm:pl-10 sm:text-base sm:leading-[1.3] lg:pl-16">
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

      {content.teamMembers.length > 0 && (
        <Section className="pt-0">
          <Container>
            <p className="font-heading text-base font-semibold tracking-tight text-obsidian sm:text-2xl">
              Team Members
            </p>
            <ul className="mt-6 grid grid-cols-2 gap-2.5 sm:mt-9 sm:grid-cols-3">
              {content.teamMembers.map((member, index) => {
                const spaceAt = member.name.indexOf(" ");
                return (
                  // Figma "Component 1": black & white at rest; on hover the
                  // photo fades to full colour and the name/position appear
                  // bottom-right. tabIndex makes it focusable so keyboard and
                  // touch users (a tap focuses it) get the same reveal.
                  <li
                    key={index}
                    tabIndex={0}
                    className="group relative aspect-[3/2] overflow-hidden bg-obsidian/[.05] outline-none"
                  >
                    {member.photo && (
                      <Image
                        src={member.photo}
                        alt={member.name}
                        fill
                        sizes="(min-width: 640px) 33vw, 50vw"
                        style={{ objectPosition: member.photoPosition }}
                        className="object-cover grayscale transition-[filter] duration-500 group-hover:grayscale-0 group-focus-within:grayscale-0"
                      />
                    )}
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-end justify-end bg-gradient-to-t from-obsidian/40 via-transparent to-transparent p-3 text-right opacity-0 transition-opacity duration-500 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100 sm:p-5">
                      {member.name && (
                        <p className="font-heading text-sm leading-tight font-semibold tracking-tight text-bone-white sm:text-xl">
                          {spaceAt > 0 ? (
                            <>
                              {member.name.slice(0, spaceAt)}
                              <br />
                              {member.name.slice(spaceAt + 1)}
                            </>
                          ) : (
                            member.name
                          )}
                        </p>
                      )}
                      {member.position && (
                        <p className="mt-2 text-[10px] uppercase tracking-wider text-bone-white/80 sm:mt-3 sm:text-xs">
                          {member.position}
                        </p>
                      )}
                      {(member.instagramUrl || member.linkedinUrl) && (
                        <div className="mt-2 flex gap-2 text-[10px] text-bone-white/80 sm:text-xs">
                          {member.instagramUrl && (
                            <a
                              href={member.instagramUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${member.name || "Team member"} on Instagram`}
                              className="hover:text-bone-white hover:underline"
                            >
                              Instagram
                            </a>
                          )}
                          {member.instagramUrl && member.linkedinUrl && (
                            <span className="text-bone-white/40">|</span>
                          )}
                          {member.linkedinUrl && (
                            <a
                              href={member.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${member.name || "Team member"} on LinkedIn`}
                              className="hover:text-bone-white hover:underline"
                            >
                              LinkedIn
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </Container>
        </Section>
      )}

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
