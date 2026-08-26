// Captures a mid-point frame from a video file as a JPEG Blob, purely
// client-side (no server-side video processing available in this
// scaffold). Returns a Blob rather than a data URL so the caller can
// upload it directly instead of embedding it inline.
export function captureVideoFrame(file: File): Promise<Blob | null> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
    const url = URL.createObjectURL(file);
    video.src = url;

    const cleanupAndResolve = (result: Blob | null) => {
      URL.revokeObjectURL(url);
      resolve(result);
    };

    video.addEventListener("loadeddata", () => {
      video.currentTime = Math.min(1, (video.duration || 1) / 2);
    });
    video.addEventListener("seeked", () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx || !canvas.width || !canvas.height) {
          cleanupAndResolve(null);
          return;
        }
        ctx.drawImage(video, 0, 0);
        canvas.toBlob(
          (blob) => cleanupAndResolve(blob),
          "image/jpeg",
          0.7
        );
      } catch {
        cleanupAndResolve(null);
      }
    });
    video.addEventListener("error", () => cleanupAndResolve(null));
  });
}
