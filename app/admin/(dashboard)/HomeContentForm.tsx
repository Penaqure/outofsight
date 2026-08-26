"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { HomeContent } from "@/types/content";
import { uploadFile } from "@/lib/blob-upload";
import logoOnly from "@/public/logo/logo_only.png";

export function HomeContentForm({
  initialContent,
}: {
  initialContent: HomeContent;
}) {
  const [heroText, setHeroText] = useState(initialContent.heroText);
  const [displayMode, setDisplayMode] = useState(initialContent.displayMode);
  const [videoName, setVideoName] = useState(
    initialContent.backgroundVideoName
  );
  const [videoUrl, setVideoUrl] = useState(initialContent.backgroundVideoUrl);
  const [isDragging, setIsDragging] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadFailed, setUploadFailed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploadFailed(false);
    setUploading(true);
    setUploadProgress(0);
    try {
      const url = await uploadFile(file, file.name, setUploadProgress);
      setVideoName(file.name);
      setVideoUrl(url);
      setDirty(true);
    } catch {
      setUploadFailed(true);
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await fetch("/api/content/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          heroText,
          displayMode,
          backgroundVideoName: videoName,
          backgroundVideoUrl: videoUrl,
        }),
      });
      setDirty(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-8">
      <p className="text-base text-obsidian">Background Video</p>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={uploading ? undefined : handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`mt-2 flex h-40 flex-col items-center justify-center gap-2 bg-obsidian/10 text-center transition-colors ${
          uploading ? "cursor-default" : "cursor-pointer"
        } ${isDragging ? "bg-obsidian/[.15]" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        {uploading ? (
          <>
            <p className="text-sm text-obsidian">Uploading…</p>
            <div className="h-1.5 w-48 overflow-hidden bg-obsidian/20">
              <div
                className="h-full bg-primary transition-[width]"
                style={{ width: `${Math.round(uploadProgress * 100)}%` }}
              />
            </div>
            <p className="text-xs text-obsidian/40">
              Large files can take a while — keep this tab open
            </p>
          </>
        ) : videoName ? (
          <p className="text-sm text-obsidian">{videoName}</p>
        ) : (
          <>
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
            <p className="text-xs text-obsidian/40">All video formats, upto 1GB</p>
          </>
        )}
      </div>
      {uploadFailed && (
        <p className="mt-2 text-xs text-red-600">
          Upload failed. Check your connection and try again.
        </p>
      )}

      <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div>
          <label className="flex items-center justify-between text-base text-obsidian">
            <span>Body Text</span>
            <input
              type="radio"
              name="displayMode"
              checked={displayMode === "body-text"}
              onChange={() => {
                setDisplayMode("body-text");
                setDirty(true);
              }}
              className="accent-primary"
            />
          </label>
          <input
            type="text"
            value={heroText}
            onChange={(e) => {
              setHeroText(e.target.value);
              setDirty(true);
            }}
            disabled={displayMode !== "body-text"}
            placeholder="Type Here"
            className="mt-2 w-full bg-obsidian/10 px-4 py-3.5 text-sm text-obsidian placeholder:text-obsidian/40 outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
          />
        </div>
        <div>
          <label className="flex items-center justify-between text-base text-obsidian">
            <span>Logo Only</span>
            <input
              type="radio"
              name="displayMode"
              checked={displayMode === "logo-only"}
              onChange={() => {
                setDisplayMode("logo-only");
                setDirty(true);
              }}
              className="accent-primary"
            />
          </label>
          <div className="mt-2 flex w-full items-center gap-3 bg-obsidian/10 px-4 py-3 text-sm text-obsidian/50">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-obsidian p-1.5">
              <Image src={logoOnly} alt="" className="h-full w-full object-contain" />
            </span>
            <span className="truncate">{initialContent.logoFileName}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={!dirty || saving || uploading}
          className="bg-primary px-8 py-2.5 text-sm font-medium text-bone-white transition-colors hover:brightness-90 disabled:bg-obsidian/15 disabled:text-obsidian/40 disabled:hover:brightness-100"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
