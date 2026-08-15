"use client";

import { useRef, useState } from "react";
import type { Project } from "@/types/portfolio";
import { Modal } from "@/components/admin/Modal";
import { Dropzone, formatFileSize } from "@/components/admin/Dropzone";
import { readFileAsDataUrl, captureVideoFrame } from "@/lib/files";

export function WorkFormModal({
  project,
  onClose,
  onSaved,
  onDeleteRequest,
}: {
  project?: Project;
  onClose: () => void;
  onSaved: () => void;
  onDeleteRequest?: () => void;
}) {
  const isEdit = Boolean(project);

  const [title, setTitle] = useState(project?.title ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [credits, setCredits] = useState(project?.credits ?? "");

  const [thumbnailImage, setThumbnailImage] = useState(
    project?.thumbnailImage ?? null
  );
  const [thumbnailLabel, setThumbnailLabel] = useState(
    project?.thumbnailLabel ?? null
  );

  const [videoName, setVideoName] = useState(project?.videoName ?? null);
  const [videoLabel, setVideoLabel] = useState(project?.videoLabel ?? null);
  const [videoPreviewImage, setVideoPreviewImage] = useState(
    project?.videoPreviewImage ?? null
  );

  const [photos, setPhotos] = useState<string[]>(project?.photos ?? []);
  const photosInputRef = useRef<HTMLInputElement>(null);

  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleThumbnailSelect(file: File) {
    const url = await readFileAsDataUrl(file);
    setThumbnailImage(url);
    setThumbnailLabel(`${file.name} • ${formatFileSize(file.size)}`);
    setDirty(true);
  }

  async function handleVideoSelect(file: File) {
    setVideoName(file.name);
    setVideoLabel(`${file.name} • ${formatFileSize(file.size)}`);
    setVideoPreviewImage(await captureVideoFrame(file));
    setDirty(true);
  }

  async function handlePhotosSelect(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const urls = await Promise.all(
      Array.from(fileList).map((file) => readFileAsDataUrl(file))
    );
    setPhotos((prev) => [...prev, ...urls]);
    setDirty(true);
  }

  function removePhoto(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setDirty(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const body = {
        title,
        description,
        credits,
        thumbnailImage,
        thumbnailLabel,
        videoName,
        videoLabel,
        videoPreviewImage,
        photos,
        tags: project?.tags ?? [],
      };
      await fetch(isEdit ? `/api/works/${project!.id}` : "/api/works", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal onClose={onClose}>
      <div className="flex items-start justify-between">
        <h2 className="text-xl font-semibold tracking-tight">
          {isEdit ? "Edit Work" : "Upload Work"}
        </h2>
        <button
          onClick={onClose}
          aria-label="Close"
          className="text-obsidian/50 hover:text-obsidian"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <p className="mt-1 text-sm text-obsidian/50">Upload Thumbline</p>
      <div className="mt-3 border-t border-obsidian/10" />

      <div className="mt-6 grid grid-cols-2 gap-6">
        <Dropzone
          label="Upload Thumbline"
          accept="image/*"
          helperText="MP4 formats only, upto 1GB"
          preview={
            thumbnailImage
              ? { label: thumbnailLabel ?? "", url: thumbnailImage }
              : null
          }
          onSelect={handleThumbnailSelect}
          onRemove={() => {
            setThumbnailImage(null);
            setThumbnailLabel(null);
            setDirty(true);
          }}
        />
        <Dropzone
          label="Upload Video"
          accept="video/mp4"
          helperText="MP4 formats only, upto 1GB"
          preview={
            videoName
              ? { label: videoLabel ?? "", url: videoPreviewImage }
              : null
          }
          onSelect={handleVideoSelect}
          onRemove={() => {
            setVideoName(null);
            setVideoLabel(null);
            setVideoPreviewImage(null);
            setDirty(true);
          }}
        />
      </div>

      {!isEdit && (
        <div className="mt-6">
          <p className="text-sm font-medium text-obsidian/70">Upload Photos</p>
          <div className="mt-2 flex flex-wrap gap-3">
            {photos.map((photo, index) => (
              <div
                key={index}
                className="group relative h-28 w-28 overflow-hidden border border-obsidian/10"
              >
                <img src={photo} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute right-1 top-1 hidden h-5 w-5 items-center justify-center bg-obsidian/70 text-xs text-bone-white group-hover:flex"
                >
                  &times;
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => photosInputRef.current?.click()}
              className="flex h-28 w-28 items-center justify-center border border-obsidian/10 bg-obsidian/[.05] text-2xl text-obsidian/40 hover:bg-obsidian/[.08]"
            >
              +
            </button>
            <input
              ref={photosInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handlePhotosSelect(e.target.files)}
            />
          </div>
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-6">
        <div>
          <p className="text-sm font-medium text-obsidian/70">Title Text</p>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setDirty(true);
            }}
            placeholder="Enter Title"
            className="mt-2 w-full border border-obsidian/10 bg-obsidian/[.05] px-4 py-2.5 text-sm text-obsidian placeholder:text-obsidian/40 outline-none focus:border-primary"
          />
        </div>
        <div>
          <p className="text-sm font-medium text-obsidian/70">Description</p>
          <input
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setDirty(true);
            }}
            placeholder="Enter Description"
            className="mt-2 w-full border border-obsidian/10 bg-obsidian/[.05] px-4 py-2.5 text-sm text-obsidian placeholder:text-obsidian/40 outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-6">
        <div>
          <p className="text-sm font-medium text-obsidian/70">
            Credits <span className="font-normal text-obsidian/40">(optional)</span>
          </p>
          <textarea
            value={credits}
            onChange={(e) => {
              setCredits(e.target.value);
              setDirty(true);
            }}
            placeholder="Enter Credits"
            rows={3}
            className="mt-2 w-full resize-none border border-obsidian/10 bg-obsidian/[.05] px-4 py-2.5 text-sm text-obsidian placeholder:text-obsidian/40 outline-none focus:border-primary"
          />
        </div>
        <div className="flex items-end justify-end gap-3">
          {isEdit && onDeleteRequest && (
            <button
              onClick={onDeleteRequest}
              className="border border-red-600 px-6 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={isEdit ? saving : !dirty || saving}
            className={`px-8 py-2.5 text-sm font-medium transition-colors ${
              isEdit
                ? "bg-obsidian text-bone-white hover:brightness-125"
                : "bg-primary text-bone-white hover:brightness-90 disabled:bg-obsidian/15 disabled:text-obsidian/40 disabled:hover:brightness-100"
            }`}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
