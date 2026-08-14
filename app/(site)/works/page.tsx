import Link from "next/link";
import { getProjects } from "@/lib/data/portfolio";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export default async function WorksPage() {
  const projects = await getProjects();

  return (
    <Section className="pt-24">
      <Container>
        <h1 className="text-3xl font-semibold tracking-tight">Works</h1>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/works/${project.slug}`}
              className="rounded-lg border border-black/[.08] p-5 transition-colors hover:bg-black/[.03] dark:border-white/[.1] dark:hover:bg-white/[.05]"
            >
              <h2 className="font-medium">{project.title}</h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {project.summary}
              </p>
              <div className="mt-3 flex gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-black/[.05] px-2.5 py-0.5 text-xs dark:bg-white/[.1]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
