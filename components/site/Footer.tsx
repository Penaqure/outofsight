import { siteConfig } from "@/lib/config";
import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="border-t border-black/[.08] dark:border-white/[.1] py-8 text-sm text-zinc-600 dark:text-zinc-400">
      <Container>
        <p>
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
          reserved.
        </p>
      </Container>
    </footer>
  );
}
