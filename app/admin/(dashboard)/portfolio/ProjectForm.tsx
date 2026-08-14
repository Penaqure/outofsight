"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Project } from "@/types/portfolio";
import { Button } from "@/components/ui/Button";

export function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const isEdit = Boolean(project);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = new FormData(event.currentTarget);
    const body = {
      title: form.get("title"),
      slug: form.get("slug"),
      summary: form.get("summary"),
      description: form.get("description"),
      coverImage: form.get("coverImage") || "/next.svg",
      tags: String(form.get("tags") || "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    const res = await fetch(
      isEdit ? `/api/portfolio/${project!.id}` : "/api/portfolio",
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      setError("Something went wrong. Please try again.");
      return;
    }

    router.push("/admin/portfolio");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex max-w-lg flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        Title
        <input
          name="title"
          defaultValue={project?.title}
          required
          className="rounded-md border border-black/[.12] px-3 py-2 text-sm dark:border-white/[.15] dark:bg-transparent"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Slug
        <input
          name="slug"
          defaultValue={project?.slug}
          required
          className="rounded-md border border-black/[.12] px-3 py-2 text-sm dark:border-white/[.15] dark:bg-transparent"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Summary
        <input
          name="summary"
          defaultValue={project?.summary}
          required
          className="rounded-md border border-black/[.12] px-3 py-2 text-sm dark:border-white/[.15] dark:bg-transparent"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Description
        <textarea
          name="description"
          defaultValue={project?.description}
          rows={5}
          required
          className="rounded-md border border-black/[.12] px-3 py-2 text-sm dark:border-white/[.15] dark:bg-transparent"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Cover image URL
        <input
          name="coverImage"
          defaultValue={project?.coverImage}
          className="rounded-md border border-black/[.12] px-3 py-2 text-sm dark:border-white/[.15] dark:bg-transparent"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Tags (comma separated)
        <input
          name="tags"
          defaultValue={project?.tags.join(", ")}
          className="rounded-md border border-black/[.12] px-3 py-2 text-sm dark:border-white/[.15] dark:bg-transparent"
        />
      </label>
      {error && <p className="text-sm text-red-600 dark:text-red-500">{error}</p>}
      <Button type="submit">{isEdit ? "Save Changes" : "Create Project"}</Button>
    </form>
  );
}
