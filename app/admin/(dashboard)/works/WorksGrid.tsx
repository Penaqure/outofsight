"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Project } from "@/types/portfolio";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { WorkFormModal } from "./WorkFormModal";

export function WorksGrid({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Project | "new" | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  function refreshAndClose() {
    setEditing(null);
    router.refresh();
  }

  async function confirmDelete() {
    if (!pendingDeleteId) return;
    setDeleting(true);
    try {
      await fetch(`/api/works/${pendingDeleteId}`, { method: "DELETE" });
      setPendingDeleteId(null);
      setEditing(null);
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() => setEditing(project)}
            className="aspect-square overflow-hidden rounded-md border border-obsidian/10 bg-obsidian/[.05] transition-opacity hover:opacity-90"
          >
            {project.thumbnailImage ? (
              <img
                src={project.thumbnailImage}
                alt={project.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-sm text-obsidian/40">
                {project.title}
              </span>
            )}
          </button>
        ))}
        <button
          onClick={() => setEditing("new")}
          aria-label="Add new work"
          className="flex aspect-square items-center justify-center rounded-md border border-obsidian/10 bg-obsidian/[.05] text-3xl font-light text-obsidian/40 hover:bg-obsidian/[.08]"
        >
          +
        </button>
      </div>

      {editing && (
        <WorkFormModal
          project={editing === "new" ? undefined : editing}
          onClose={() => setEditing(null)}
          onSaved={refreshAndClose}
          onDeleteRequest={
            editing !== "new"
              ? () => setPendingDeleteId(editing.id)
              : undefined
          }
        />
      )}

      {pendingDeleteId && (
        <ConfirmDialog
          title="Delete Work"
          message="You're about to Delete. Want to continue?"
          confirmLabel={deleting ? "Deleting..." : "Delete"}
          onConfirm={confirmDelete}
          onCancel={() => setPendingDeleteId(null)}
        />
      )}
    </>
  );
}
