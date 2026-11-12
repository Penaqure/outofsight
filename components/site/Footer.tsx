import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/config";
import { getFooterContent } from "@/lib/data/content";
import type { FooterLink } from "@/types/content";
import { Container } from "@/components/ui/Container";
import logo from "@/public/logo/outofsight-logo.png";

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

function FooterLinks({ links }: { links: FooterLink[] }) {
  return (
    <ul className="space-y-2 text-left">
      {links.map((item, index) => {
        const className = "text-bone-white/80 hover:text-bone-white";
        // Site paths go through <Link> for client-side navigation; web
        // links open in a new tab; mailto:/tel:/# stay as plain anchors.
        if (item.url.startsWith("/")) {
          return (
            <li key={index}>
              <Link href={item.url} className={className}>
                {item.label}
              </Link>
            </li>
          );
        }
        const external = /^https?:/i.test(item.url);
        return (
          <li key={index}>
            <a
              href={item.url}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className={className}
            >
              {item.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

// Every heading, link and the address are edited on the admin Footer page
// (lib/data/content.ts → getFooterContent). Links without a URL are hidden,
// and a column with nothing left to show is dropped.
export async function Footer() {
  const footer = await getFooterContent();
  const visible = (links: FooterLink[]) => links.filter((link) => link.url);
  const navigationLinks = visible(footer.navigationLinks);
  const mediaLinks = visible(footer.mediaLinks);
  const contactLinks = visible(footer.contactLinks);

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
            {navigationLinks.length > 0 && (
              <FooterColumn label={footer.navigationLabel}>
                <FooterLinks links={navigationLinks} />
              </FooterColumn>
            )}

            {mediaLinks.length > 0 && (
              <FooterColumn label={footer.mediaLabel}>
                <FooterLinks links={mediaLinks} />
              </FooterColumn>
            )}

            {footer.address && (
              <FooterColumn label={footer.addressLabel}>
                <p className="max-w-[220px] text-left whitespace-pre-line text-bone-white/80">
                  {footer.address}
                </p>
              </FooterColumn>
            )}

            {contactLinks.length > 0 && (
              <FooterColumn label={footer.contactsLabel}>
                <FooterLinks links={contactLinks} />
              </FooterColumn>
            )}

            <BackToTop className="hidden sm:inline-flex" />
          </div>
        </div>
      </Container>
    </footer>
  );
}
