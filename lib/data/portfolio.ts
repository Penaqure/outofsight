import { randomUUID } from "node:crypto";
import type { Project } from "@/types/portfolio";
import { slugify } from "@/lib/slugify";
import { pool } from "@/lib/db";

// Postgres-backed via raw SQL (see db/schema.sql). created_at is a native
// timestamptz (JS Date at runtime) — the Project type keeps it as an ISO
// string like before, so every row is converted on the way out.
type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  credits: string;
  thumbnail_image: string | null;
  thumbnail_image_position: string;
  thumbnail_label: string | null;
  video_name: string | null;
  video_label: string | null;
  video_preview_image: string | null;
  video_preview_image_position: string;
  photos: string[];
  tags: string[];
  created_at: Date;
};

function toProject(row: ProjectRow): Project {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    credits: row.credits,
    thumbnailImage: row.thumbnail_image,
    thumbnailImagePosition: row.thumbnail_image_position,
    thumbnailLabel: row.thumbnail_label,
    videoName: row.video_name,
    videoLabel: row.video_label,
    videoPreviewImage: row.video_preview_image,
    videoPreviewImagePosition: row.video_preview_image_position,
    photos: row.photos,
    tags: row.tags,
    createdAt: row.created_at.toISOString(),
  };
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
    photos: [] as string[],
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
    photos: [] as string[],
    tags: ["mobile"],
    createdAt: new Date("2026-02-20"),
  },
];

// Seeds the two sample projects on first run only (table empty). Safe to
// call on every read — it's a no-op once any project exists.
async function ensureSeeded(): Promise<void> {
  const { rows } = await pool.query<{ count: string }>(
    "SELECT count(*) FROM projects"
  );
  if (Number(rows[0].count) > 0) return;

  for (const project of seedProjects) {
    await pool.query(
      `INSERT INTO projects
         (id, slug, title, description, credits, thumbnail_image,
          thumbnail_image_position, thumbnail_label, video_name, video_label,
          video_preview_image, video_preview_image_position, photos, tags,
          created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
      [
        randomUUID(),
        project.slug,
        project.title,
        project.description,
        project.credits,
        project.thumbnailImage,
        project.thumbnailImagePosition,
        project.thumbnailLabel,
        project.videoName,
        project.videoLabel,
        project.videoPreviewImage,
        project.videoPreviewImagePosition,
        project.photos,
        project.tags,
        project.createdAt,
      ]
    );
  }
}

export async function getProjects(): Promise<Project[]> {
  await ensureSeeded();
  const { rows } = await pool.query<ProjectRow>(
    "SELECT * FROM projects ORDER BY created_at DESC"
  );
  return rows.map(toProject);
}

export async function getProjectBySlug(
  slug: string
): Promise<Project | undefined> {
  await ensureSeeded();
  const { rows } = await pool.query<ProjectRow>(
    "SELECT * FROM projects WHERE slug = $1",
    [slug]
  );
  return rows[0] ? toProject(rows[0]) : undefined;
}

export async function getProjectById(
  id: string
): Promise<Project | undefined> {
  const { rows } = await pool.query<ProjectRow>(
    "SELECT * FROM projects WHERE id = $1",
    [id]
  );
  return rows[0] ? toProject(rows[0]) : undefined;
}

async function uniqueSlug(title: string): Promise<string> {
  const base = slugify(title) || "untitled";
  let candidate = base;
  let suffix = 2;
  while (
    (
      await pool.query("SELECT 1 FROM projects WHERE slug = $1", [candidate])
    ).rows.length > 0
  ) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}

export async function createProject(
  input: Omit<Project, "id" | "createdAt" | "slug">
): Promise<Project> {
  const id = randomUUID();
  const slug = await uniqueSlug(input.title);
  const { rows } = await pool.query<ProjectRow>(
    `INSERT INTO projects
       (id, slug, title, description, credits, thumbnail_image,
        thumbnail_image_position, thumbnail_label, video_name, video_label,
        video_preview_image, video_preview_image_position, photos, tags)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
     RETURNING *`,
    [
      id,
      slug,
      input.title,
      input.description,
      input.credits,
      input.thumbnailImage,
      input.thumbnailImagePosition,
      input.thumbnailLabel,
      input.videoName,
      input.videoLabel,
      input.videoPreviewImage,
      input.videoPreviewImagePosition,
      input.photos,
      input.tags,
    ]
  );
  return toProject(rows[0]);
}

export async function updateProject(
  id: string,
  input: Partial<Omit<Project, "id" | "createdAt" | "slug">>
): Promise<Project | undefined> {
  const current = await getProjectById(id);
  if (!current) return undefined;

  const merged = { ...current, ...input };
  const { rows } = await pool.query<ProjectRow>(
    `UPDATE projects SET
       title = $1, description = $2, credits = $3, thumbnail_image = $4,
       thumbnail_image_position = $5, thumbnail_label = $6, video_name = $7,
       video_label = $8, video_preview_image = $9,
       video_preview_image_position = $10, photos = $11, tags = $12
     WHERE id = $13
     RETURNING *`,
    [
      merged.title,
      merged.description,
      merged.credits,
      merged.thumbnailImage,
      merged.thumbnailImagePosition,
      merged.thumbnailLabel,
      merged.videoName,
      merged.videoLabel,
      merged.videoPreviewImage,
      merged.videoPreviewImagePosition,
      merged.photos,
      merged.tags,
      id,
    ]
  );
  return rows[0] ? toProject(rows[0]) : undefined;
}

export async function deleteProject(id: string): Promise<boolean> {
  const { rowCount } = await pool.query("DELETE FROM projects WHERE id = $1", [
    id,
  ]);
  return (rowCount ?? 0) > 0;
}
