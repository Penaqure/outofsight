import type { Metadata } from "next";
import type { ReactNode } from "react";

// Keep every admin page out of search results. robots.txt already disallows
// /admin, but that only stops crawling — a page linked from elsewhere can
// still be indexed unless it says noindex itself.
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return children;
}
