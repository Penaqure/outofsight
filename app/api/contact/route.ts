import { NextResponse } from "next/server";
import { createMessage } from "@/lib/data/messages";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const saved = await createMessage({ name, email, message });
  return NextResponse.json(saved, { status: 201 });
}
