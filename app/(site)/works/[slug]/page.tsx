import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getProjectBySlug, getProjects } from "@/lib/data/portfolio";
import { getWorksContent } from "@/lib/data/content";
import {
  absoluteUrl,
  jsonLd,
  metaDescription,
  pageMetadata,
  shareImage,
} from "@/lib/seo";
import { siteConfig } from "@/lib/config";
import { Footer } from "@/components/site/Footer";
import { ProjectTile } from "@/components/site/ProjectTile";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { RevealItem, RevealWords, afterWords } from "@/components/ui/RevealText";

// Reads the mutable in-memory store directly, so force dynamic rendering —
// see the same note in works/page.tsx.
export const dynamic = "force-dynamic";

export async function generateMetadata(
  props: PageProps<"/works/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return { title: "Project not found", robots: { index: false } };
  }

  const ogImage = project.videoPreviewImage ?? project.thumbnailImage;
  return pageMetadata({
    title: project.title,
    description: metaDescription(project.description || siteConfig.description),
    path: `/works/${project.slug}`,
    image: ogImage ? shareImage(ogImage, project.title) : null,
    type: "article",
  });
}

export default async function ProjectPage(
  props: PageProps<"/works/[slug]">
) {
  const { slug } = await props.params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const heroImage = project.videoPreviewImage ?? project.thumbnailImage;
  const heroImagePosition = project.videoPreviewImage
    ? project.videoPreviewImagePosition
    : project.thumbnailImagePosition;
  const filmstrip = project.photos.slice(0, 4);
  const [allProjects, worksContent] = await Promise.all([
    getProjects(),
    getWorksContent(),
  ]);
  const otherProjects = allProjects.filter((p) => p.id !== project.id);
  const detailsStart = afterWords(project.title);

  // Structured data: the project as a video (when there's a video and an
  // image to preview it — Google requires a thumbnail) or a creative work,
  // plus its breadcrumb trail (Home › Work › Project).
  const pageUrl = absoluteUrl(`/works/${project.slug}`);
  const work = {
    "@id": `${pageUrl}#work`,
    name: project.title,
    description: project.description || undefined,
    url: pageUrl,
    creator: { "@id": absoluteUrl("/#organization") },
  };
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      project.videoUrl && heroImage
        ? {
            "@type": "VideoObject",
            ...work,
            thumbnailUrl: absoluteUrl(heroImage),
            contentUrl: absoluteUrl(project.videoUrl),
            uploadDate: project.createdAt,
          }
        : {
            "@type": "CreativeWork",
            ...work,
            image: heroImage ? absoluteUrl(heroImage) : undefined,
            dateCreated: project.createdAt,
          },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { name: "Home", path: "/" },
          { name: "Work", path: "/works" },
          { name: project.title, path: `/works/${project.slug}` },
        ].map((crumb, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: crumb.name,
          item: absoluteUrl(crumb.path),
        })),
      },
    ],
  };

  return (
    <div className="flex min-h-screen flex-col bg-bone-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(structuredData)}
      />
      <Reveal>
        <Container>
          <div className="grid grid-cols-1 gap-10 pt-32 pb-16 sm:grid-cols-[1fr_2fr] sm:gap-16 sm:pt-40 sm:pb-24">
            <div className="flex flex-col gap-8">
              <div>
                <h1 className="font-heading text-2xl tracking-tight text-obsidian">
                  <RevealWords text={project.title} />
                </h1>
                <RevealItem
                  as="p"
                  startMs={detailsStart}
                  className="mt-4 text-sm leading-[1.3] tracking-tight text-obsidian/70"
                >
                  {project.description}
                </RevealItem>
              </div>
              {project.credits && (
                <RevealItem startMs={detailsStart} index={1}>
                  <p className="font-heading text-base tracking-tight text-obsidian">
                    Credits
                  </p>
                  <p className="mt-4 whitespace-pre-line text-sm leading-[1.3] tracking-tight text-obsidian/70">
                    {project.credits}
                  </p>
                </RevealItem>
              )}
            </div>

            <div className="flex flex-col gap-2.5">
              <RevealItem
                startMs={detailsStart}
                index={2}
                className="relative aspect-[1341/540] w-full overflow-hidden bg-obsidian/[.05]"
              >
                {project.videoUrl ? (
                  <video
                    src={project.videoUrl}
                    poster={project.videoPreviewImage ?? undefined}
                    controls
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  heroImage && (
                    <Image
                      src={heroImage}
                      alt={project.title}
                      fill
                      priority
                      sizes="(min-width: 640px) 66vw, 100vw"
                      style={{ objectPosition: heroImagePosition }}
                      className="object-cover"
                    />
                  )
                )}
              </RevealItem>
              {filmstrip.length > 0 && (
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {filmstrip.map((photo, index) => (
                    <RevealItem
                      key={index}
                      startMs={detailsStart}
                      index={3 + index}
                      className="relative aspect-square w-full overflow-hidden"
                    >
                      <Image
                        src={photo}
                        alt={`${project.title} — photo ${index + 1}`}
                        fill
                        sizes="(min-width: 640px) 17vw, 50vw"
                        className="object-cover"
                      />
                    </RevealItem>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Container>
      </Reveal>

      <Reveal>
        <Container>
          <div className="grid grid-cols-1 gap-6 pb-16 sm:grid-cols-[1fr_2fr] sm:gap-10">
            <h2 className="font-heading text-2xl tracking-tight text-obsidian">
              <RevealWords text={"Similar\nVideos"} />
            </h2>
            <RevealItem
              as="p"
              startMs={afterWords("Similar Videos")}
              className="text-sm leading-[1.3] tracking-tight text-obsidian/70"
            >
              {worksContent.heroDescription}
            </RevealItem>
          </div>
        </Container>
      </Reveal>

      {otherProjects.length > 0 && (
        <Container className="pb-6">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
            {otherProjects.map((p, index) => (
              <ProjectTile key={p.id} project={p} index={index} />
            ))}
          </div>
        </Container>
      )}

      <Footer />
    </div>
  );
}
