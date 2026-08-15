import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/data/portfolio";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

// Reads the mutable in-memory store directly, so force dynamic rendering —
// see the same note in works/page.tsx.
export const dynamic = "force-dynamic";

export default async function ProjectPage(
  props: PageProps<"/works/[slug]">
) {
  const { slug } = await props.params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <>
    <Header />
    <main className="flex-1">
    <Section className="pt-24">
      <Container>
        {project.thumbnailImage && (
          <img
            src={project.thumbnailImage}
            alt=""
            className="mb-8 aspect-video w-full rounded-lg object-cover"
          />
        )}
        <h1 className="text-3xl font-semibold tracking-tight">
          {project.title}
        </h1>
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
        <p className="mt-6 max-w-2xl text-zinc-600 dark:text-zinc-400">
          {project.description}
        </p>
        {project.photos.length > 0 && (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {project.photos.map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt=""
                className="aspect-square w-full rounded-lg object-cover"
              />
            ))}
          </div>
        )}
        {project.credits && (
          <p className="mt-8 whitespace-pre-line text-sm text-zinc-500 dark:text-zinc-500">
            {project.credits}
          </p>
        )}
      </Container>
    </Section>
    </main>
    <Footer />
    </>
  );
}
