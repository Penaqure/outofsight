"use client";

import { useState } from "react";
import type { FooterContent, FooterLink } from "@/types/content";
import { SaveBar, useSave } from "@/components/admin/SaveBar";

const fieldClass =
  "w-full bg-obsidian/10 px-4 py-3.5 text-sm text-obsidian placeholder:text-obsidian/40 outline-none focus:ring-1 focus:ring-primary";

const iconButtonClass =
  "px-2 py-1 text-xs text-obsidian/60 hover:text-obsidian disabled:opacity-30 disabled:hover:text-obsidian/60";

export function FooterContentForm({
  initialContent,
}: {
  initialContent: FooterContent;
}) {
  const [links, setLinks] = useState<FooterLink[]>(initialContent.mediaLinks);
  const [dirty, setDirty] = useState(false);
  const { saving, status, save, clearStatus } = useSave("/api/content/footer");

  function change(next: FooterLink[]) {
    setLinks(next);
    setDirty(true);
    clearStatus();
  }

  function updateLink(index: number, patch: Partial<FooterLink>) {
    change(links.map((link, i) => (i === index ? { ...link, ...patch } : link)));
  }

  function moveLink(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= links.length) return;
    const next = [...links];
    [next[index], next[target]] = [next[target], next[index]];
    change(next);
  }

  async function handleSave() {
    // Rows without a label are dropped by the server; drop them here too
    // so the form matches what was saved.
    const cleaned = links.filter((link) => link.label.trim());
    const ok = await save({ mediaLinks: cleaned });
    if (ok) {
      setLinks(cleaned);
      setDirty(false);
    }
  }

  return (
    <div className="mt-8">
      <p className="text-base text-obsidian">Media Links</p>
      <p className="mt-1 text-xs text-obsidian/60">
        A link without a URL is kept here but hidden on the site.
      </p>

      <div className="mt-4 flex flex-col gap-4">
        {links.map((link, index) => (
          <div
            key={index}
            className="grid grid-cols-1 gap-2 sm:grid-cols-[200px_1fr_auto] sm:items-center sm:gap-4"
          >
            <input
              value={link.label}
              onChange={(e) => updateLink(index, { label: e.target.value })}
              placeholder="Label (e.g. Instagram)"
              aria-label={`Link ${index + 1} label`}
              className={fieldClass}
            />
            <input
              value={link.url}
              onChange={(e) => updateLink(index, { url: e.target.value })}
              placeholder="https://..."
              aria-label={`Link ${index + 1} URL`}
              className={fieldClass}
            />
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => moveLink(index, -1)}
                disabled={index === 0}
                aria-label="Move up"
                className={iconButtonClass}
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => moveLink(index, 1)}
                disabled={index === links.length - 1}
                aria-label="Move down"
                className={iconButtonClass}
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => change(links.filter((_, i) => i !== index))}
                className="px-2 py-1 text-xs text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => change([...links, { label: "", url: "" }])}
        disabled={links.length >= 20}
        className="mt-4 bg-obsidian/10 px-4 py-3 text-sm text-obsidian hover:bg-obsidian/[.15] disabled:opacity-40"
      >
        + Add link
      </button>

      <div className="mt-8">
        <SaveBar
          status={status}
          saving={saving}
          disabled={!dirty || saving}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
