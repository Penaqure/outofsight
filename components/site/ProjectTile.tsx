import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/types/portfolio";
import { Reveal } from "@/components/ui/Reveal";
import { RevealItem } from "@/components/ui/RevealText";

// Square project thumbnail linking to its page, used by the Works grid and
// the project page's "Similar Videos" grid. Title shows on hover. Each tile
// reveals as it scrolls into view; `index` staggers tiles in the same row
// (by column, so long lists don't build up an ever-growing delay).
export function ProjectTile({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <Reveal>
      <RevealItem index={index % 4}>
        <Link
          href={`/works/${project.slug}`}
          className="group relative block aspect-square overflow-hidden bg-obsidian/[.05]"
        >
          {project.thumbnailImage ? (
            <Image
              src={project.thumbnailImage}
              alt=""
              fill
              sizes="(min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
              style={{ objectPosition: project.thumbnailImagePosition }}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <span className="flex h-full items-center justify-center px-4 text-center text-sm text-obsidian/40">
              {project.title}
            </span>
          )}
          <div className="absolute inset-0 bg-obsidian/0 transition-colors group-hover:bg-obsidian/40" />
          <div className="absolute inset-0 flex items-center justify-center p-4 opacity-0 transition-opacity group-hover:opacity-100">
            <p className="text-center font-heading text-sm tracking-tight text-bone-white">
              {project.title}
            </p>
          </div>
        </Link>
      </RevealItem>
    </Reveal>
  );
}
