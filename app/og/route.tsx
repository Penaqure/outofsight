import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { siteConfig } from "@/lib/config";

// Branded 1200×630 social card served at /og — the share image for pages
// without a photo of their own (see defaultShareImage in lib/seo.ts).
// A plain route rather than the opengraph-image file convention on purpose:
// file-based images override page metadata, which would replace the
// project/hero photos other pages share. Rendered once at build time.
export const dynamic = "force-static";

const [semiBold, regular, logo] = await Promise.all([
  readFile(join(process.cwd(), "fonts/OpenSauceOne/OpenSauceOne-SemiBold.ttf")),
  readFile(join(process.cwd(), "fonts/OpenSauceOne/OpenSauceOne-Regular.ttf")),
  readFile(join(process.cwd(), "public/logo/outofsight-logo.png")),
]);
const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

// Brand palette from app/globals.css (--bone-white / --obsidian).
const BONE_WHITE = "#efece8";
const OBSIDIAN = "#232323";

export function GET() {
  const host = new URL(siteConfig.url).host;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: BONE_WHITE,
          color: OBSIDIAN,
          fontFamily: "Open Sauce One",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={360} height={38} alt="" />
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 600,
              letterSpacing: -1.5,
              lineHeight: 1.1,
              maxWidth: 900,
            }}
          >
            Brand storytelling through film &amp; photography
          </div>
          <div style={{ fontSize: 28, opacity: 0.6 }}>{host}</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Open Sauce One", data: semiBold, weight: 600, style: "normal" },
        { name: "Open Sauce One", data: regular, weight: 400, style: "normal" },
      ],
      // The URL isn't content-hashed, so don't let caches pin it for a year
      // (ImageResponse's default) — a redesign should show up within a day.
      headers: { "Cache-Control": "public, max-age=86400" },
    }
  );
}
