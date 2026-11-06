import { createReadStream, promises as fs } from "node:fs";
import { Readable } from "node:stream";
import path from "node:path";
import { NextResponse } from "next/server";
import { UPLOAD_TYPES } from "@/lib/uploads";

// Serves files from the top-level uploads/ directory (written by
// app/api/upload/route.ts). This can't just be public/uploads served by
// Next's built-in static handler: Next scans public/ into an in-memory set
// once at server boot, so a file written there after boot 404s until the
// whole process restarts — unworkable for a CMS where uploads happen while
// the server is running. A route handler re-reads the disk on every
// request instead, so new uploads show up immediately. Range support is
// implemented by hand for the same reason — the old Vercel Blob CDN gave
// video scrubbing for free, and losing it would silently break the
// background/project video players.
const UPLOADS_DIR = path.join(process.cwd(), "uploads");


export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
): Promise<NextResponse> {
  const { path: segments } = await params;

  if (
    segments.length === 0 ||
    segments.some((segment) => segment.includes("..") || segment.includes("/"))
  ) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  const filePath = path.join(UPLOADS_DIR, ...segments);

  let stat;
  try {
    stat = await fs.stat(filePath);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (!stat.isFile()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Security headers for these responses (nosniff and a script-blocking
  // CSP) come from the /uploads rule in next.config.ts.
  const contentType =
    UPLOAD_TYPES[path.extname(filePath).toLowerCase()] ?? "application/octet-stream";
  const range = request.headers.get("range");
  const rangeMatch = range ? /^bytes=(\d*)-(\d*)$/.exec(range) : null;

  if (rangeMatch) {
    const start = rangeMatch[1] ? Number(rangeMatch[1]) : 0;
    const end = rangeMatch[2] ? Number(rangeMatch[2]) : stat.size - 1;

    if (start > end || end >= stat.size) {
      return new NextResponse(null, {
        status: 416,
        headers: { "Content-Range": `bytes */${stat.size}` },
      });
    }

    const stream = Readable.toWeb(
      createReadStream(filePath, { start, end })
    ) as ReadableStream<Uint8Array>;

    return new NextResponse(stream, {
      status: 206,
      headers: {
        "Content-Type": contentType,
        "Content-Range": `bytes ${start}-${end}/${stat.size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": String(end - start + 1),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  const stream = Readable.toWeb(createReadStream(filePath)) as ReadableStream<Uint8Array>;

  return new NextResponse(stream, {
    headers: {
      "Content-Type": contentType,
      "Accept-Ranges": "bytes",
      "Content-Length": String(stat.size),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
