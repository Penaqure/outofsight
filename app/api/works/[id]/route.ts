import { NextResponse } from "next/server";
import { readJson, requireAdmin } from "@/lib/request-security";
import {
  deleteProject,
  getProjectById,
  updateProject,
} from "@/lib/data/portfolio";

export async function GET(
  request: Request,
  ctx: RouteContext<"/api/works/[id]">
) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const { id } = await ctx.params;
  const project = await getProjectById(id);
  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(project);
}

export async function PUT(
  request: Request,
  ctx: RouteContext<"/api/works/[id]">
) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const { id } = await ctx.params;
  const parsed = await readJson(request);
  if ("error" in parsed) return parsed.error;
  const project = await updateProject(
    id,
    parsed.body as Parameters<typeof updateProject>[1]
  );
  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(project);
}

export async function DELETE(
  request: Request,
  ctx: RouteContext<"/api/works/[id]">
) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const { id } = await ctx.params;
  const deleted = await deleteProject(id);
  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return new NextResponse(null, { status: 204 });
}
