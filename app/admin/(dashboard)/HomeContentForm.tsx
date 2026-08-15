"use client";

import { useRef, useState } from "react";
import type { HomeContent } from "@/types/content";
import { readFileAsDataUrl } from "@/lib/files";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setVideoName(file.name);
    setVideoUrl(await readFileAsDataUrl(file));
    setDirty(true);
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
      <p className="text-sm font-medium text-obsidian/70">Background Video</p>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`mt-2 flex h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-obsidian/10 bg-obsidian/[.05] text-center transition-colors ${
          isDragging ? "bg-obsidian/[.09]" : ""
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        {videoName ? (
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
              <span className="text-primary underline">Click to Browse</span>
            </p>
            <p className="text-xs text-obsidian/40">MP4 formats only, upto 1GB</p>
          </>
        )}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-8">
        <div>
          <label className="flex items-center justify-between text-sm font-medium text-obsidian/70">
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
            className="mt-2 w-full rounded-md border border-obsidian/10 bg-obsidian/[.05] px-4 py-2.5 text-sm text-obsidian placeholder:text-obsidian/40 outline-none focus:border-primary disabled:opacity-50"
          />
        </div>
        <div>
          <label className="flex items-center justify-between text-sm font-medium text-obsidian/70">
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
          <div className="mt-2 w-full truncate rounded-md border border-obsidian/10 bg-obsidian/[.05] px-4 py-2.5 text-sm text-obsidian/50">
            {initialContent.logoFileName}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={!dirty || saving}
          className="rounded-md bg-primary px-8 py-2.5 text-sm font-medium text-bone-white transition-colors hover:brightness-90 disabled:bg-obsidian/15 disabled:text-obsidian/40 disabled:hover:brightness-100"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
