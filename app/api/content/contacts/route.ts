import { NextResponse } from "next/server";
import { readJson, requireAdmin } from "@/lib/request-security";
import { getContactsContent, updateContactsContent } from "@/lib/data/content";

export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const content = await getContactsContent();
  return NextResponse.json(content);
}

export async function PUT(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const parsed = await readJson(request);
  if ("error" in parsed) return parsed.error;
  const content = await updateContactsContent(parsed.body as Parameters<typeof updateContactsContent>[0]);
  return NextResponse.json(content);
}
