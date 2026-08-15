import { NextResponse } from "next/server";
import { getAboutContent, updateAboutContent } from "@/lib/data/content";

export async function GET() {
  const content = await getAboutContent();
  return NextResponse.json(content);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const content = await updateAboutContent(body);
  return NextResponse.json(content);
}
