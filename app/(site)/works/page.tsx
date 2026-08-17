import Link from "next/link";
import { getProjects } from "@/lib/data/portfolio";
import { Footer } from "@/components/site/Footer";

// Reads the mutable in-memory store directly, so force dynamic rendering —
// otherwise admin edits wouldn't show up here without a rebuild.
export const dynamic = "force-dynamic";

// No mockup was given for this listing page — kept it consistent with the
// Bone White theme used on Contact/About and the edge-to-edge grid pattern
// from the /works/[slug] detail page.
export default async function WorksPage() {
  const projects = await getProjects();

  return (
    <div className="flex min-h-screen flex-col bg-bone-white">
      <section className="flex h-[30vh] min-h-[220px] w-full items-end pb-10">
        <h1 className="w-full text-center text-2xl font-semibold uppercase tracking-tight text-obsidian">
          Works
        </h1>
      </section>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/works/${project.slug}`}
            className="group relative aspect-square overflow-hidden bg-obsidian/[.05]"
          >
            {project.thumbnailImage ? (
              <img
                src={project.thumbnailImage}
                alt=""
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <span className="flex h-full items-center justify-center px-4 text-center text-sm text-obsidian/40">
                {project.title}
              </span>
            )}
            <div className="absolute inset-0 bg-obsidian/0 transition-colors group-hover:bg-obsidian/40" />
            <p className="absolute bottom-4 left-4 text-sm text-bone-white opacity-0 transition-opacity group-hover:opacity-100">
              {project.title}
            </p>
          </Link>
        ))}
      </div>

      <Footer />
    </div>
  );
}
