import type { ReactNode } from "react";
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

// Label + link-list block. Stacks (label above list) on mobile to match the
// two-column Figma mobile footer; on sm+ the label sits inline to the left
// of the list with a fixed 16px gap (Figma), whatever the label's length.
function FooterColumn({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
      <p className="text-left whitespace-nowrap text-bone-white/40">
        {label}
      </p>
      {children}
    </div>
  );
}

function BackToTop({ className = "" }: { className?: string }) {
  return (
    <a
      href="#top"
      aria-label="Back to top"
      className={`items-center justify-center text-bone-white/60 transition-colors hover:text-bone-white ${className}`}
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
  );
}

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
    <footer
      data-header-invert
      className="bg-obsidian py-10 text-bone-white sm:py-16"
    >
      <Container>
        {/* Logo left, menus right on one row from xl (Figma: 64px page
            padding; 96px between groups on wide screens). Narrower, the logo
            sits above the menus instead of the menus half-wrapping under
            it. Mobile: logo left, back-to-top arrow top-right; wider, the
            arrow ends the menu row. */}
        <div className="flex flex-col gap-10 xl:flex-row xl:items-start xl:justify-between xl:gap-16">
          <div className="flex items-start justify-between sm:block">
            <Image
              src={logo}
              alt={siteConfig.name}
              className="h-4 w-auto invert sm:h-6"
            />
            <BackToTop className="inline-flex sm:hidden" />
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 text-xs sm:flex sm:flex-wrap sm:items-start sm:gap-x-12 sm:gap-y-10 xl:flex-nowrap xl:gap-x-16 2xl:gap-x-24">
            <FooterColumn label="Navigation">
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
            </FooterColumn>

            <FooterColumn label="Media">
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
            </FooterColumn>

            {contact.location && (
              <FooterColumn label="Address">
                <p className="max-w-[220px] text-left whitespace-pre-line text-bone-white/80">
                  {contact.location}
                </p>
              </FooterColumn>
            )}

            <FooterColumn label="Contacts">
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
            </FooterColumn>

            <BackToTop className="hidden sm:inline-flex" />
          </div>
        </div>
      </Container>
    </footer>
  );
}
