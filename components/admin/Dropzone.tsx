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

export function Dropzone({
  label,
  accept,
  helperText,
  preview,
  onSelect,
  onRemove,
}: {
  label: string;
  accept: string;
  helperText: string;
  preview: FilePreview | null;
  onSelect: (file: File) => void;
  onRemove: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function pick(file: File | undefined) {
    if (file) onSelect(file);
  }

  return (
    <div>
      <p className="text-sm font-medium text-obsidian/70">{label}</p>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          pick(e.dataTransfer.files?.[0]);
        }}
        onClick={() => !preview && inputRef.current?.click()}
        className={`relative mt-2 flex h-40 overflow-hidden rounded-md border border-obsidian/10 bg-obsidian/[.05] transition-colors ${
          !preview ? "cursor-pointer" : ""
        } ${isDragging ? "bg-obsidian/[.09]" : ""}`}
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
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-obsidian" />
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
                className="shrink-0 rounded border border-bone-white/50 px-3 py-1 text-xs text-bone-white hover:bg-bone-white/10"
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
              <span className="text-primary underline">Click to Browse</span>
            </p>
            <p className="text-xs text-obsidian/40">{helperText}</p>
          </div>
        )}
      </div>
    </div>
  );
}
