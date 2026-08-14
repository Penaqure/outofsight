import Link from "next/link";
import { getProjects } from "@/lib/data/portfolio";
import { siteConfig } from "@/lib/config";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";

export default async function HomePage() {
  const projects = (await getProjects()).slice(0, 3);

  return (
    <>
      <Section className="pt-24 sm:pt-32">
        <Container>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            {siteConfig.name}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
            {siteConfig.tagline}
          </p>
          <div className="mt-8 flex gap-4">
            <LinkButton href="/portfolio">View Portfolio</LinkButton>
            <LinkButton href="/contact" variant="secondary">
              Get in Touch
            </LinkButton>
          </div>
        </Container>
      </Section>

      <Section className="border-t border-black/[.08] dark:border-white/[.1]">
        <Container>
          <h2 className="text-2xl font-semibold tracking-tight">
            Featured Work
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/portfolio/${project.slug}`}
                className="rounded-lg border border-black/[.08] p-5 transition-colors hover:bg-black/[.03] dark:border-white/[.1] dark:hover:bg-white/[.05]"
              >
                <h3 className="font-medium">{project.title}</h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {project.summary}
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
