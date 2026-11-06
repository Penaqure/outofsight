"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { HomeContent } from "@/types/content";
import { HOME_CLIENT_LOGO_SLOTS } from "@/lib/config";
import { uploadFile } from "@/lib/blob-upload";
import { SaveBar, useSave } from "@/components/admin/SaveBar";
import logoOnly from "@/public/logo/logo_only.png";

const fieldClass =
  "mt-2 w-full bg-obsidian/10 px-4 py-3.5 text-sm text-obsidian placeholder:text-obsidian/40 outline-none focus:ring-1 focus:ring-primary";

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
  const { saving, status, save, clearStatus } = useSave("/api/content/home");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadFailed, setUploadFailed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [clientsEnabled, setClientsEnabled] = useState(
    initialContent.clientsEnabled
  );
  const [clientsHeading, setClientsHeading] = useState(
    initialContent.clientsHeading
  );
  const [clientsDescription, setClientsDescription] = useState(
    initialContent.clientsDescription
  );
  const [clientsLogos, setClientsLogos] = useState<string[]>(
    initialContent.clientsLogos
  );
  const [logosUploading, setLogosUploading] = useState(false);
  const [logosUploadFailed, setLogosUploadFailed] = useState(false);
  const [logosSkipped, setLogosSkipped] = useState(0);
  const logosInputRef = useRef<HTMLInputElement>(null);

  function markDirty() {
    setDirty(true);
    clearStatus();
  }

  async function handleLogosSelect(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    // Only fill the slots that are free; anything extra is reported, not saved.
    const selected = Array.from(fileList);
    const files = selected.slice(0, HOME_CLIENT_LOGO_SLOTS - clientsLogos.length);
    setLogosSkipped(selected.length - files.length);
    if (files.length === 0) return;
    setLogosUploadFailed(false);
    setLogosUploading(true);
    try {
      const urls = await Promise.all(files.map((file) => uploadFile(file)));
      setClientsLogos((prev) => [...prev, ...urls]);
      markDirty();
    } catch {
      setLogosUploadFailed(true);
    } finally {
      setLogosUploading(false);
    }
  }

  function removeLogo(index: number) {
    setClientsLogos((prev) => prev.filter((_, i) => i !== index));
    setLogosSkipped(0);
    markDirty();
  }

  async function handleFile(file: File) {
    setUploadFailed(false);
    setUploading(true);
    setUploadProgress(0);
    try {
      const url = await uploadFile(file, file.name, setUploadProgress);
      setVideoName(file.name);
      setVideoUrl(url);
      setDirty(true);
      clearStatus();
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
    const ok = await save({
      heroText,
      displayMode,
      backgroundVideoName: videoName,
      backgroundVideoUrl: videoUrl,
      clientsEnabled,
      clientsHeading,
      clientsDescription,
      clientsLogos,
    });
    if (ok) setDirty(false);
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

      <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
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
                clearStatus();
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
              clearStatus();
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
                clearStatus();
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
        <div>
          <label className="flex items-center justify-between text-base text-obsidian">
            <span>Blank</span>
            <input
              type="radio"
              name="displayMode"
              checked={displayMode === "blank"}
              onChange={() => {
                setDisplayMode("blank");
                setDirty(true);
                clearStatus();
              }}
              className="accent-primary"
            />
          </label>
          <div className="mt-2 flex h-[46px] w-full items-center bg-obsidian/10 px-4 text-sm text-obsidian/50">
            No text or logo — background only
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-obsidian/10 pt-10">
        <div className="flex items-center justify-between gap-6">
          <div>
            <p className="text-2xl text-obsidian">Clients Section</p>
            <p className="mt-1 text-xs text-obsidian/40">
              {!clientsEnabled
                ? "This section and the footer are hidden on the home page. Your content below is kept."
                : clientsLogos.length === 0
                  ? "Add at least one logo to show this section and the footer on the home page."
                  : "Shown on the home page, below the hero, followed by the footer. These logos are separate from the About page."}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={clientsEnabled}
            aria-label="Show clients section on the home page"
            onClick={() => {
              setClientsEnabled((enabled) => !enabled);
              markDirty();
            }}
            className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
              clientsEnabled ? "bg-primary" : "bg-obsidian/20"
            }`}
          >
            <span
              className={`absolute top-1 left-1 size-5 rounded-full bg-white transition-transform ${
                clientsEnabled ? "translate-x-5" : ""
              }`}
            />
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <p className="text-base text-obsidian">Heading</p>
            <input
              type="text"
              value={clientsHeading}
              onChange={(e) => {
                setClientsHeading(e.target.value);
                markDirty();
              }}
              placeholder="Enter Heading"
              className={fieldClass}
            />
          </div>
          <div>
            <p className="text-base text-obsidian">Description</p>
            <textarea
              value={clientsDescription}
              onChange={(e) => {
                setClientsDescription(e.target.value);
                markDirty();
              }}
              placeholder="Type Here"
              rows={3}
              className={`${fieldClass} resize-none`}
            />
          </div>
        </div>

        <div className="mt-6 flex items-baseline justify-between gap-4">
          <p className="text-base text-obsidian">Client Logos</p>
          <p className="text-xs text-obsidian/50">
            {clientsLogos.length} of {HOME_CLIENT_LOGO_SLOTS} used
          </p>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-7">
          {clientsLogos.map((logo, index) => (
            <div
              key={`${logo}-${index}`}
              className="group relative flex aspect-square items-center justify-center overflow-hidden bg-obsidian/10"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo}
                alt=""
                className="max-h-full max-w-full object-contain p-2"
              />
              <button
                type="button"
                onClick={() => removeLogo(index)}
                aria-label={`Remove logo ${index + 1}`}
                className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center bg-obsidian/70 text-xs text-bone-white opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
              >
                &times;
              </button>
            </div>
          ))}
          {Array.from(
            { length: Math.max(HOME_CLIENT_LOGO_SLOTS - clientsLogos.length, 0) },
            (_, slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => logosInputRef.current?.click()}
                disabled={logosUploading}
                aria-label={`Add client logo, slot ${clientsLogos.length + slot + 1}`}
                className="flex aspect-square items-center justify-center border border-dashed border-obsidian/20 text-2xl text-obsidian/40 hover:bg-obsidian/[.05] disabled:cursor-default"
              >
                {logosUploading && slot === 0 ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-obsidian/20 border-t-primary" />
                ) : (
                  "+"
                )}
              </button>
            )
          )}
          <input
            ref={logosInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              void handleLogosSelect(e.target.files);
              e.target.value = "";
            }}
          />
        </div>
        {logosSkipped > 0 && (
          <p className="mt-2 text-xs text-red-600">
            Only {HOME_CLIENT_LOGO_SLOTS} logos fit, so {logosSkipped} of the
            selected files {logosSkipped === 1 ? "was" : "were"} not added.
          </p>
        )}
        {logosUploadFailed && (
          <p className="mt-2 text-xs text-red-600">
            Some logos failed to upload. Check your connection and try again.
          </p>
        )}
      </div>

      <div className="mt-8">
        <SaveBar
          status={status}
          saving={saving}
          disabled={!dirty || saving || uploading || logosUploading}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
