import { getProjects } from "@/lib/data/portfolio";

export default async function AdminDashboardPage() {
  const projects = await getProjects();

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-black/[.08] p-5 dark:border-white/[.1]">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Total Projects
          </p>
          <p className="mt-1 text-2xl font-semibold">{projects.length}</p>
        </div>
      </div>
    </>
  );
}
