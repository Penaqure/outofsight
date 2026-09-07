import { promises as fs } from "node:fs";
import path from "node:path";

const UPLOADS_DIR = path.join(process.cwd(), "uploads");

// scripts/optimize-media.mjs writes a poster frame next to every video it
// processes, named "<video filename>.jpg" (e.g. uploads/abc-clip.mp4 ->
// uploads/abc-clip.mp4.jpg). Given a "/uploads/..." video URL, return the
// matching poster URL if that file actually exists, else undefined — so a
// <video> without a captured poster just renders without one rather than
// firing a 404 for a missing image.
export async function videoPosterUrl(
  videoUrl: string | null | undefined
): Promise<string | undefined> {
  if (!videoUrl || !videoUrl.startsWith("/uploads/")) return undefined;

  const name = videoUrl.slice("/uploads/".length);
  if (name.includes("..") || name.includes("/")) return undefined;

  try {
    await fs.access(path.join(UPLOADS_DIR, `${name}.jpg`));
    return `${videoUrl}.jpg`;
  } catch {
    return undefined;
  }
}
