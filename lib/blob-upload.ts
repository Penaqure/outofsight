"use client";

// Uploads go to this app's own /api/upload route, which writes the file to
// disk on the server and hands back its public path (served straight out of
// public/uploads). XMLHttpRequest is used instead of fetch purely because
// fetch has no upload-progress event.
export function uploadFile(
  file: File | Blob,
  filename = "upload",
  onProgress?: (ratio: number) => void
): Promise<string> {
  const name = file instanceof File ? file.name : filename;

  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file, name);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload");

    if (onProgress) {
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) onProgress(event.loaded / event.total);
      });
    }

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const { url } = JSON.parse(xhr.responseText) as { url: string };
          resolve(url);
        } catch {
          reject(new Error("Invalid response from upload endpoint"));
        }
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });
    xhr.addEventListener("error", () => reject(new Error("Upload failed")));
    xhr.send(formData);
  });
}
