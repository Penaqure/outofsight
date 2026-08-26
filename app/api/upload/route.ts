import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

// Client-side direct-to-blob uploads: the browser never sends the file
// through this route's own body (avoids the ~4.5MB serverless request body
// limit that would otherwise cap video uploads well below the site's
// stated 1GB limit). This route only issues a short-lived upload token.
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ["image/*", "video/*"],
        addRandomSuffix: true,
        maximumSizeInBytes: 1024 * 1024 * 1024, // 1GB, matches the admin upload UI copy
      }),
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
