export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Captures a mid-point frame from a video file as a JPEG data URL, purely
// client-side (no server-side video processing available in this scaffold).
export function captureVideoFrame(file: File): Promise<string | null> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
    const url = URL.createObjectURL(file);
    video.src = url;

    const cleanupAndResolve = (result: string | null) => {
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
        cleanupAndResolve(canvas.toDataURL("image/jpeg", 0.7));
      } catch {
        cleanupAndResolve(null);
      }
    });
    video.addEventListener("error", () => cleanupAndResolve(null));
  });
}
