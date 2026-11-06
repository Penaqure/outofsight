// File types the admin may upload, by extension, with the Content-Type
// each is served with (app/uploads/[...path]/route.ts). The upload route
// only accepts a file whose extension is listed here AND whose declared type
// matches, so nothing that a browser would run as a page (.html, .js, …)
// can ever land in uploads/.
export const UPLOAD_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".ogg": "video/ogg",
};
