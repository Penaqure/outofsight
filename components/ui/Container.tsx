import type { ReactNode } from "react";

// Side padding scales up to the Figma design's 64px at desktop widths —
// every section (Header, Footer, Works, About, Contact) shares this so
// content lines up edge-to-edge across the site.
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full px-6 sm:px-10 lg:px-16 ${className}`}>
      {children}
    </div>
  );
}
