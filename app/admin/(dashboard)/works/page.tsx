import Link from "next/link";
import { getProjects } from "@/lib/data/portfolio";
import { LinkButton } from "@/components/ui/Button";
import { DeleteProjectButton } from "./DeleteProjectButton";

export default async function AdminWorksPage() {
  const projects = await getProjects();

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Works</h1>
        <LinkButton href="/admin/works/new">New Project</LinkButton>
      </div>
      <div className="mt-6 divide-y divide-black/[.08] dark:divide-white/[.1]">
        {projects.map((project) => (
          <div key={project.id} className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">{project.title}</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                /{project.slug}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href={`/admin/works/${project.id}`}
                className="text-sm hover:underline"
              >
                Edit
              </Link>
              <DeleteProjectButton id={project.id} />
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <p className="py-6 text-sm text-zinc-600 dark:text-zinc-400">
            No projects yet.
          </p>
        )}
      </div>
    </>
  );
}
