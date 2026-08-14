import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/data/portfolio";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export default async function ProjectPage(
  props: PageProps<"/works/[slug]">
) {
  const { slug } = await props.params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <Section className="pt-24">
      <Container>
        <h1 className="text-3xl font-semibold tracking-tight">
          {project.title}
        </h1>
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
        <p className="mt-6 max-w-2xl text-zinc-600 dark:text-zinc-400">
          {project.description}
        </p>
      </Container>
    </Section>
  );
}
