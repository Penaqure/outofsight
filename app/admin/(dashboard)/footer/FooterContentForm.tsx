"use client";

import { useState } from "react";
import type { FooterContent, FooterLink } from "@/types/content";
import { SaveBar, useSave } from "@/components/admin/SaveBar";

const MAX_LINKS = 20;

const fieldClass =
  "w-full bg-obsidian/10 px-4 py-3.5 text-sm text-obsidian placeholder:text-obsidian/40 outline-none focus:ring-1 focus:ring-primary";

const iconButtonClass =
  "px-2 py-1 text-xs text-obsidian/60 hover:text-obsidian disabled:opacity-30 disabled:hover:text-obsidian/60";

type LinkListKey = "navigationLinks" | "mediaLinks" | "contactLinks";

// One footer column: its heading plus either a link list or free text.
function Section({
  title,
  heading,
  onHeadingChange,
  hint,
  children,
}: {
  title: string;
  heading: string;
  onHeadingChange: (value: string) => void;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-obsidian/10 pt-8">
      <p className="text-lg tracking-tight text-obsidian">{title}</p>
      <p className="mt-1 text-xs text-obsidian/60">{hint}</p>
      <div className="mt-4 max-w-sm">
        <p className="text-sm text-obsidian">Heading</p>
        <input
          value={heading}
          onChange={(e) => onHeadingChange(e.target.value)}
          placeholder="Column heading"
          maxLength={60}
          className={`mt-2 ${fieldClass}`}
        />
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function LinkListEditor({
  name,
  links,
  onChange,
  labelPlaceholder,
  urlPlaceholder,
}: {
  name: string;
  links: FooterLink[];
  onChange: (links: FooterLink[]) => void;
  labelPlaceholder: string;
  urlPlaceholder: string;
}) {
  function updateLink(index: number, patch: Partial<FooterLink>) {
    onChange(links.map((link, i) => (i === index ? { ...link, ...patch } : link)));
  }

  function moveLink(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= links.length) return;
    const next = [...links];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <>
      <p className="text-sm text-obsidian">Links</p>
      <div className="mt-2 flex flex-col gap-4 sm:gap-2">
        {links.map((link, index) => (
          <div
            key={index}
            className="grid grid-cols-1 gap-2 sm:grid-cols-[200px_1fr_auto] sm:items-center sm:gap-4"
          >
            <input
              value={link.label}
              onChange={(e) => updateLink(index, { label: e.target.value })}
              placeholder={labelPlaceholder}
              aria-label={`${name} link ${index + 1} label`}
              className={fieldClass}
            />
            <input
              value={link.url}
              onChange={(e) => updateLink(index, { url: e.target.value })}
              placeholder={urlPlaceholder}
              aria-label={`${name} link ${index + 1} URL`}
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
                onClick={() => onChange(links.filter((_, i) => i !== index))}
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
        onClick={() => onChange([...links, { label: "", url: "" }])}
        disabled={links.length >= MAX_LINKS}
        className="mt-4 bg-obsidian/10 px-4 py-3 text-sm text-obsidian hover:bg-obsidian/[.15] disabled:opacity-40"
      >
        + Add link
      </button>
    </>
  );
}

export function FooterContentForm({
  initialContent,
}: {
  initialContent: FooterContent;
}) {
  const [content, setContent] = useState<FooterContent>(initialContent);
  const [dirty, setDirty] = useState(false);
  const { saving, status, save, clearStatus } = useSave("/api/content/footer");

  function set<K extends keyof FooterContent>(key: K, value: FooterContent[K]) {
    setContent((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
    clearStatus();
  }

  async function handleSave() {
    // Rows without a label are dropped by the server; drop them here too
    // so the form matches what was saved.
    const clean = (links: FooterLink[]) => links.filter((l) => l.label.trim());
    const lists: LinkListKey[] = ["navigationLinks", "mediaLinks", "contactLinks"];
    const cleaned = { ...content };
    for (const key of lists) cleaned[key] = clean(content[key]);
    const ok = await save(cleaned);
    if (ok) {
      setContent(cleaned);
      setDirty(false);
    }
  }

  const sharedHint =
    "A link without a URL is kept here but hidden on the site; a column with nothing to show is hidden.";

  return (
    <div className="mt-8 flex flex-col gap-10">
      <Section
        title="Navigation"
        heading={content.navigationLabel}
        onHeadingChange={(v) => set("navigationLabel", v)}
        hint={`Links to pages on this site, e.g. /works or /about. ${sharedHint}`}
      >
        <LinkListEditor
          name="Navigation"
          links={content.navigationLinks}
          onChange={(v) => set("navigationLinks", v)}
          labelPlaceholder="Label (e.g. Work)"
          urlPlaceholder="/works"
        />
      </Section>

      <Section
        title="Media"
        heading={content.mediaLabel}
        onHeadingChange={(v) => set("mediaLabel", v)}
        hint={`Social profiles. They open in a new tab. ${sharedHint}`}
      >
        <LinkListEditor
          name="Media"
          links={content.mediaLinks}
          onChange={(v) => set("mediaLinks", v)}
          labelPlaceholder="Label (e.g. Instagram)"
          urlPlaceholder="https://..."
        />
      </Section>

      <Section
        title="Address"
        heading={content.addressLabel}
        onHeadingChange={(v) => set("addressLabel", v)}
        hint="Line breaks are kept. Leave empty to hide the column."
      >
        <p className="text-sm text-obsidian">Address</p>
        <textarea
          value={content.address}
          onChange={(e) => set("address", e.target.value)}
          placeholder={"Street, building\nCity, Country"}
          rows={3}
          maxLength={500}
          className={`mt-2 max-w-xl resize-y ${fieldClass}`}
        />
      </Section>

      <Section
        title="Contacts"
        heading={content.contactsLabel}
        onHeadingChange={(v) => set("contactsLabel", v)}
        hint={`Use tel:+971... for phone, mailto:you@example.com for email, https://wa.me/971... for WhatsApp. ${sharedHint}`}
      >
        <LinkListEditor
          name="Contacts"
          links={content.contactLinks}
          onChange={(v) => set("contactLinks", v)}
          labelPlaceholder="Label (e.g. Phone)"
          urlPlaceholder="tel:+971..."
        />
      </Section>

      <SaveBar
        status={status}
        saving={saving}
        disabled={!dirty || saving}
        onSave={handleSave}
      />
    </div>
  );
}
