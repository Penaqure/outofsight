import { getHomeContent } from "@/lib/data/content";
import { currentAdminUser } from "@/lib/config";
import { getTimeOfDayGreeting } from "@/lib/greeting";
import { HomeContentForm } from "./HomeContentForm";

// Reads the mutable in-memory store directly, so force dynamic rendering —
// see the same note in admin/works/page.tsx.
export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const content = await getHomeContent();
  const greeting = getTimeOfDayGreeting();

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">
        {greeting} {currentAdminUser.name}
      </h1>
      <div className="mt-8">
        <h2 className="text-lg font-semibold tracking-tight">Home</h2>
        <p className="mt-1 text-sm text-obsidian/60">{content.heroText}</p>
      </div>
      <HomeContentForm initialContent={content} />
    </>
  );
}
