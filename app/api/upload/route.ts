import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/request-security";
import { UPLOAD_TYPES } from "@/lib/uploads";

// Self-hosted replacement for the old Vercel Blob upload: the file is sent
// straight to this route as multipart form data and written to disk under
// a top-level uploads/ directory, served back by app/uploads/[...path]/
// route.ts (not public/ — see that file for why). This only works because
// the app now runs as a long-lived process on its own server (Contabo)
// with a persistent filesystem; it would not survive Vercel's serverless
// functions, which is exactly why the old code went through Blob instead.
const UPLOADS_DIR = path.join(process.cwd(), "uploads");
const MAX_SIZE_BYTES = 1024 * 1024 * 1024; // 1GB, matches the admin upload UI copy

// Lower-cased extension plus a filesystem-safe base name.
function sanitizeFilename(name: string): { base: string; ext: string } {
  const ext = path.extname(name).toLowerCase();
  const base = path
    .basename(name, path.extname(name))
    .replace(/[^a-zA-Z0-9-_]/g, "_")
    .slice(0, 80);
  return { base: base || "upload", ext };
}

// Browsers report a few types under alternate names.
function normalizeType(type: string): string {
  const aliases: Record<string, string> = { "image/jpg": "image/jpeg", "image/pjpeg": "image/jpeg" };
  return aliases[type] ?? type;
}

export async function POST(request: Request): Promise<NextResponse> {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    // The declared type alone is just a client-supplied string; the
    // extension decides how the file is served later, so both must agree
    // with the allowlist.
    const { base, ext } = sanitizeFilename(file.name || "upload");
    if (!UPLOAD_TYPES[ext] || UPLOAD_TYPES[ext] !== normalizeType(file.type)) {
      return NextResponse.json(
        { error: "Only image or video files are allowed" },
        { status: 400 }
      );
    }
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: "File is too large" }, { status: 413 });
    }

    // Random prefix avoids collisions between uploads that share a filename
    // (e.g. every video frame capture is named "preview.jpg").
    const uniquePrefix = randomBytes(8).toString("hex");
    const filename = `${uniquePrefix}-${base}${ext}`;

    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    const bytes = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(UPLOADS_DIR, filename), bytes);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (error) {
    // Log the detail server-side; don't echo internals (paths, etc.) back.
    console.error("Upload failed:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 400 });
  }
}
