"use client";

import { useRef, useState } from "react";
import type { AboutContent, ProcessCard } from "@/types/content";
import { Dropzone } from "@/components/admin/Dropzone";
import { readFileAsDataUrl } from "@/lib/files";

const fieldClass =
  "mt-2 w-full border border-obsidian/10 bg-obsidian/[.05] px-4 py-2.5 text-sm text-obsidian placeholder:text-obsidian/40 outline-none focus:border-primary";

export function AboutContentForm({
  initialContent,
}: {
  initialContent: AboutContent;
}) {
  const [heroImage, setHeroImage] = useState(initialContent.heroImage);
  const [founderPhoto, setFounderPhoto] = useState(
    initialContent.founderPhoto
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

  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const logosInputRef = useRef<HTMLInputElement>(null);

  function update<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value);
      setDirty(true);
    };
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
          founderPhoto,
          founderName,
          founderTitle,
          bio,
          linkedinUrl,
          instagramUrl,
          processCards,
          trustedByLogos,
          ctaText,
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
      <Dropzone
        label="Hero Image"
        accept="image/*"
        helperText="JPG or PNG, upto 10MB"
        preview={heroImage ? { label: "Hero image", url: heroImage } : null}
        onSelect={async (file) => {
          update(setHeroImage)(await readFileAsDataUrl(file));
        }}
        onRemove={() => update(setHeroImage)(null)}
      />

      <div>
        <p className="text-sm font-medium text-obsidian/70">
          Founder Profile
        </p>
        <div className="mt-2 grid grid-cols-2 gap-6">
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
          />
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm font-medium text-obsidian/70">Name</p>
              <input
                value={founderName}
                onChange={(e) => update(setFounderName)(e.target.value)}
                placeholder="Enter Name"
                className={fieldClass}
              />
            </div>
            <div>
              <p className="text-sm font-medium text-obsidian/70">Title</p>
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
          <p className="text-sm font-medium text-obsidian/70">Bio</p>
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
            <p className="text-sm font-medium text-obsidian/70">
              LinkedIn URL
            </p>
            <input
              value={linkedinUrl}
              onChange={(e) => update(setLinkedinUrl)(e.target.value)}
              placeholder="https://linkedin.com/in/..."
              className={fieldClass}
            />
          </div>
          <div>
            <p className="text-sm font-medium text-obsidian/70">
              Instagram URL
            </p>
            <input
              value={instagramUrl}
              onChange={(e) => update(setInstagramUrl)(e.target.value)}
              placeholder="https://instagram.com/..."
              className={fieldClass}
            />
          </div>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-obsidian/70">Process Cards</p>
        <div className="mt-2 grid grid-cols-3 gap-6">
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

      <div>
        <p className="text-sm font-medium text-obsidian/70">
          Trusted By Logos
        </p>
        <div className="mt-2 flex flex-wrap gap-3">
          {trustedByLogos.map((logo, index) => (
            <div
              key={index}
              className="group relative flex h-20 w-28 items-center justify-center overflow-hidden border border-obsidian/10 bg-obsidian/[.05]"
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
            className="flex h-20 w-28 items-center justify-center border border-obsidian/10 bg-obsidian/[.05] text-2xl text-obsidian/40 hover:bg-obsidian/[.08]"
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

      <div>
        <p className="text-sm font-medium text-obsidian/70">
          Call to Action
        </p>
        <div className="mt-2 grid grid-cols-2 gap-6">
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
