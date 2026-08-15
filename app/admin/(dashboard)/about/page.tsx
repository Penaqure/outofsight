import { getAboutContent } from "@/lib/data/content";
import { AboutContentForm } from "./AboutContentForm";

// Reads the mutable in-memory store directly, so force dynamic rendering —
// see the same note in admin/works/page.tsx.
export const dynamic = "force-dynamic";

export default async function AdminAboutPage() {
  const content = await getAboutContent();

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">About Us</h1>
      <AboutContentForm initialContent={content} />
    </>
  );
}
