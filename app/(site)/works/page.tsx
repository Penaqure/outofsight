import Link from "next/link";
import { getProjects } from "@/lib/data/portfolio";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

// Reads the mutable in-memory store directly, so force dynamic rendering —
// otherwise admin edits wouldn't show up here without a rebuild.
export const dynamic = "force-dynamic";

export default async function WorksPage() {
  const projects = await getProjects();

  return (
    <>
    <Header />
    <main className="flex-1">
    <Section className="pt-24">
      <Container>
        <h1 className="text-3xl font-semibold tracking-tight">Works</h1>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/works/${project.slug}`}
              className="overflow-hidden rounded-lg border border-black/[.08] transition-colors hover:bg-black/[.03] dark:border-white/[.1] dark:hover:bg-white/[.05]"
            >
              {project.thumbnailImage && (
                <img
                  src={project.thumbnailImage}
                  alt=""
                  className="aspect-video w-full object-cover"
                />
              )}
              <div className="p-5">
                <h2 className="font-medium">{project.title}</h2>
                <p className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {project.description}
                </p>
                <div className="mt-3 flex gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-sage/20 px-2.5 py-0.5 text-xs text-obsidian dark:bg-sage/25 dark:text-bone-white"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
    </main>
    <Footer />
    </>
  );
}
