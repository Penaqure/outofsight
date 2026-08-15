import { NextResponse } from "next/server";
import { getContactsContent, updateContactsContent } from "@/lib/data/content";

export async function GET() {
  const content = await getContactsContent();
  return NextResponse.json(content);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const content = await updateContactsContent(body);
  return NextResponse.json(content);
}
