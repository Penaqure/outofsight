import Link from "next/link";
import { getProjects } from "@/lib/data/portfolio";
import { getWorksContent } from "@/lib/data/content";
import { Footer } from "@/components/site/Footer";
import { Container } from "@/components/ui/Container";

// Reads the mutable in-memory store directly, so force dynamic rendering —
// otherwise admin edits wouldn't show up here without a rebuild.
export const dynamic = "force-dynamic";

// Hero image/heading/description come from the admin Works editor — see
// lib/data/content.ts.
export default async function WorksPage() {
  const [projects, content] = await Promise.all([
    getProjects(),
    getWorksContent(),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-bone-white">
      <section className="relative h-[50vh] min-h-[400px] w-full overflow-hidden bg-obsidian">
        {content.heroImage && (
          <img
            src={content.heroImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-obsidian/30" />
      </section>

      <Container>
        <div className="grid grid-cols-1 gap-6 py-16 sm:grid-cols-[1fr_2fr] sm:gap-10 sm:py-24">
          <h1 className="font-heading text-2xl tracking-tight text-obsidian uppercase">
            {content.heroHeading}
          </h1>
          <p className="text-sm leading-[1.3] tracking-tight text-obsidian/70">
            {content.heroDescription}
          </p>
        </div>
      </Container>

      <Container className="pb-6">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
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
      </Container>

      <Footer />
    </div>
  );
}
