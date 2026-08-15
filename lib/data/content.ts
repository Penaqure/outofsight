import type { HomeContent } from "@/types/content";

// In-memory placeholder store, same pattern as lib/data/portfolio.ts —
// anchored on globalThis so it stays shared across Turbopack's separate
// dev-mode module graphs for Route Handlers vs Server Components.
// Swap for a real database + file storage (e.g. S3/Cloudinary for the
// background video) once persistence is wired up.
declare global {
  var __homeContent: HomeContent | undefined;
}

function store(): HomeContent {
  if (!globalThis.__homeContent) {
    globalThis.__homeContent = {
      heroText:
        "From the vastness of its enchanting desert to the vibrancy of its dazzling cities",
      displayMode: "logo-only",
      backgroundVideoName: null,
      logoFileName: "outofsight_logo_only.png",
    };
  }
  return globalThis.__homeContent;
}

export async function getHomeContent(): Promise<HomeContent> {
  return store();
}

export async function updateHomeContent(
  input: Partial<HomeContent>
): Promise<HomeContent> {
  globalThis.__homeContent = { ...store(), ...input };
  return globalThis.__homeContent;
}
