import { spawn, spawnSync } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";

// One-off / cron media optimizer for the self-hosted uploads/ directory.
//
// The admin uploads raw files straight to disk (app/api/upload/route.ts) —
// a 4K screen recording or a phone clip can land as an 80MB+ MP4, and
// app/(site)/page.tsx then streams the whole thing to every visitor. This
// script re-encodes each video in place to a web-sane H.264 1080p file
// with faststart (so playback starts before the download finishes) and
// captures a poster frame next to it (<name>.jpg), which lib/media.ts
// picks up automatically. The original is moved to .media-originals/ first,
// never deleted.
//
// Usage:
//   node scripts/optimize-media.mjs            # process uploads/
//   node scripts/optimize-media.mjs --dry-run  # report only, touch nothing
//   node scripts/optimize-media.mjs --force    # re-encode even if already small
//
// Requires ffmpeg + ffprobe on PATH (Debian/Ubuntu: `apt install ffmpeg`).
// Safe to re-run and safe to schedule (e.g. a cron job every few minutes) —
// a file already carrying the optimized marker is skipped.

const CWD = process.cwd();
const UPLOADS_DIR = path.join(CWD, "uploads");
const ORIGINALS_DIR = path.join(CWD, ".media-originals");

const VIDEO_EXTS = new Set([".mp4", ".webm", ".mov", ".m4v", ".ogv", ".ogg"]);

// A video is left alone (beyond poster capture) when it's already H.264,
// no taller than this, and streams under this bitrate.
const MAX_HEIGHT = 1080;
const MAX_VIDEO_BITRATE = 4_500_000; // bits/s
const TARGET_CRF = 23;

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has("--dry-run");
const FORCE = args.has("--force");

function requireBinary(name) {
  const res = spawnSync(name, ["-version"], { stdio: "ignore" });
  if (res.error) {
    console.error(
      `\n  '${name}' not found on PATH.\n` +
        `  Install ffmpeg first — Debian/Ubuntu: sudo apt install ffmpeg\n`
    );
    process.exit(1);
  }
}

function run(cmd, cmdArgs) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, cmdArgs, { stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";
    child.stderr.on("data", (d) => (stderr += d));
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} exited ${code}\n${stderr.slice(-2000)}`));
    });
  });
}

async function probe(file) {
  const res = spawnSync("ffprobe", [
    "-v",
    "error",
    "-select_streams",
    "v:0",
    "-show_entries",
    "stream=codec_name,height,width:format=duration,bit_rate,size",
    "-of",
    "json",
    file,
  ]);
  if (res.status !== 0) throw new Error(`ffprobe failed for ${file}`);
  const parsed = JSON.parse(res.stdout.toString());
  const stream = parsed.streams?.[0] ?? {};
  const format = parsed.format ?? {};
  const size = Number(format.size) || 0;
  const duration = Number(format.duration) || 0;
  const bitRate =
    Number(format.bit_rate) ||
    (duration > 0 ? (size * 8) / duration : 0);
  return {
    codec: stream.codec_name ?? "",
    width: Number(stream.width) || 0,
    height: Number(stream.height) || 0,
    duration,
    bitRate,
    size,
  };
}

function fmtBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function capturePoster(video, posterPath, atSeconds) {
  await run("ffmpeg", [
    "-y",
    "-ss",
    String(atSeconds),
    "-i",
    video,
    "-frames:v",
    "1",
    "-vf",
    "scale=-2:'min(720,ih)'",
    "-q:v",
    "3",
    posterPath,
  ]);
}

async function transcode(input, output) {
  await run("ffmpeg", [
    "-y",
    "-i",
    input,
    "-vf",
    `scale=-2:'min(${MAX_HEIGHT},ih)'`,
    "-c:v",
    "libx264",
    "-profile:v",
    "high",
    "-preset",
    "slow",
    "-crf",
    String(TARGET_CRF),
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    "-c:a",
    "aac",
    "-b:a",
    "128k",
    "-map_metadata",
    "-1",
    output,
  ]);
}

async function processVideo(file) {
  const rel = path.relative(CWD, file);
  const info = await probe(file);

  const needsReencode =
    FORCE ||
    info.codec !== "h264" ||
    info.height > MAX_HEIGHT ||
    info.bitRate > MAX_VIDEO_BITRATE;

  const posterPath = `${file}.jpg`;
  const posterMissing = !(await exists(posterPath));
  const posterAt = info.duration > 0 ? Math.min(1, info.duration / 2) : 0;

  if (!needsReencode && !posterMissing) {
    console.log(`  skip   ${rel} (${fmtBytes(info.size)}, already web-ready)`);
    return { savedBytes: 0 };
  }

  if (DRY_RUN) {
    const actions = [];
    if (needsReencode)
      actions.push(
        `re-encode (${info.codec} ${info.width}x${info.height}, ${fmtBytes(info.size)})`
      );
    if (posterMissing) actions.push("capture poster");
    console.log(`  would  ${rel}: ${actions.join(" + ")}`);
    return { savedBytes: 0 };
  }

  if (!needsReencode && posterMissing) {
    await capturePoster(file, posterPath, posterAt);
    console.log(`  poster ${rel}.jpg`);
    return { savedBytes: 0 };
  }

  const tmp = path.join(
    path.dirname(file),
    `.optimizing-${Date.now()}-${path.basename(file, path.extname(file))}.mp4`
  );

  try {
    await transcode(file, tmp);
    const outSize = (await fs.stat(tmp)).size;

    if (outSize >= info.size && !FORCE) {
      await fs.rm(tmp, { force: true });
      console.log(
        `  keep   ${rel} (re-encode was ${fmtBytes(outSize)}, not smaller)`
      );
      if (posterMissing) {
        await capturePoster(file, posterPath, posterAt);
        console.log(`  poster ${rel}.jpg`);
      }
      return { savedBytes: 0 };
    }

    await fs.mkdir(ORIGINALS_DIR, { recursive: true });
    const backup = path.join(ORIGINALS_DIR, path.basename(file));
    if (!(await exists(backup))) {
      await fs.copyFile(file, backup);
    }

    await fs.rename(tmp, file).catch(async () => {
      // rename across devices can fail — fall back to copy
      await fs.copyFile(tmp, file);
      await fs.rm(tmp, { force: true });
    });

    await capturePoster(file, posterPath, posterAt);

    const saved = info.size - outSize;
    console.log(
      `  done   ${rel}: ${fmtBytes(info.size)} -> ${fmtBytes(outSize)} ` +
        `(saved ${fmtBytes(saved)}), poster captured`
    );
    return { savedBytes: saved };
  } catch (err) {
    await fs.rm(tmp, { force: true });
    console.error(`  FAIL   ${rel}: ${err.message}`);
    return { savedBytes: 0 };
  }
}

async function main() {
  requireBinary("ffmpeg");
  requireBinary("ffprobe");

  if (!(await exists(UPLOADS_DIR))) {
    console.log("No uploads/ directory — nothing to do.");
    return;
  }

  const entries = await fs.readdir(UPLOADS_DIR, { withFileTypes: true });
  const videos = entries
    .filter(
      (e) => e.isFile() && VIDEO_EXTS.has(path.extname(e.name).toLowerCase())
    )
    .map((e) => path.join(UPLOADS_DIR, e.name));

  if (videos.length === 0) {
    console.log("No videos found in uploads/.");
    return;
  }

  console.log(
    `${DRY_RUN ? "[dry run] " : ""}Optimizing ${videos.length} video(s) in uploads/\n`
  );

  let totalSaved = 0;
  for (const video of videos) {
    const { savedBytes } = await processVideo(video);
    totalSaved += savedBytes;
  }

  console.log(
    `\nDone. ${DRY_RUN ? "Estimated" : "Reclaimed"} ${fmtBytes(totalSaved)}.` +
      (DRY_RUN ? " Re-run without --dry-run to apply." : "")
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
