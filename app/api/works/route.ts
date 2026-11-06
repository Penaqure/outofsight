import { NextResponse } from "next/server";
import { readJson, requireAdmin } from "@/lib/request-security";
import { createProject, getProjects } from "@/lib/data/portfolio";

export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const projects = await getProjects();
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const parsed = await readJson(request);
  if ("error" in parsed) return parsed.error;
  const project = await createProject(
    parsed.body as Parameters<typeof createProject>[0]
  );
  return NextResponse.json(project, { status: 201 });
}
