import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/data/portfolio";
import { getAboutContent, getWorksContent } from "@/lib/data/content";
import { absoluteUrl } from "@/lib/seo";
import { siteConfig } from "@/lib/config";

// Served at /sitemap.xml. Reads project slugs from the DB, so it can't be
// statically prerendered — force it to run per request. Includes each page's
// images (image sitemap) so they can show up in Google Images.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;

  const [projects, works, about] = await Promise.all([
    getProjects(),
    getWorksContent(),
    getAboutContent(),
  ]);
  const images = (...srcs: (string | null)[]) =>
    srcs.filter((src): src is string => Boolean(src)).map(absoluteUrl);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    {
      url: `${base}/works`,
      changeFrequency: "weekly",
      priority: 0.9,
      images: images(works.heroImage),
    },
    {
      url: `${base}/about`,
      changeFrequency: "monthly",
      priority: 0.7,
      images: images(about.heroImage, about.storyImage, about.founderImage),
    },
    { url: `${base}/contact`, changeFrequency: "yearly", priority: 0.5 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${base}/works/${project.slug}`,
    lastModified: project.createdAt,
    changeFrequency: "monthly",
    priority: 0.6,
    images: images(
      project.videoPreviewImage,
      project.thumbnailImage,
      ...project.photos
    ),
  }));

  return [...staticRoutes, ...projectRoutes];
}
