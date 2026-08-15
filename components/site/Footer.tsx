import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/config";
import { getContactsContent } from "@/lib/data/content";
import { Container } from "@/components/ui/Container";
import logo from "@/public/logo/outofsight-logo.png";

const mediaLinks = [
  { label: "LinkedIn", href: "#" },
  { label: "Behance", href: "#" },
  { label: "Dribbble", href: "#" },
];

// Navigation reuses siteConfig.nav; Phone/Email/WhatsApp reuse the same
// admin-managed contact details shown on /contact — see lib/data/content.ts.
// Media links have no admin-managed source yet, so they're static for now.
export async function Footer() {
  const contact = await getContactsContent();
  const phone =
    contact.countryCode && contact.phoneNumber
      ? `${contact.countryCode} ${contact.phoneNumber}`
      : null;
  const whatsappNumber = phone?.replace(/[^\d]/g, "");

  return (
    <footer className="bg-obsidian px-6 py-12 text-bone-white">
      <Container>
        <div className="flex flex-wrap items-start justify-between gap-12">
          <Image
            src={logo}
            alt={siteConfig.name}
            className="h-6 w-auto invert"
          />

          <div className="flex flex-wrap items-start gap-12">
          <div className="flex flex-wrap gap-16 text-sm">
            <div>
              <p className="mb-3 text-xs uppercase tracking-wider text-bone-white/40">
                Navigation
              </p>
              <ul className="space-y-2">
                {siteConfig.nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-bone-white/80 hover:text-bone-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mb-3 text-xs uppercase tracking-wider text-bone-white/40">
                Media
              </p>
              <ul className="space-y-2">
                {mediaLinks.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="text-bone-white/80 hover:text-bone-white"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {contact.location && (
              <div>
                <p className="mb-3 text-xs uppercase tracking-wider text-bone-white/40">
                  Address
                </p>
                <p className="text-bone-white/80">{contact.location}</p>
              </div>
            )}

            <div>
              <p className="mb-3 text-xs uppercase tracking-wider text-bone-white/40">
                Contacts
              </p>
              <ul className="space-y-2">
                {phone && (
                  <li>
                    <a
                      href={`tel:${phone}`}
                      className="text-bone-white/80 hover:text-bone-white"
                    >
                      Phone
                    </a>
                  </li>
                )}
                {contact.email && (
                  <li>
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-bone-white/80 hover:text-bone-white"
                    >
                      Email
                    </a>
                  </li>
                )}
                {whatsappNumber && (
                  <li>
                    <a
                      href={`https://wa.me/${whatsappNumber}`}
                      className="text-bone-white/80 hover:text-bone-white"
                    >
                      WhatsApp
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <a
            href="#top"
            aria-label="Back to top"
            className="text-bone-white/60 hover:text-bone-white"
          >
            ↑
          </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
