import type { Metadata } from "next";
import Image from "next/image";
import { getProjects } from "@/lib/data/portfolio";
import { getWorksContent } from "@/lib/data/content";
import { metaDescription, pageMetadata, shareImage } from "@/lib/seo";
import { Footer } from "@/components/site/Footer";
import { ProjectTile } from "@/components/site/ProjectTile";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { RevealItem, RevealWords, afterWords } from "@/components/ui/RevealText";

// Reads the mutable in-memory store directly, so force dynamic rendering —
// otherwise admin edits wouldn't show up here without a rebuild.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getWorksContent();
  return pageMetadata({
    title: "Work",
    description: metaDescription(content.heroDescription),
    path: "/works",
    image: content.heroImage ? shareImage(content.heroImage, "Work") : null,
  });
}

// Hero image/heading/description come from the admin Works editor — see
// lib/data/content.ts.
export default async function WorksPage() {
  const [projects, content] = await Promise.all([
    getProjects(),
    getWorksContent(),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-bone-white">
      <section
        data-header-invert
        className="relative h-[50vh] min-h-[400px] w-full overflow-hidden bg-obsidian"
      >
        {content.heroImage && (
          <Image
            src={content.heroImage}
            alt=""
            fill
            priority
            sizes="100vw"
            style={{ objectPosition: content.heroImagePosition }}
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-obsidian/30" />
      </section>

      <Reveal>
        <Container>
          <div className="grid grid-cols-1 gap-6 pt-16 pb-16 sm:grid-cols-2 sm:gap-10 sm:pt-[126px]">
            <h1 className="font-heading text-2xl tracking-tight text-obsidian">
              <RevealWords text={content.heroHeading} />
            </h1>
            <RevealItem
              as="p"
              startMs={afterWords(content.heroHeading)}
              className="text-sm leading-[1.3] tracking-tight text-obsidian"
            >
              {content.heroDescription}
            </RevealItem>
          </div>
        </Container>
      </Reveal>

      <Container className="pb-6">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
          {projects.map((project, index) => (
            <ProjectTile key={project.id} project={project} index={index} />
          ))}
        </div>
      </Container>

      <Footer />
    </div>
  );
}
