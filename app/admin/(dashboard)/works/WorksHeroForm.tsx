"use client";

import { useState } from "react";
import type { WorksContent } from "@/types/content";
import { Dropzone, DEFAULT_FOCAL_POINT } from "@/components/admin/Dropzone";
import { uploadFile } from "@/lib/blob-upload";
import { SaveBar, useSave } from "@/components/admin/SaveBar";

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
  const [trustedByHeading, setTrustedByHeading] = useState(
    initialContent.trustedByHeading
  );
  const [trustedByDescription, setTrustedByDescription] = useState(
    initialContent.trustedByDescription
  );

  const [dirty, setDirty] = useState(false);
  const { saving, status, save, clearStatus } = useSave("/api/content/works");

  function update<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value);
      setDirty(true);
      clearStatus();
    };
  }

  async function handleSave() {
    const ok = await save({
      heroImage,
      heroImagePosition,
      heroHeading,
      heroDescription,
      trustedByHeading,
      trustedByDescription,
    });
    if (ok) setDirty(false);
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
          update(setHeroImage)(await uploadFile(file));
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
      <div className="border-t border-obsidian/10 pt-6">
        <p className="text-2xl text-obsidian">Trusted By Section</p>
        <p className="mt-1 text-xs text-obsidian/40">
          The client logos are managed under About → Trusted Brands. This
          section is hidden until at least one logo is added.
        </p>
      </div>
      <div>
        <p className="text-base text-obsidian">Heading</p>
        <input
          value={trustedByHeading}
          onChange={(e) => update(setTrustedByHeading)(e.target.value)}
          placeholder="Enter Heading"
          className={fieldClass}
        />
      </div>
      <div>
        <p className="text-base text-obsidian">Description</p>
        <textarea
          value={trustedByDescription}
          onChange={(e) => update(setTrustedByDescription)(e.target.value)}
          placeholder="Type Here"
          rows={3}
          className={`${fieldClass} resize-none`}
        />
      </div>
      <SaveBar
        status={status}
        saving={saving}
        disabled={!dirty || saving}
        onSave={handleSave}
      />
    </div>
  );
}
