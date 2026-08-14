import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { Container } from "@/components/ui/Container";

export function Header() {
  return (
    <header className="border-b border-black/[.08] dark:border-white/[.1]">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="font-semibold tracking-tight">
            {siteConfig.name}
          </Link>
          <nav className="flex gap-6 text-sm">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-zinc-600 hover:text-foreground dark:text-zinc-400"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </Container>
    </header>
  );
}
