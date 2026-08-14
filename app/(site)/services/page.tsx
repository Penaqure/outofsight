import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

const placeholderServices = [
  { title: "Service One", description: "Short description of service one." },
  { title: "Service Two", description: "Short description of service two." },
  { title: "Service Three", description: "Short description of service three." },
];

export default function ServicesPage() {
  return (
    <Section className="pt-24">
      <Container>
        <h1 className="text-3xl font-semibold tracking-tight">Services</h1>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {placeholderServices.map((service) => (
            <div
              key={service.title}
              className="rounded-lg border border-black/[.08] p-5 dark:border-white/[.1]"
            >
              <h2 className="font-medium">{service.title}</h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
