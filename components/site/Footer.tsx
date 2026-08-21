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
    <footer className="bg-obsidian py-16 text-bone-white">
      <Container>
        <div className="flex flex-wrap items-start justify-between gap-[96px]">
          <Image
            src={logo}
            alt={siteConfig.name}
            className="h-24 w-auto invert"
          />

          <div className="flex flex-wrap items-start gap-[96px] text-sm">
            <div className="flex items-start">
              <p className="min-w-[100px] text-left text-[11px]  tracking-[0.2em] text-bone-white/40">
                Navigation
              </p>
              <ul className="space-y-2 text-left">
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

            <div className="flex items-start">
              <p className="min-w-[100px] text-left text-[11px]  tracking-[0.2em] text-bone-white/40">
                Media
              </p>
              <ul className="space-y-2 text-left">
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
              <div className="flex items-start">
                <p className="min-w-[100px] text-left text-[11px]  tracking-[0.2em] text-bone-white/40">
                  Address
                </p>
                <p className="text-left text-bone-white/80">{contact.location}</p>
              </div>
            )}

            <div className="flex items-start">
              <p className="min-w-[100px] text-left text-[11px]  tracking-[0.2em] text-bone-white/40">
                Contacts
              </p>
              <ul className="space-y-2 text-left">
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
             <a
              href="#top"
              aria-label="Back to top"
              className="inline-flex items-center justify-center text-bone-white/60 transition-colors hover:text-bone-white"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M12 18V6" />
                <path d="m6 12 6-6 6 6" />
              </svg>
            </a>
          </div>

           
          </div>
      </Container>
    </footer>
  );
}
