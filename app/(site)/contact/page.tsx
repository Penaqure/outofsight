import { getContactsContent } from "@/lib/data/content";
import { Footer } from "@/components/site/Footer";
import { Container } from "@/components/ui/Container";

// Reads the mutable in-memory store directly, so force dynamic rendering —
// see the same note in works/page.tsx.
export const dynamic = "force-dynamic";

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

  return (
    <div className="flex flex-col bg-bone-white">
      <main className="flex h-dvh flex-col items-center justify-center text-center">
        <Container>
          <h1 className="text-4xl tracking-tight text-obsidian sm:text-5xl lg:text-[48px]">
            {contact.bodyText}
          </h1>
          <div className="mt-6 space-y-2 text-base text-obsidian/70">
            {contact.email && <p>{contact.email}</p>}
            {phone && <p>{phone}</p>}
            {contact.location && <p>{contact.location}</p>}
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
