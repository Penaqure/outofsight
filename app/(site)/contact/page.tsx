import type { Metadata } from "next";
import { getContactsContent } from "@/lib/data/content";
import { metaDescription, pageMetadata } from "@/lib/seo";
import { Footer } from "@/components/site/Footer";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { RevealItem, RevealWords, afterWords } from "@/components/ui/RevealText";

// Reads the mutable in-memory store directly, so force dynamic rendering —
// see the same note in works/page.tsx.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const contact = await getContactsContent();
  const description = metaDescription(
    `${contact.bodyText} ${contact.email} ${contact.location}`.trim()
  );
  return pageMetadata({ title: "Contact", description, path: "/contact" });
}

// The hero fills exactly one viewport (h-dvh), same treatment as Home —
// but unlike Home, this page also has a Footer, so the outer wrapper is
// NOT h-dvh/overflow-hidden: that combination squeezed the Footer into
// (or clipped it out of) the same single viewport and blocked scrolling
// entirely. Here the page scrolls normally and the Footer only comes into
// view once the hero viewport has been scrolled past.
export default async function ContactPage() {
  const contact = await getContactsContent();
  const phone =
    contact.countryCode && contact.phoneNumber
      ? `${contact.countryCode} ${contact.phoneNumber}`
      : null;

  const infoLines = [contact.email, phone, contact.location].filter(Boolean);

  // The heading rises in word by word, then the info lines fade up — the
  // reference entrance every other page reuses (components/ui/RevealText).
  return (
    <div className="flex flex-col bg-bone-white">
      <main className="flex h-dvh flex-col items-center justify-center text-center">
        <Reveal>
          <Container>
            <h1 className="text-4xl tracking-tight text-obsidian sm:text-5xl lg:text-[48px]">
              <RevealWords text={contact.bodyText} />
            </h1>
            <div className="mt-6 space-y-2 text-base text-obsidian/70">
              {infoLines.map((line, i) => (
                <RevealItem
                  key={line}
                  as="p"
                  startMs={afterWords(contact.bodyText)}
                  index={i}
                >
                  {line}
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
