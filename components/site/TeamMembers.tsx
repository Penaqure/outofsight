"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { TeamMember } from "@/types/content";
import { RevealItem, RevealWords, afterWords } from "@/components/ui/RevealText";

// Breaks text at its first space so it always sits on two lines
// ("Jane Doe" → "Jane" / "Doe").
function splitTwoLines(text: string) {
  const trimmed = text.trim();
  const spaceAt = trimmed.indexOf(" ");
  if (spaceAt <= 0) return trimmed;
  return (
    <>
      {trimmed.slice(0, spaceAt)}
      <br />
      {trimmed.slice(spaceAt + 1)}
    </>
  );
}

// Figma v2 "Team Members": heading + blurb on the left, a row of round
// portraits on the right. The row scrolls sideways once there are more
// members than fit, driven by the ← → arrow under the blurb (a single
// graphic, so two invisible buttons sit over its halves). Animates in
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
  // Which way the row can still scroll — drives which arrow half is lit.
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const update = () => {
      const max = row.scrollWidth - row.clientWidth;
      setCanPrev(row.scrollLeft > 1);
      setCanNext(row.scrollLeft < max - 1);
    };
    update();
    row.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(row);
    return () => {
      row.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [members.length]);

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
          {/* ← → arrow from the Figma design, drawn inline so the page has
              no static image file to depend on. */}
          <svg
            aria-hidden="true"
            width="42"
            height="7.36"
            viewBox="0 0 42 7.36396"
            fill="#232323"
            className="block"
          >
            <path
              opacity={canPrev ? 1 : 0.3}
              className="transition-opacity duration-300"
              d="M16.5 3.68198L16.5 3.18198L0.499999 3.18198L0.5 3.68198L0.5 4.18198L16.5 4.18198L16.5 3.68198ZM0.146446 3.32843C-0.0488153 3.52369 -0.0488152 3.84027 0.146446 4.03553L3.32843 7.21751C3.52369 7.41278 3.84027 7.41278 4.03553 7.21751C4.2308 7.02225 4.2308 6.70567 4.03553 6.51041L1.20711 3.68198L4.03553 0.853554C4.2308 0.658292 4.2308 0.341709 4.03553 0.146447C3.84027 -0.0488151 3.52369 -0.0488151 3.32843 0.146447L0.146446 3.32843Z"
            />
            <path
              opacity={canNext ? 1 : 0.3}
              className="transition-opacity duration-300"
              d="M25.5 3.68198V4.18198L41.5 4.18198V3.68198V3.18198L25.5 3.18198V3.68198ZM41.8536 4.03553C42.0488 3.84027 42.0488 3.52369 41.8536 3.32843L38.6716 0.146447C38.4763 -0.0488155 38.1597 -0.0488155 37.9645 0.146447C37.7692 0.341709 37.7692 0.658291 37.9645 0.853554L40.7929 3.68198L37.9645 6.51041C37.7692 6.70567 37.7692 7.02225 37.9645 7.21751C38.1597 7.41278 38.4763 7.41278 38.6716 7.21751L41.8536 4.03553Z" />
          </svg>
          <button
            type="button"
            aria-label="Previous team members"
            disabled={!canPrev}
            onClick={() => scrollRow(-1)}
            className="absolute -inset-y-3 left-0 w-1/2 cursor-pointer [-webkit-tap-highlight-color:transparent] focus:outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-obsidian/40 disabled:cursor-default"
          />
          <button
            type="button"
            aria-label="Next team members"
            disabled={!canNext}
            onClick={() => scrollRow(1)}
            className="absolute -inset-y-3 right-0 w-1/2 cursor-pointer [-webkit-tap-highlight-color:transparent] focus:outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-obsidian/40 disabled:cursor-default"
          />
        </RevealItem>
      </div>

      <ul
        ref={rowRef}
        className="-mx-6 flex snap-x scroll-px-6 gap-6 overflow-x-auto px-6 [scrollbar-width:none] sm:-mx-10 sm:scroll-px-10 sm:gap-16 sm:px-10 lg:mx-0 lg:scroll-px-0 lg:px-0"
      >
        {members.map((member, index) => {
          return (
            <RevealItem
              key={index}
              as="li"
              startMs={itemsStart}
              index={index + 1}
              className="group flex w-[140px] shrink-0 snap-start flex-col items-center text-center sm:w-[208px]"
            >
              <div className="relative size-24 overflow-hidden rounded-full bg-obsidian/[.05] sm:size-[116px]">
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
                  {splitTwoLines(member.name)}
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
