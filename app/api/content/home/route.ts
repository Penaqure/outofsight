import { NextResponse } from "next/server";
import { readJson, requireAdmin } from "@/lib/request-security";
import { getHomeContent, updateHomeContent } from "@/lib/data/content";

export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const content = await getHomeContent();
  return NextResponse.json(content);
}

export async function PUT(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const parsed = await readJson(request);
  if ("error" in parsed) return parsed.error;
  const content = await updateHomeContent(parsed.body as Parameters<typeof updateHomeContent>[0]);
  return NextResponse.json(content);
}
