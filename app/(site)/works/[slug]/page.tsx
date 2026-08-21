import { notFound } from "next/navigation";
import Link from "next/link";
import { getProjectBySlug, getProjects } from "@/lib/data/portfolio";
import { getWorksContent } from "@/lib/data/content";
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
  const filmstrip = project.photos.slice(0, 4);
  const [allProjects, worksContent] = await Promise.all([
    getProjects(),
    getWorksContent(),
  ]);
  const otherProjects = allProjects.filter((p) => p.id !== project.id);

  return (
    <div className="flex min-h-screen flex-col bg-bone-white">
      <Container>
        <div className="grid grid-cols-1 gap-10 pt-32 pb-16 sm:grid-cols-[1fr_2fr] sm:gap-16 sm:pt-40 sm:pb-24">
          <div className="flex flex-col gap-8">
            <div>
              <h1 className="font-heading text-2xl tracking-tight text-obsidian uppercase">
                {project.title}
              </h1>
              <p className="mt-4 text-sm leading-[1.3] tracking-tight text-obsidian/70">
                {project.description}
              </p>
            </div>
            {project.credits && (
              <div>
                <p className="font-heading text-base tracking-tight text-obsidian">
                  Credits
                </p>
                <p className="mt-4 whitespace-pre-line text-sm leading-[1.3] tracking-tight text-obsidian/70">
                  {project.credits}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="relative aspect-[1341/540] w-full overflow-hidden bg-obsidian/[.05]">
              {heroImage && (
                <img
                  src={heroImage}
                  alt=""
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            {filmstrip.length > 0 && (
              <div className="grid grid-cols-4 gap-2.5">
                {filmstrip.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt=""
                    className="aspect-square w-full object-cover"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>

      <Container>
        <div className="grid grid-cols-1 gap-6 pb-16 sm:grid-cols-[1fr_2fr] sm:gap-10">
          <h2 className="font-heading text-2xl tracking-tight text-obsidian uppercase">
            Similar
            <br />
            Videos
          </h2>
          <p className="text-sm leading-[1.3] tracking-tight text-obsidian/70">
            {worksContent.heroDescription}
          </p>
        </div>
      </Container>

      {otherProjects.length > 0 && (
        <Container className="pb-6">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
            {otherProjects.map((p) => (
              <Link
                key={p.id}
                href={`/works/${p.slug}`}
                className="group relative aspect-square overflow-hidden bg-obsidian/[.05]"
              >
                {p.thumbnailImage ? (
                  <img
                    src={p.thumbnailImage}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <span className="flex h-full items-center justify-center px-4 text-center text-sm text-obsidian/40">
                    {p.title}
                  </span>
                )}
                <div className="absolute inset-0 bg-obsidian/0 transition-colors group-hover:bg-obsidian/40" />
                <p className="absolute bottom-4 left-4 text-sm text-bone-white opacity-0 transition-opacity group-hover:opacity-100">
                  {p.title}
                </p>
              </Link>
            ))}
          </div>
        </Container>
      )}

      <Footer />
    </div>
  );
}
