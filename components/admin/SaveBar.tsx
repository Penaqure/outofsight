"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Shared save handling for the admin content forms (home, about, works hero,
 * contacts). They all PUT a JSON body to a `/api/content/*` endpoint and stay
 * on the page afterwards, so each one needs the same transient "Changes
 * saved" / "Couldn't save" feedback next to its Save button.
 */
export type SaveStatus = "idle" | "saved" | "error";

export function useSave(endpoint: string) {
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const save = useCallback(
    async (body: unknown): Promise<boolean> => {
      setSaving(true);
      setStatus("idle");
      clearTimeout(timer.current);
      try {
        const res = await fetch(endpoint, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error(`Save failed with status ${res.status}`);
        setStatus("saved");
        timer.current = setTimeout(() => setStatus("idle"), 4000);
        return true;
      } catch {
        setStatus("error");
        return false;
      } finally {
        setSaving(false);
      }
    },
    [endpoint]
  );

  // Call when the user starts editing again so the old message clears.
  const clearStatus = useCallback(() => setStatus("idle"), []);

  return { saving, status, save, clearStatus };
}

export function SaveBar({
  status,
  saving,
  disabled,
  onSave,
}: {
  status: SaveStatus;
  saving: boolean;
  disabled: boolean;
  onSave: () => void;
}) {
  return (
    <div className="flex items-center justify-end gap-4">
      {status === "saved" && (
        <p className="text-sm text-green-600">Changes saved</p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-600">Couldn&rsquo;t save &mdash; please try again</p>
      )}
      <button
        onClick={onSave}
        disabled={disabled}
        className="bg-primary px-8 py-2.5 text-sm font-medium text-bone-white transition-colors hover:brightness-90 disabled:bg-obsidian/15 disabled:text-obsidian/40 disabled:hover:brightness-100"
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
