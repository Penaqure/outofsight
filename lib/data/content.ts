import type { HomeContent } from "@/types/content";

// In-memory placeholder store, same pattern as lib/data/portfolio.ts.
// Swap for a real database + file storage (e.g. S3/Cloudinary for the
// background video) once persistence is wired up.
let homeContent: HomeContent = {
  heroText:
    "From the vastness of its enchanting desert to the vibrancy of its dazzling cities",
  displayMode: "logo-only",
  backgroundVideoName: null,
  logoFileName: "outofsight_logo_only.png",
};

export async function getHomeContent(): Promise<HomeContent> {
  return homeContent;
}

export async function updateHomeContent(
  input: Partial<HomeContent>
): Promise<HomeContent> {
  homeContent = { ...homeContent, ...input };
  return homeContent;
}
