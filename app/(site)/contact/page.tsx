import { getContactsContent } from "@/lib/data/content";
import { Header } from "@/components/site/Header";
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
      <Header />
      <main className="flex flex-1 items-center justify-center text-center">
        <Container>
          <h1 className="text-3xl font-medium tracking-tight text-obsidian sm:text-4xl">
            {contact.bodyText}
          </h1>
          <div className="mt-6 space-y-1 text-sm text-obsidian/70">
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
