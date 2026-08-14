import { siteConfig } from "@/lib/config";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export default function AboutPage() {
  return (
    <Section className="pt-24">
      <Container>
        <h1 className="text-3xl font-semibold tracking-tight">
          About {siteConfig.name}
        </h1>
        <p className="mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">
          Placeholder about-page copy. Replace with the company&apos;s story,
          mission, and team once details are available.
        </p>
      </Container>
    </Section>
  );
}
