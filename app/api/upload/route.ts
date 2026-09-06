import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";

// Self-hosted replacement for the old Vercel Blob upload: the file is sent
// straight to this route as multipart form data and written to disk under
// a top-level uploads/ directory, served back by app/uploads/[...path]/
// route.ts (not public/ — see that file for why). This only works because
// the app now runs as a long-lived process on its own server (Contabo)
// with a persistent filesystem; it would not survive Vercel's serverless
// functions, which is exactly why the old code went through Blob instead.
const UPLOADS_DIR = path.join(process.cwd(), "uploads");
const MAX_SIZE_BYTES = 1024 * 1024 * 1024; // 1GB, matches the admin upload UI copy

function sanitizeFilename(name: string): string {
  const ext = path.extname(name).slice(0, 20);
  const base = path
    .basename(name, ext)
    .replace(/[^a-zA-Z0-9-_]/g, "_")
    .slice(0, 80);
  return `${base || "upload"}${ext}`;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (!/^(image|video)\//.test(file.type)) {
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
    const filename = `${uniquePrefix}-${sanitizeFilename(file.name || "upload")}`;

    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    const bytes = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(UPLOADS_DIR, filename), bytes);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
