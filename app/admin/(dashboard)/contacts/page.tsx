import { getContactsContent } from "@/lib/data/content";
import { ContactsContentForm } from "./ContactsContentForm";

// Reads the mutable in-memory store directly, so force dynamic rendering —
// see the same note in admin/works/page.tsx.
export const dynamic = "force-dynamic";

export default async function AdminContactsPage() {
  const content = await getContactsContent();

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Contacts</h1>
      <p className="mt-1 text-sm text-obsidian/60">{content.bodyText}</p>
      <ContactsContentForm initialContent={content} />
    </>
  );
}
