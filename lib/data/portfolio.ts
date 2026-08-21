import type { Project } from "@/types/portfolio";
import { slugify } from "@/lib/slugify";

// In-memory placeholder store. Swap this module for a real database layer
// (e.g. Prisma, Drizzle) once the data model is finalized — the function
// signatures below are the contract the rest of the app depends on.
//
// Anchored on globalThis rather than a plain module-level `let`: in dev,
// Route Handlers and Server Components can end up in separate Turbopack
// module graphs, so a closured variable doesn't stay shared between them.
// globalThis is the actual Node process, so it does.
declare global {
  var __projects: Project[] | undefined;
}

function store(): Project[] {
  if (!globalThis.__projects) {
    globalThis.__projects = [
      {
        id: "1",
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
        createdAt: new Date("2026-01-10").toISOString(),
      },
      {
        id: "2",
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
        createdAt: new Date("2026-02-20").toISOString(),
      },
    ];
  }
  return globalThis.__projects;
}

export async function getProjects(): Promise<Project[]> {
  return [...store()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  return store().find((project) => project.slug === slug);
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  return store().find((project) => project.id === id);
}

function uniqueSlug(title: string): string {
  const base = slugify(title) || "untitled";
  let candidate = base;
  let suffix = 2;
  while (store().some((project) => project.slug === candidate)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}

export async function createProject(
  input: Omit<Project, "id" | "createdAt" | "slug">
): Promise<Project> {
  const project: Project = {
    ...input,
    id: crypto.randomUUID(),
    slug: uniqueSlug(input.title),
    createdAt: new Date().toISOString(),
  };
  globalThis.__projects = [...store(), project];
  return project;
}

export async function updateProject(
  id: string,
  input: Partial<Omit<Project, "id" | "createdAt" | "slug">>
): Promise<Project | undefined> {
  let updated: Project | undefined;
  globalThis.__projects = store().map((project) => {
    if (project.id !== id) return project;
    updated = { ...project, ...input };
    return updated;
  });
  return updated;
}

export async function deleteProject(id: string): Promise<boolean> {
  const before = store().length;
  globalThis.__projects = store().filter((project) => project.id !== id);
  return store().length < before;
}
