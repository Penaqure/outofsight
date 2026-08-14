import type { Project } from "@/types/portfolio";

// In-memory placeholder store. Swap this module for a real database layer
// (e.g. Prisma, Drizzle) once the data model is finalized — the function
// signatures below are the contract the rest of the app depends on.
let projects: Project[] = [
  {
    id: "1",
    slug: "sample-project-one",
    title: "Sample Project One",
    summary: "A short one-line summary of the first sample project.",
    description:
      "Replace this with a real case study once project details are available.",
    coverImage: "/next.svg",
    tags: ["web", "branding"],
    createdAt: new Date("2026-01-10").toISOString(),
  },
  {
    id: "2",
    slug: "sample-project-two",
    title: "Sample Project Two",
    summary: "A short one-line summary of the second sample project.",
    description:
      "Replace this with a real case study once project details are available.",
    coverImage: "/vercel.svg",
    tags: ["mobile"],
    createdAt: new Date("2026-02-20").toISOString(),
  },
];

export async function getProjects(): Promise<Project[]> {
  return [...projects].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  return projects.find((project) => project.slug === slug);
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  return projects.find((project) => project.id === id);
}

export async function createProject(
  input: Omit<Project, "id" | "createdAt">
): Promise<Project> {
  const project: Project = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  projects = [...projects, project];
  return project;
}

export async function updateProject(
  id: string,
  input: Partial<Omit<Project, "id" | "createdAt">>
): Promise<Project | undefined> {
  let updated: Project | undefined;
  projects = projects.map((project) => {
    if (project.id !== id) return project;
    updated = { ...project, ...input };
    return updated;
  });
  return updated;
}

export async function deleteProject(id: string): Promise<boolean> {
  const before = projects.length;
  projects = projects.filter((project) => project.id !== id);
  return projects.length < before;
}
