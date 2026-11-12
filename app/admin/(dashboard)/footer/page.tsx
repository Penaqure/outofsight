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
        Everything shown in the site footer. Until you save here, Navigation
        follows the site menu and Address / Contacts follow the{" "}
        <Link href="/admin/contacts" className="underline">
          Contacts
        </Link>{" "}
        page.
      </p>
      <FooterContentForm initialContent={content} />
    </>
  );
}
