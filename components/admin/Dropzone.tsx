"use client";

import { useRef, useState } from "react";

export type FilePreview = {
  label: string;
  url: string | null;
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(0)}MB`;
}

export { formatFileSize };

// Drag MIME type used to move an image from the admin's shared "Image
// Library" pool onto a specific section's Dropzone — see
// AboutContentForm.tsx's image pool. A plain OS file drag never sets this
// type, so the two drag sources never conflict.
export const POOL_IMAGE_MIME = "application/x-outofsight-pool-image";

// Default CSS object-position — matches object-cover's own implicit
// default, so a field that has never been touched renders identically to
// before this control existed.
export const DEFAULT_FOCAL_POINT = "50% 50%";

function parseFocalPoint(position: string): { x: number; y: number } {
  const [x, y] = position
    .split(" ")
    .map((part) => parseFloat(part.replace("%", "")));
  return {
    x: Number.isFinite(x) ? x : 50,
    y: Number.isFinite(y) ? y : 50,
  };
}

export function Dropzone({
  label,
  accept,
  helperText,
  preview,
  onSelect,
  onRemove,
  onDropUrl,
  focalPoint,
  onFocalPointChange,
}: {
  label: string;
  accept: string;
  helperText: string;
  preview: FilePreview | null;
  onSelect: (file: File) => void;
  onRemove: () => void;
  // Called instead of onSelect when the drop is a pool image (a URL) rather
  // than a raw OS file. Optional — only sections that participate in the
  // shared Image Library pass this.
  onDropUrl?: (url: string) => void;
  // CSS object-position (e.g. "62% 30%"). Optional — only image fields that
  // render with object-cover on the live site need a focal point; fields
  // like logos (object-contain) never crop, so they skip this.
  focalPoint?: string;
  onFocalPointChange?: (position: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPositioning, setIsPositioning] = useState(false);

  function pick(file: File | undefined) {
    if (file) onSelect(file);
  }

  function updateFocalPoint(e: React.PointerEvent) {
    const rect = previewRef.current?.getBoundingClientRect();
    if (!rect || !onFocalPointChange) return;
    const x = Math.min(
      100,
      Math.max(0, ((e.clientX - rect.left) / rect.width) * 100)
    );
    const y = Math.min(
      100,
      Math.max(0, ((e.clientY - rect.top) / rect.height) * 100)
    );
    onFocalPointChange(`${x.toFixed(0)}% ${y.toFixed(0)}%`);
  }

  const marker = parseFocalPoint(focalPoint ?? DEFAULT_FOCAL_POINT);

  return (
    <div>
      <p className="text-base text-obsidian">{label}</p>
      {onFocalPointChange && preview?.url && (
        <p className="mt-0.5 text-xs text-obsidian/40">
          Click or drag on the image to set the focal point.
        </p>
      )}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const poolUrl = e.dataTransfer.getData(POOL_IMAGE_MIME);
          if (poolUrl && onDropUrl) {
            onDropUrl(poolUrl);
            return;
          }
          pick(e.dataTransfer.files?.[0]);
        }}
        onClick={() => !preview && inputRef.current?.click()}
        className={`relative mt-2 flex h-40 overflow-hidden border border-obsidian/10 bg-obsidian/[.05] transition-colors ${
          !preview ? "cursor-pointer" : ""
        } ${isDragging ? "bg-primary/10 ring-2 ring-primary" : ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => pick(e.target.files?.[0])}
        />
        {preview ? (
          <>
            {preview.url ? (
              <img
                src={preview.url}
                alt=""
                draggable={false}
                style={
                  onFocalPointChange
                    ? { objectPosition: focalPoint ?? DEFAULT_FOCAL_POINT }
                    : undefined
                }
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-obsidian" />
            )}
            {onFocalPointChange && preview.url && (
              <div
                ref={previewRef}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  setIsPositioning(true);
                  e.currentTarget.setPointerCapture(e.pointerId);
                  updateFocalPoint(e);
                }}
                onPointerMove={(e) => {
                  if (!isPositioning) return;
                  updateFocalPoint(e);
                }}
                onPointerUp={() => setIsPositioning(false)}
                className="absolute inset-0 cursor-crosshair"
              >
                <div
                  className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-primary/80 shadow"
                  style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                />
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-obsidian/80 to-transparent px-4 py-3">
              <span className="truncate text-xs text-bone-white">
                {preview.label}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="shrink-0 border border-bone-white/50 px-3 py-1 text-xs text-bone-white hover:bg-bone-white/10"
              >
                Delete
              </button>
            </div>
          </>
        ) : (
          <div className="flex w-full flex-col items-center justify-center gap-2 text-center">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-obsidian/50"
            >
              <path d="M12 16V4M12 4l-4 4M12 4l4 4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-sm text-obsidian/70">
              Drag and Drop or{" "}
              <span className="font-bold text-primary underline">
                Click to Browse
              </span>
            </p>
            <p className="text-xs text-obsidian/40">{helperText}</p>
          </div>
        )}
      </div>
    </div>
  );
}
