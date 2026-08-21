"use client";

import { useState } from "react";
import type { WorksContent } from "@/types/content";
import { Dropzone, DEFAULT_FOCAL_POINT } from "@/components/admin/Dropzone";
import { readFileAsDataUrl } from "@/lib/files";

const fieldClass =
  "mt-2 w-full bg-obsidian/10 px-4 py-3.5 text-sm text-obsidian placeholder:text-obsidian/40 outline-none focus:ring-1 focus:ring-primary";

export function WorksHeroForm({
  initialContent,
}: {
  initialContent: WorksContent;
}) {
  const [heroImage, setHeroImage] = useState(initialContent.heroImage);
  const [heroImagePosition, setHeroImagePosition] = useState(
    initialContent.heroImagePosition ?? DEFAULT_FOCAL_POINT
  );
  const [heroHeading, setHeroHeading] = useState(initialContent.heroHeading);
  const [heroDescription, setHeroDescription] = useState(
    initialContent.heroDescription
  );

  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  function update<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value);
      setDirty(true);
    };
  }

  async function handleSave() {
    setSaving(true);
    try {
      await fetch("/api/content/works", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          heroImage,
          heroImagePosition,
          heroHeading,
          heroDescription,
        }),
      });
      setDirty(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mb-10 space-y-6 border-b border-obsidian/10 pb-10">
      <p className="text-2xl text-obsidian">Hero Section</p>
      <Dropzone
        label="Hero Image"
        accept="image/*"
        helperText="JPG or PNG, upto 10MB"
        preview={heroImage ? { label: "Hero image", url: heroImage } : null}
        onSelect={async (file) => {
          update(setHeroImage)(await readFileAsDataUrl(file));
        }}
        onRemove={() => update(setHeroImage)(null)}
        focalPoint={heroImagePosition}
        onFocalPointChange={update(setHeroImagePosition)}
      />
      <div>
        <p className="text-base text-obsidian">Heading</p>
        <input
          value={heroHeading}
          onChange={(e) => update(setHeroHeading)(e.target.value)}
          placeholder="Enter Heading"
          className={fieldClass}
        />
      </div>
      <div>
        <p className="text-base text-obsidian">Description</p>
        <textarea
          value={heroDescription}
          onChange={(e) => update(setHeroDescription)(e.target.value)}
          placeholder="Type Here"
          rows={4}
          className={`${fieldClass} resize-none`}
        />
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
