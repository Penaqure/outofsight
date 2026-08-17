import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/data/portfolio";
import { Footer } from "@/components/site/Footer";
import { Container } from "@/components/ui/Container";

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

  const heroImage = project.videoPreviewImage ?? project.thumbnailImage;

  return (
    <div className="flex min-h-screen flex-col bg-obsidian">
      <section className="relative h-[45vh] min-h-[320px] w-full overflow-hidden bg-obsidian">
        {heroImage && (
          <img
            src={heroImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-obsidian/40" />
      </section>

      <section className="bg-obsidian py-16">
        <Container>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-[1fr_2fr]">
            <h1 className="text-xl font-semibold uppercase tracking-tight text-bone-white">
              {project.title}
            </h1>
            <p className="text-sm text-bone-white/50">{project.description}</p>
          </div>
        </Container>
      </section>

      {project.photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4">
          {project.photos.map((photo, index) => (
            <img
              key={index}
              src={photo}
              alt=""
              className="aspect-square w-full object-cover"
            />
          ))}
        </div>
      )}

      {project.credits && (
        <section className="bg-obsidian py-10">
          <Container>
            <p className="whitespace-pre-line text-sm text-bone-white/40">
              {project.credits}
            </p>
          </Container>
        </section>
      )}

      <Footer />
    </div>
  );
}
