"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Project } from "@/types/portfolio";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useSortable } from "@/components/admin/useDragAndDrop";
import { WorkFormModal } from "./WorkFormModal";

export function WorksGrid({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Project | "new" | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  // Local copy so a drag shows instantly; refreshed whenever the server's
  // list changes (save, delete, reorder).
  const [ordered, setOrdered] = useState(projects);
  const [serverProjects, setServerProjects] = useState(projects);
  const [orderFailed, setOrderFailed] = useState(false);
  if (serverProjects !== projects) {
    setServerProjects(projects);
    setOrdered(projects);
  }

  // No Save button on this grid, so a new order is stored straight away.
  const sort = useSortable(ordered, async (next) => {
    const previous = ordered;
    setOrdered(next);
    setOrderFailed(false);
    try {
      const res = await fetch("/api/works/order", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: next.map((project) => project.id) }),
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      router.refresh();
    } catch {
      setOrdered(previous);
      setOrderFailed(true);
    }
  });

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
      <p className="mt-8 text-xs text-obsidian/40">
        Drag a project to change its position on the Work page. Click one to
        edit it.
      </p>
      {orderFailed && (
        <p className="mt-1 text-xs text-red-600">
          Couldn&apos;t save the new order. Please try again.
        </p>
      )}
      <div className="mt-2 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
        {ordered.map((project, index) => (
          // A div rather than a <button>: Firefox won't start a drag on a button.
          <div
            key={project.id}
            role="button"
            tabIndex={0}
            onClick={() => setEditing(project)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setEditing(project);
              }
            }}
            {...sort.itemProps(index)}
            {...sort.handleProps(index)}
            className={`aspect-square cursor-grab overflow-hidden border border-obsidian/10 bg-obsidian/[.05] transition-opacity hover:opacity-90 active:cursor-grabbing ${sort.itemClass(index)}`}
          >
            {project.thumbnailImage ? (
              <img
                src={project.thumbnailImage}
                alt={project.title}
                draggable={false}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-sm text-obsidian/40">
                {project.title}
              </span>
            )}
          </div>
        ))}
        <button
          onClick={() => setEditing("new")}
          aria-label="Add new work"
          className="flex aspect-square items-center justify-center border border-obsidian/10 bg-obsidian/[.05] text-3xl font-light text-obsidian/40 hover:bg-obsidian/[.08]"
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
