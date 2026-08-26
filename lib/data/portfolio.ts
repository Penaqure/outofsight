import type { Project } from "@/types/portfolio";
import { slugify } from "@/lib/slugify";
import { prisma } from "@/lib/prisma";

// Postgres-backed now (see prisma/schema.prisma). Prisma's `createdAt` is a
// native DateTime (JS Date at runtime) — the Project type keeps it as an
// ISO string like before, so every row is converted on the way out.
function toProject(row: {
  id: string;
  slug: string;
  title: string;
  description: string;
  credits: string;
  thumbnailImage: string | null;
  thumbnailImagePosition: string;
  thumbnailLabel: string | null;
  videoName: string | null;
  videoLabel: string | null;
  videoPreviewImage: string | null;
  videoPreviewImagePosition: string;
  photos: string[];
  tags: string[];
  createdAt: Date;
}): Project {
  return { ...row, createdAt: row.createdAt.toISOString() };
}

const seedProjects = [
  {
    slug: "sample-project-one",
    title: "Sample Project One",
    description:
      "Replace this with a real case study once project details are available.",
    credits: "",
    thumbnailImage: null,
    thumbnailImagePosition: "50% 50%",
    thumbnailLabel: null,
    videoName: null,
    videoLabel: null,
    videoPreviewImage: null,
    videoPreviewImagePosition: "50% 50%",
    photos: [],
    tags: ["web", "branding"],
    createdAt: new Date("2026-01-10"),
  },
  {
    slug: "sample-project-two",
    title: "Sample Project Two",
    description:
      "Replace this with a real case study once project details are available.",
    credits: "",
    thumbnailImage: null,
    thumbnailImagePosition: "50% 50%",
    thumbnailLabel: null,
    videoName: null,
    videoLabel: null,
    videoPreviewImage: null,
    videoPreviewImagePosition: "50% 50%",
    photos: [],
    tags: ["mobile"],
    createdAt: new Date("2026-02-20"),
  },
];

// Seeds the two sample projects on first run only (table empty). Safe to
// call on every read — it's a no-op once any project exists.
async function ensureSeeded(): Promise<void> {
  const count = await prisma.project.count();
  if (count > 0) return;
  await prisma.project.createMany({ data: seedProjects });
}

export async function getProjects(): Promise<Project[]> {
  await ensureSeeded();
  const rows = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toProject);
}

export async function getProjectBySlug(
  slug: string
): Promise<Project | undefined> {
  await ensureSeeded();
  const row = await prisma.project.findUnique({ where: { slug } });
  return row ? toProject(row) : undefined;
}

export async function getProjectById(
  id: string
): Promise<Project | undefined> {
  const row = await prisma.project.findUnique({ where: { id } });
  return row ? toProject(row) : undefined;
}

async function uniqueSlug(title: string): Promise<string> {
  const base = slugify(title) || "untitled";
  let candidate = base;
  let suffix = 2;
  while (await prisma.project.findUnique({ where: { slug: candidate } })) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}

export async function createProject(
  input: Omit<Project, "id" | "createdAt" | "slug">
): Promise<Project> {
  const slug = await uniqueSlug(input.title);
  const row = await prisma.project.create({ data: { ...input, slug } });
  return toProject(row);
}

export async function updateProject(
  id: string,
  input: Partial<Omit<Project, "id" | "createdAt" | "slug">>
): Promise<Project | undefined> {
  try {
    const row = await prisma.project.update({ where: { id }, data: input });
    return toProject(row);
  } catch {
    return undefined;
  }
}

export async function deleteProject(id: string): Promise<boolean> {
  try {
    await prisma.project.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}
