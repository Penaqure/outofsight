import type { ReactNode } from "react";
import { Header } from "@/components/site/Header";
import { getContactsContent } from "@/lib/data/content";
import { siteConfig } from "@/lib/config";
import { absoluteUrl, jsonLd } from "@/lib/seo";

// Header is fixed/blend-mode, so it doesn't matter which page's DOM it's
// nested in — render it once here for every page. See components/site/Header.tsx.
//
// Also renders the site-wide Organization + WebSite structured data, so
// search engines can show the brand name, logo and contact details. It lives
// here rather than the root layout so the admin pages don't carry it, and so
// it can use the admin-edited contact details.
export default async function SiteLayout({ children }: { children: ReactNode }) {
  const contact = await getContactsContent();
  const phone =
    contact.countryCode && contact.phoneNumber
      ? `${contact.countryCode} ${contact.phoneNumber}`
      : undefined;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": absoluteUrl("/#organization"),
        name: siteConfig.name,
        url: absoluteUrl("/"),
        logo: absoluteUrl("/logo/outofsight-logo.png"),
        description: siteConfig.description,
        email: contact.email || undefined,
        telephone: phone,
        address: contact.location || undefined,
        contactPoint: contact.email
          ? {
              "@type": "ContactPoint",
              contactType: "customer service",
              email: contact.email,
              telephone: phone,
            }
          : undefined,
      },
      {
        "@type": "WebSite",
        "@id": absoluteUrl("/#website"),
        url: absoluteUrl("/"),
        name: siteConfig.name,
        publisher: { "@id": absoluteUrl("/#organization") },
      },
    ],
  };

  return (
    <div className="flex min-h-full flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(structuredData)}
      />
      <Header />
      {children}
    </div>
  );
}
