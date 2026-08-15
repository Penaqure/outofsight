import { getProjects } from "@/lib/data/portfolio";
import { WorksGrid } from "./WorksGrid";

// This reads the mutable in-memory store directly (no fetch/dynamic APIs),
// so Next would otherwise treat it as static and cache the render — force
// dynamic rendering so admin edits show up immediately.
export const dynamic = "force-dynamic";

export default async function AdminWorksPage() {
  const projects = await getProjects();

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Works</h1>
      <WorksGrid projects={projects} />
    </>
  );
}
