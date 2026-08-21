import { getContactsContent } from "@/lib/data/content";
import { ContactsContentForm } from "./ContactsContentForm";

// Reads the mutable in-memory store directly, so force dynamic rendering —
// see the same note in admin/works/page.tsx.
export const dynamic = "force-dynamic";

export default async function AdminContactsPage() {
  const content = await getContactsContent();

  return (
    <>
      <h1 className="text-2xl tracking-tight text-obsidian">Contacts</h1>
      <p className="mt-1 text-base text-obsidian">{content.bodyText}</p>
      <ContactsContentForm initialContent={content} />
    </>
  );
}
