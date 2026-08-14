"use client";

import { useRouter } from "next/navigation";

export function DeleteProjectButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Delete this project?")) return;
    await fetch(`/api/works/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      className="text-sm text-red-600 hover:underline dark:text-red-500"
    >
      Delete
    </button>
  );
}
