import { getContactsContent } from "@/lib/data/content";
import { Footer } from "@/components/site/Footer";
import { Container } from "@/components/ui/Container";

// Reads the mutable in-memory store directly, so force dynamic rendering —
// see the same note in works/page.tsx.
export const dynamic = "force-dynamic";

// Same full-viewport, no-scroll treatment as Home, plus the Footer and a
// Bone White background specific to this page — see app/(site)/page.tsx.
export default async function ContactPage() {
  const contact = await getContactsContent();
  const phone =
    contact.countryCode && contact.phoneNumber
      ? `${contact.countryCode} ${contact.phoneNumber}`
      : null;

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-bone-white">
      <main className="flex flex-1 items-center justify-center text-center">
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
