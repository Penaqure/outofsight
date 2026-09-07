"use client";

import { useRef, useState } from "react";
import type { Project } from "@/types/portfolio";
import { Modal } from "@/components/admin/Modal";
import {
  Dropzone,
  formatFileSize,
  DEFAULT_FOCAL_POINT,
} from "@/components/admin/Dropzone";
import { captureVideoFrame } from "@/lib/files";
import { uploadFile } from "@/lib/blob-upload";

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
  const [thumbnailImagePosition, setThumbnailImagePosition] = useState(
    project?.thumbnailImagePosition ?? DEFAULT_FOCAL_POINT
  );
  const [thumbnailLabel, setThumbnailLabel] = useState(
    project?.thumbnailLabel ?? null
  );

  const [videoName, setVideoName] = useState(project?.videoName ?? null);
  const [videoLabel, setVideoLabel] = useState(project?.videoLabel ?? null);
  const [videoUrl, setVideoUrl] = useState(project?.videoUrl ?? null);
  const [videoPreviewImage, setVideoPreviewImage] = useState(
    project?.videoPreviewImage ?? null
  );
  const videoPreviewImagePosition =
    project?.videoPreviewImagePosition ?? DEFAULT_FOCAL_POINT;
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoUploadFailed, setVideoUploadFailed] = useState(false);
  const [videoDragging, setVideoDragging] = useState(false);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [photos, setPhotos] = useState<string[]>(project?.photos ?? []);
  const photosInputRef = useRef<HTMLInputElement>(null);
  const [photosUploading, setPhotosUploading] = useState(false);

  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleThumbnailSelect(file: File) {
    const url = await uploadFile(file);
    setThumbnailImage(url);
    setThumbnailLabel(`${file.name} • ${formatFileSize(file.size)}`);
    setDirty(true);
  }

  async function handleVideoSelect(file: File) {
    setVideoUploadFailed(false);
    setVideoUploading(true);
    setVideoProgress(0);
    try {
      // The video file itself is uploaded (and played on the project detail
      // page); the captured frame becomes its poster.
      const url = await uploadFile(file, file.name, setVideoProgress);
      setVideoName(file.name);
      setVideoLabel(`${file.name} • ${formatFileSize(file.size)}`);
      setVideoUrl(url);
      const frame = await captureVideoFrame(file);
      setVideoPreviewImage(
        frame ? await uploadFile(frame, "preview.jpg") : null
      );
      setDirty(true);
    } catch {
      setVideoUploadFailed(true);
    } finally {
      setVideoUploading(false);
    }
  }

  function removeVideo() {
    setVideoName(null);
    setVideoLabel(null);
    setVideoUrl(null);
    setVideoPreviewImage(null);
    setDirty(true);
  }

  async function handlePhotosSelect(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setPhotosUploading(true);
    try {
      const urls = await Promise.all(
        Array.from(fileList).map((file) => uploadFile(file))
      );
      setPhotos((prev) => [...prev, ...urls]);
      setDirty(true);
    } finally {
      setPhotosUploading(false);
    }
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
        thumbnailImagePosition,
        thumbnailLabel,
        videoName,
        videoLabel,
        videoUrl,
        videoPreviewImage,
        videoPreviewImagePosition,
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

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Dropzone
          label="Upload Thumbline"
          accept="image/*"
          helperText="JPG or PNG, upto 10MB"
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
          focalPoint={thumbnailImagePosition}
          onFocalPointChange={(position) => {
            setThumbnailImagePosition(position);
            setDirty(true);
          }}
        />
        <div>
          <p className="text-base text-obsidian">Upload Video</p>
          <p className="mt-0.5 min-h-4 text-xs text-obsidian/40">
            {videoUrl ? "Plays with sound on the project page." : ""}
          </p>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              if (!videoUploading) setVideoDragging(true);
            }}
            onDragLeave={() => setVideoDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setVideoDragging(false);
              if (videoUploading) return;
              const file = e.dataTransfer.files?.[0];
              if (file) handleVideoSelect(file);
            }}
            onClick={() =>
              !videoUploading && !videoUrl && videoInputRef.current?.click()
            }
            className={`relative mt-2 flex h-40 flex-col items-center justify-center gap-2 overflow-hidden border border-obsidian/10 bg-obsidian/[.05] text-center transition-colors ${
              videoUploading || videoUrl ? "" : "cursor-pointer"
            } ${videoDragging ? "bg-primary/10 ring-2 ring-primary" : ""}`}
          >
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleVideoSelect(file);
                e.target.value = "";
              }}
            />
            {videoUploading ? (
              <>
                <p className="text-sm text-obsidian">
                  Uploading… {Math.round(videoProgress * 100)}%
                </p>
                <div className="h-1.5 w-48 overflow-hidden bg-obsidian/20">
                  <div
                    className="h-full bg-primary transition-[width]"
                    style={{ width: `${Math.round(videoProgress * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-obsidian/40">
                  Large files can take a while — keep this tab open
                </p>
              </>
            ) : videoUrl ? (
              <>
                {videoPreviewImage && (
                  <img
                    src={videoPreviewImage}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-obsidian/80 to-transparent px-4 py-3">
                  <span className="truncate text-xs text-bone-white">
                    {videoLabel ?? videoName}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeVideo();
                    }}
                    className="shrink-0 border border-bone-white/50 px-3 py-1 text-xs text-bone-white hover:bg-bone-white/10"
                  >
                    Delete
                  </button>
                </div>
              </>
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
                <p className="text-xs text-obsidian/40">
                  All video formats, upto 1GB
                </p>
              </>
            )}
          </div>
          {videoUploadFailed && (
            <p className="mt-1 text-xs text-red-600">
              Upload failed. Check your connection and try again.
            </p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <p className="text-base text-obsidian">Upload Photos</p>
        <p className="mt-0.5 text-xs text-obsidian/40">
          The first 4 show in a row under the video on the project page.
        </p>
        <div className="mt-2 flex flex-wrap gap-3">
          {photos.map((photo, index) => (
            <div
              key={index}
              className={`group relative h-28 w-28 overflow-hidden border ${
                index < 4 ? "border-obsidian/10" : "border-obsidian/10 opacity-50"
              }`}
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
          {photosUploading && (
            <div className="flex h-28 w-28 flex-col items-center justify-center gap-2 border border-obsidian/10 bg-obsidian/[.05]">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-obsidian/20 border-t-primary" />
              <span className="text-[10px] text-obsidian/50">Uploading…</span>
            </div>
          )}
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
            onChange={(e) => {
              handlePhotosSelect(e.target.files);
              e.target.value = "";
            }}
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <p className="text-base text-obsidian">Title Text</p>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setDirty(true);
            }}
            placeholder="Enter Title"
            className="mt-2 w-full bg-obsidian/10 px-4 py-3.5 text-sm text-obsidian placeholder:text-obsidian/40 outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <p className="text-base text-obsidian">Description</p>
          <input
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setDirty(true);
            }}
            placeholder="Enter Description"
            className="mt-2 w-full bg-obsidian/10 px-4 py-3.5 text-sm text-obsidian placeholder:text-obsidian/40 outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <p className="text-base text-obsidian">
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
            className="mt-2 w-full resize-none bg-obsidian/10 px-4 py-3.5 text-sm text-obsidian placeholder:text-obsidian/40 outline-none focus:ring-1 focus:ring-primary"
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
            disabled={
              videoUploading ||
              photosUploading ||
              saving ||
              (!isEdit && !dirty)
            }
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
