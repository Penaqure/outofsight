import { getProjects } from "@/lib/data/portfolio";
import { getWorksContent } from "@/lib/data/content";
import { WorksGrid } from "./WorksGrid";
import { WorksHeroForm } from "./WorksHeroForm";

// This reads the mutable in-memory store directly (no fetch/dynamic APIs),
// so Next would otherwise treat it as static and cache the render — force
// dynamic rendering so admin edits show up immediately.
export const dynamic = "force-dynamic";

export default async function AdminWorksPage() {
  const [projects, worksContent] = await Promise.all([
    getProjects(),
    getWorksContent(),
  ]);

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Works</h1>
      <div className="mt-8">
        <WorksHeroForm initialContent={worksContent} />
      </div>
      <WorksGrid projects={projects} />
    </>
  );
}
