import { NextResponse } from "next/server";
import { readJson, requireAdmin } from "@/lib/request-security";
import { reorderProjects } from "@/lib/data/portfolio";

// Saves the drag-and-drop order of the admin Works grid.
export async function PUT(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const parsed = await readJson(request);
  if ("error" in parsed) return parsed.error;

  const ids = (parsed.body as { ids?: unknown } | null)?.ids;
  if (!Array.isArray(ids) || !ids.every((id) => typeof id === "string")) {
    return NextResponse.json({ error: "Invalid order" }, { status: 400 });
  }

  await reorderProjects(ids);
  return NextResponse.json({ ok: true });
}
