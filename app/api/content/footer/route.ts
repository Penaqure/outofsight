import { NextResponse } from "next/server";
import { readJson, requireAdmin } from "@/lib/request-security";
import { getFooterContent, updateFooterContent } from "@/lib/data/content";

export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const content = await getFooterContent();
  return NextResponse.json(content);
}

export async function PUT(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const parsed = await readJson(request);
  if ("error" in parsed) return parsed.error;
  const content = await updateFooterContent(parsed.body as Parameters<typeof updateFooterContent>[0]);
  return NextResponse.json(content);
}
