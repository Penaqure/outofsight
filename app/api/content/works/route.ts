import { NextResponse } from "next/server";
import { getWorksContent, updateWorksContent } from "@/lib/data/content";

export async function GET() {
  const content = await getWorksContent();
  return NextResponse.json(content);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const content = await updateWorksContent(body);
  return NextResponse.json(content);
}
