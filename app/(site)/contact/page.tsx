import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ContactForm } from "./ContactForm";

export default function ContactPage() {
  return (
    <Section className="pt-24">
      <Container>
        <h1 className="text-3xl font-semibold tracking-tight">Contact</h1>
        <p className="mt-4 max-w-md text-zinc-600 dark:text-zinc-400">
          Have a question or a project in mind? Send us a message.
        </p>
        <ContactForm />
      </Container>
    </Section>
  );
}
