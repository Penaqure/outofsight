"use client";

import { upload } from "@vercel/blob/client";

// Replaces reading files as base64 data: URLs (the old approach embedded
// the entire file inline in every page/API response — slow, especially for
// video, and incompatible with Vercel's stateless serverless functions).
// Uploads go straight from the browser to Blob storage via a short-lived
// token from /api/upload, and this returns the resulting public CDN URL.
export async function uploadFile(
  file: File | Blob,
  filename = "upload",
  onProgress?: (ratio: number) => void
): Promise<string> {
  const pathname = file instanceof File ? file.name : filename;
  // Large video files need multipart (chunked, parallel, retryable)
  // uploads; small images don't benefit and add needless overhead.
  const multipart = file.size > 10 * 1024 * 1024;

  const blob = await upload(pathname, file, {
    access: "public",
    handleUploadUrl: "/api/upload",
    multipart,
    onUploadProgress: onProgress
      ? ({ percentage }) => onProgress(percentage / 100)
      : undefined,
  });
  return blob.url;
}
