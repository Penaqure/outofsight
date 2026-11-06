"use client";

import { useRef } from "react";
import Image from "next/image";
import type { TeamMember } from "@/types/content";
import teamArrow from "@/public/images/about/team-arrow.svg";
import { RevealItem, RevealWords, afterWords } from "@/components/ui/RevealText";

// Figma v2 "Team Members": heading + blurb on the left, a row of round
// portraits on the right. The row scrolls sideways once there are more
// members than fit, driven by the ← → arrow under the blurb (a single
// design asset, so two invisible buttons sit over its halves). Animates in
// with the shared entrance — render it inside a <Reveal>.
export function TeamMembers({
  intro,
  members,
}: {
  intro: string;
  members: TeamMember[];
}) {
  const rowRef = useRef<HTMLUListElement>(null);
  const itemsStart = afterWords("Team Members");

  function scrollRow(direction: -1 | 1) {
    const row = rowRef.current;
    if (!row) return;
    row.scrollBy({ left: direction * row.clientWidth * 0.8, behavior: "smooth" });
  }

  return (
    <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
      <div className="flex shrink-0 flex-col gap-10 lg:w-[353px] lg:gap-[100px]">
        <div className="flex flex-col gap-4 sm:gap-6">
          <h2 className="font-heading text-base leading-none font-semibold tracking-tight text-obsidian sm:text-2xl">
            <RevealWords text="Team Members" />
          </h2>
          {intro && (
            <RevealItem
              as="p"
              startMs={itemsStart}
              className="text-xs leading-[1.23] tracking-tight text-obsidian sm:text-base"
            >
              {intro}
            </RevealItem>
          )}
        </div>
        <RevealItem
          startMs={itemsStart}
          index={1}
          className="relative hidden self-start sm:block"
        >
          <Image src={teamArrow} alt="" />
          <button
            type="button"
            aria-label="Previous team members"
            onClick={() => scrollRow(-1)}
            className="absolute -inset-y-3 left-0 w-1/2"
          />
          <button
            type="button"
            aria-label="Next team members"
            onClick={() => scrollRow(1)}
            className="absolute -inset-y-3 right-0 w-1/2"
          />
        </RevealItem>
      </div>

      <ul
        ref={rowRef}
        className="-mx-6 flex snap-x gap-6 overflow-x-auto px-6 [scrollbar-width:none] sm:-mx-10 sm:gap-16 sm:px-10 lg:mx-0 lg:px-0"
      >
        {members.map((member, index) => {
          const spaceAt = member.name.indexOf(" ");
          return (
            <RevealItem
              key={index}
              as="li"
              startMs={itemsStart}
              index={index + 1}
              className="group flex w-[140px] shrink-0 snap-start flex-col items-center text-center sm:w-[208px]"
            >
              <div className="relative size-24 overflow-hidden rounded-full bg-obsidian/[.05] sm:size-[126px]">
                {member.photo && (
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    sizes="126px"
                    style={{ objectPosition: member.photoPosition }}
                    className="object-cover grayscale transition-[filter] duration-500 group-hover:grayscale-0"
                  />
                )}
              </div>
              {member.name && (
                <p className="mt-4 font-heading text-base leading-[1.2] font-semibold tracking-tight text-obsidian sm:mt-6 sm:text-xl">
                  {spaceAt > 0 ? (
                    <>
                      {member.name.slice(0, spaceAt)}
                      <br />
                      {member.name.slice(spaceAt + 1)}
                    </>
                  ) : (
                    member.name
                  )}
                </p>
              )}
              {member.position && (
                <p className="mt-3 text-xs leading-[1.23] tracking-tight text-obsidian uppercase sm:mt-4 sm:text-sm">
                  {member.position}
                </p>
              )}
              {(member.instagramUrl || member.linkedinUrl) && (
                <div className="mt-2 flex gap-2 text-[10px] text-obsidian/60 sm:text-xs">
                  {member.instagramUrl && (
                    <a
                      href={member.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name || "Team member"} on Instagram`}
                      className="hover:text-obsidian hover:underline"
                    >
                      Instagram
                    </a>
                  )}
                  {member.instagramUrl && member.linkedinUrl && (
                    <span className="text-obsidian/30">|</span>
                  )}
                  {member.linkedinUrl && (
                    <a
                      href={member.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name || "Team member"} on LinkedIn`}
                      className="hover:text-obsidian hover:underline"
                    >
                      LinkedIn
                    </a>
                  )}
                </div>
              )}
            </RevealItem>
          );
        })}
      </ul>
    </div>
  );
}
