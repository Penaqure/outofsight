import type { ReactNode } from "react";
import { Header } from "@/components/site/Header";

// Header is fixed/blend-mode, so it doesn't matter which page's DOM it's
// nested in — render it once here for every page. See components/site/Header.tsx.
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <Header />
      {children}
    </div>
  );
}
