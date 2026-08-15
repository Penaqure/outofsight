import { NextResponse } from "next/server";
import { getHomeContent, updateHomeContent } from "@/lib/data/content";

export async function GET() {
  const content = await getHomeContent();
  return NextResponse.json(content);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const content = await updateHomeContent(body);
  return NextResponse.json(content);
}
