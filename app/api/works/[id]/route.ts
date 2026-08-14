import { NextResponse } from "next/server";
import {
  deleteProject,
  getProjectById,
  updateProject,
} from "@/lib/data/portfolio";

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/works/[id]">
) {
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
  const { id } = await ctx.params;
  const body = await request.json();
  const project = await updateProject(id, body);
  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(project);
}

export async function DELETE(
  _request: Request,
  ctx: RouteContext<"/api/works/[id]">
) {
  const { id } = await ctx.params;
  const deleted = await deleteProject(id);
  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return new NextResponse(null, { status: 204 });
}
