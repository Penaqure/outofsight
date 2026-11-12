import Link from "next/link";
import { getFooterContent } from "@/lib/data/content";
import { FooterContentForm } from "./FooterContentForm";

// Reads the database directly, so force dynamic rendering — see the same
// note in admin/works/page.tsx.
export const dynamic = "force-dynamic";

export default async function AdminFooterPage() {
  const content = await getFooterContent();

  return (
    <>
      <h1 className="text-2xl tracking-tight text-obsidian">Footer</h1>
      <p className="mt-1 text-base text-obsidian">
        Links shown under &ldquo;Media&rdquo; in the site footer. The address
        and Phone / Email / WhatsApp links come from{" "}
        <Link href="/admin/contacts" className="underline">
          Contacts
        </Link>
        ; Navigation follows the site menu.
      </p>
      <FooterContentForm initialContent={content} />
    </>
  );
}
