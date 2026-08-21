"use client";

import { useRef, useState } from "react";
import type { AboutContent, ProcessCard } from "@/types/content";
import {
  Dropzone,
  POOL_IMAGE_MIME,
  DEFAULT_FOCAL_POINT,
} from "@/components/admin/Dropzone";
import { readFileAsDataUrl } from "@/lib/files";

const fieldClass =
  "mt-2 w-full bg-obsidian/10 px-4 py-3.5 text-sm text-obsidian placeholder:text-obsidian/40 outline-none focus:ring-1 focus:ring-primary";

export function AboutContentForm({
  initialContent,
}: {
  initialContent: AboutContent;
}) {
  const [heroImage, setHeroImage] = useState(initialContent.heroImage);
  const [heroImagePosition, setHeroImagePosition] = useState(
    initialContent.heroImagePosition ?? DEFAULT_FOCAL_POINT
  );
  const [heroHeadline, setHeroHeadline] = useState(
    initialContent.heroHeadline
  );
  const [introText, setIntroText] = useState(initialContent.introText);
  const [storyImage, setStoryImage] = useState(initialContent.storyImage);
  const [storyImagePosition, setStoryImagePosition] = useState(
    initialContent.storyImagePosition ?? DEFAULT_FOCAL_POINT
  );
  const [storyText, setStoryText] = useState(initialContent.storyText);
  const [founderPhoto, setFounderPhoto] = useState(
    initialContent.founderPhoto
  );
  const [founderPhotoPosition, setFounderPhotoPosition] = useState(
    initialContent.founderPhotoPosition ?? DEFAULT_FOCAL_POINT
  );
  const [founderName, setFounderName] = useState(initialContent.founderName);
  const [founderTitle, setFounderTitle] = useState(
    initialContent.founderTitle
  );
  const [bio, setBio] = useState(initialContent.bio);
  const [linkedinUrl, setLinkedinUrl] = useState(initialContent.linkedinUrl);
  const [instagramUrl, setInstagramUrl] = useState(
    initialContent.instagramUrl
  );
  const [processCards, setProcessCards] = useState<ProcessCard[]>(
    initialContent.processCards
  );
  const [trustedByLogos, setTrustedByLogos] = useState<string[]>(
    initialContent.trustedByLogos
  );
  const [ctaText, setCtaText] = useState(initialContent.ctaText);
  const [ctaBackgroundImage, setCtaBackgroundImage] = useState(
    initialContent.ctaBackgroundImage
  );
  const [ctaBackgroundImagePosition, setCtaBackgroundImagePosition] =
    useState(initialContent.ctaBackgroundImagePosition ?? DEFAULT_FOCAL_POINT);

  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const logosInputRef = useRef<HTMLInputElement>(null);

  // Shared "Image Library" — upload once here, then drag a thumbnail onto
  // whichever section Dropzone it belongs to (or use the "Assign to"
  // picker). Keeps the admin from having to know in advance which of the
  // several image slots on this page a given upload is meant for.
  const [imagePool, setImagePool] = useState<string[]>([]);
  const poolInputRef = useRef<HTMLInputElement>(null);
  const [isPoolDragging, setIsPoolDragging] = useState(false);

  function update<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value);
      setDirty(true);
    };
  }

  async function handlePoolSelect(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const urls = await Promise.all(
      Array.from(fileList).map((file) => readFileAsDataUrl(file))
    );
    setImagePool((prev) => [...prev, ...urls]);
  }

  function removeFromPool(url: string) {
    setImagePool((prev) => prev.filter((u) => u !== url));
  }

  const assignTargets: {
    label: string;
    setter: (value: string | null) => void;
  }[] = [
    { label: "Hero Image", setter: setHeroImage },
    { label: "Story Image", setter: setStoryImage },
    { label: "Founder Photo", setter: setFounderPhoto },
    { label: "CTA Background Image", setter: setCtaBackgroundImage },
  ];

  function assignPoolImage(url: string, targetLabel: string) {
    if (targetLabel === "Trusted By Logos") {
      setTrustedByLogos((prev) => [...prev, url]);
    } else {
      const target = assignTargets.find((t) => t.label === targetLabel);
      target?.setter(url);
    }
    setDirty(true);
    removeFromPool(url);
  }

  function updateCard(index: number, patch: Partial<ProcessCard>) {
    setProcessCards((prev) =>
      prev.map((card, i) => (i === index ? { ...card, ...patch } : card))
    );
    setDirty(true);
  }

  async function handleLogosSelect(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const urls = await Promise.all(
      Array.from(fileList).map((file) => readFileAsDataUrl(file))
    );
    setTrustedByLogos((prev) => [...prev, ...urls]);
    setDirty(true);
  }

  function removeLogo(index: number) {
    setTrustedByLogos((prev) => prev.filter((_, i) => i !== index));
    setDirty(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await fetch("/api/content/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          heroImage,
          heroImagePosition,
          heroHeadline,
          introText,
          storyImage,
          storyImagePosition,
          storyText,
          founderPhoto,
          founderPhotoPosition,
          founderName,
          founderTitle,
          bio,
          linkedinUrl,
          instagramUrl,
          processCards,
          trustedByLogos,
          ctaText,
          ctaBackgroundImagePosition,
          ctaBackgroundImage,
        }),
      });
      setDirty(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-8 space-y-10">
      <div>
        <p className="text-2xl text-obsidian">Image Library</p>
        <p className="mt-1 text-xs text-obsidian/40">
          Upload images here, then drag a thumbnail onto the section below it
          belongs to (or pick a section from its dropdown).
        </p>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsPoolDragging(true);
          }}
          onDragLeave={() => setIsPoolDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsPoolDragging(false);
            void handlePoolSelect(e.dataTransfer.files);
          }}
          onClick={() => poolInputRef.current?.click()}
          className={`mt-2 flex min-h-24 cursor-pointer flex-wrap items-start gap-3 border border-dashed border-obsidian/15 bg-obsidian/[.03] p-3 transition-colors ${
            isPoolDragging ? "bg-primary/10 ring-2 ring-primary" : ""
          }`}
        >
          <input
            ref={poolInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              void handlePoolSelect(e.target.files);
              e.target.value = "";
            }}
          />
          {imagePool.length === 0 && (
            <p className="w-full py-4 text-center text-sm text-obsidian/40">
              Drag and Drop or{" "}
              <span className="text-primary underline">Click to Browse</span>
            </p>
          )}
          {imagePool.map((url, index) => (
            <div
              key={index}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData(POOL_IMAGE_MIME, url);
                e.dataTransfer.effectAllowed = "move";
              }}
              onClick={(e) => e.stopPropagation()}
              className="group relative flex w-32 shrink-0 cursor-grab flex-col border border-obsidian/10 bg-white active:cursor-grabbing"
            >
              <div className="relative h-20 w-full overflow-hidden bg-obsidian/[.05]">
                <img
                  src={url}
                  alt=""
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeFromPool(url)}
                  className="absolute right-1 top-1 hidden h-5 w-5 items-center justify-center bg-obsidian/70 text-xs text-bone-white group-hover:flex"
                >
                  &times;
                </button>
              </div>
              <select
                defaultValue=""
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                  if (e.target.value) assignPoolImage(url, e.target.value);
                }}
                className="w-full border-t border-obsidian/10 bg-white px-1 py-1 text-[10px] text-obsidian/70 outline-none"
              >
                <option value="" disabled>
                  Assign to…
                </option>
                {assignTargets.map((t) => (
                  <option key={t.label} value={t.label}>
                    {t.label}
                  </option>
                ))}
                <option value="Trusted By Logos">Trusted By Logos</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-obsidian/10 pt-10">
        <p className="text-2xl text-obsidian">Hero Section</p>
        <div className="mt-6">
          <Dropzone
            label="Hero Image"
            accept="image/*"
            helperText="JPG or PNG, upto 10MB"
            preview={
              heroImage ? { label: "Hero image", url: heroImage } : null
            }
            onSelect={async (file) => {
              update(setHeroImage)(await readFileAsDataUrl(file));
            }}
            onRemove={() => update(setHeroImage)(null)}
            onDropUrl={(url) => assignPoolImage(url, "Hero Image")}
            focalPoint={heroImagePosition}
            onFocalPointChange={update(setHeroImagePosition)}
          />
        </div>
        <div className="mt-4">
          <p className="text-base text-obsidian">Hero Headline</p>
          <input
            value={heroHeadline}
            onChange={(e) => update(setHeroHeadline)(e.target.value)}
            placeholder="Enter Hero Headline"
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <p className="text-base text-obsidian">Intro Text</p>
        <textarea
          value={introText}
          onChange={(e) => update(setIntroText)(e.target.value)}
          placeholder="Type Here"
          rows={4}
          className={`${fieldClass} resize-none`}
        />
      </div>

      <div className="border-t border-obsidian/10 pt-10">
        <p className="text-2xl text-obsidian">Story Section</p>
        <div className="mt-6 grid grid-cols-2 gap-6">
          <div className="flex flex-col">
            <p className="text-base text-obsidian">Story Text</p>
            <textarea
              value={storyText}
              onChange={(e) => update(setStoryText)(e.target.value)}
              placeholder="Type Here"
              rows={8}
              className={`${fieldClass} resize-none`}
            />
          </div>
          <Dropzone
            label="Story Image"
            accept="image/*"
            helperText="JPG or PNG, upto 10MB"
            preview={
              storyImage ? { label: "Story image", url: storyImage } : null
            }
            onSelect={async (file) => {
              update(setStoryImage)(await readFileAsDataUrl(file));
            }}
            onRemove={() => update(setStoryImage)(null)}
            onDropUrl={(url) => assignPoolImage(url, "Story Image")}
            focalPoint={storyImagePosition}
            onFocalPointChange={update(setStoryImagePosition)}
          />
        </div>
      </div>

      <div className="border-t border-obsidian/10 pt-10">
        <p className="text-2xl text-obsidian">Founder Profile</p>
        <div className="mt-6 grid grid-cols-2 gap-6">
          <Dropzone
            label="Founder Photo"
            accept="image/*"
            helperText="JPG or PNG, upto 10MB"
            preview={
              founderPhoto ? { label: "Founder photo", url: founderPhoto } : null
            }
            onSelect={async (file) => {
              update(setFounderPhoto)(await readFileAsDataUrl(file));
            }}
            onRemove={() => update(setFounderPhoto)(null)}
            onDropUrl={(url) => assignPoolImage(url, "Founder Photo")}
            focalPoint={founderPhotoPosition}
            onFocalPointChange={update(setFounderPhotoPosition)}
          />
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-base text-obsidian">Name</p>
              <input
                value={founderName}
                onChange={(e) => update(setFounderName)(e.target.value)}
                placeholder="Enter Name"
                className={fieldClass}
              />
            </div>
            <div>
              <p className="text-base text-obsidian">Title</p>
              <input
                value={founderTitle}
                onChange={(e) => update(setFounderTitle)(e.target.value)}
                placeholder="Enter Title"
                className={fieldClass}
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-base text-obsidian">Bio</p>
          <textarea
            value={bio}
            onChange={(e) => update(setBio)(e.target.value)}
            placeholder="Type Here"
            rows={4}
            className={`${fieldClass} resize-none`}
          />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-6">
          <div>
            <p className="text-base text-obsidian">LinkedIn URL</p>
            <input
              value={linkedinUrl}
              onChange={(e) => update(setLinkedinUrl)(e.target.value)}
              placeholder="https://linkedin.com/in/..."
              className={fieldClass}
            />
          </div>
          <div>
            <p className="text-base text-obsidian">Instagram URL</p>
            <input
              value={instagramUrl}
              onChange={(e) => update(setInstagramUrl)(e.target.value)}
              placeholder="https://instagram.com/..."
              className={fieldClass}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-obsidian/10 pt-10">
        <p className="text-2xl text-obsidian">Points Section</p>
        <div className="mt-6 grid grid-cols-3 gap-6">
          {processCards.map((card, index) => (
            <div key={index}>
              <input
                value={card.title}
                onChange={(e) =>
                  updateCard(index, { title: e.target.value })
                }
                placeholder="Card Title"
                className={fieldClass}
              />
              <textarea
                value={card.description}
                onChange={(e) =>
                  updateCard(index, { description: e.target.value })
                }
                placeholder="Card Description"
                rows={5}
                className={`${fieldClass} resize-none`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-obsidian/10 pt-10">
        <p className="text-2xl text-obsidian">Trusted Brands</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {trustedByLogos.map((logo, index) => (
            <div
              key={index}
              className="group relative flex size-[126px] items-center justify-center overflow-hidden bg-obsidian/10"
            >
              <img src={logo} alt="" className="max-h-full max-w-full object-contain p-2" />
              <button
                type="button"
                onClick={() => removeLogo(index)}
                className="absolute right-1 top-1 hidden h-5 w-5 items-center justify-center bg-obsidian/70 text-xs text-bone-white group-hover:flex"
              >
                &times;
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => logosInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const poolUrl = e.dataTransfer.getData(POOL_IMAGE_MIME);
              if (poolUrl) assignPoolImage(poolUrl, "Trusted By Logos");
            }}
            className="flex size-[126px] items-center justify-center bg-obsidian/10 text-2xl text-obsidian/40 hover:bg-obsidian/[.15]"
          >
            +
          </button>
          <input
            ref={logosInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleLogosSelect(e.target.files)}
          />
        </div>
      </div>

      <div className="border-t border-obsidian/10 pt-10">
        <p className="text-2xl text-obsidian">Call to Action</p>
        <div className="mt-6 grid grid-cols-2 gap-6">
          <input
            value={ctaText}
            onChange={(e) => update(setCtaText)(e.target.value)}
            placeholder="Enter CTA Text"
            className={fieldClass}
          />
        </div>
        <div className="mt-4">
          <Dropzone
            label="CTA Background Image"
            accept="image/*"
            helperText="JPG or PNG, upto 10MB"
            preview={
              ctaBackgroundImage
                ? { label: "CTA background", url: ctaBackgroundImage }
                : null
            }
            onSelect={async (file) => {
              update(setCtaBackgroundImage)(await readFileAsDataUrl(file));
            }}
            onRemove={() => update(setCtaBackgroundImage)(null)}
            onDropUrl={(url) => assignPoolImage(url, "CTA Background Image")}
            focalPoint={ctaBackgroundImagePosition}
            onFocalPointChange={update(setCtaBackgroundImagePosition)}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={!dirty || saving}
          className="bg-primary px-8 py-2.5 text-sm font-medium text-bone-white transition-colors hover:brightness-90 disabled:bg-obsidian/15 disabled:text-obsidian/40 disabled:hover:brightness-100"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
