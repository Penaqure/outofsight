import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/data/portfolio";
import { ProjectForm } from "../ProjectForm";

export default async function EditProjectPage(
  props: PageProps<"/admin/works/[id]">
) {
  const { id } = await props.params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Edit Project</h1>
      <ProjectForm project={project} />
    </>
  );
}
