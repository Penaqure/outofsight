import type { CSSProperties, ElementType, ReactNode } from "react";

// The Contact page entrance, reusable site-wide: a heading rises in word by
// word, then the supporting content fades up line by line once the heading
// has finished (see auteurstudios.au/contact for the reference). Both play
// when the nearest <Reveal> ancestor scrolls into view. The hidden starting
// state is motion-safe only, so reduced-motion users just see the content.

const WORD_STAGGER_MS = 70;
const ITEM_STAGGER_MS = 100;
// Pause between the last heading word starting and the first item.
const AFTER_WORDS_MS = 150;

const enter =
  "transition-[opacity,transform] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:translate-y-[0.6em] motion-safe:opacity-0 group-data-shown/reveal:translate-y-0 group-data-shown/reveal:opacity-100";

function delay(ms: number): CSSProperties {
  return { transitionDelay: `${ms}ms` };
}

function wordCount(text: string) {
  return text.split(/\s+/).filter(Boolean).length;
}

// When the item(s) following `text` should start, so they wait for its
// word-by-word reveal to finish — pass as RevealItem's `startMs`.
export function afterWords(text: string, startMs = 0) {
  return startMs + wordCount(text) * WORD_STAGGER_MS + AFTER_WORDS_MS;
}

// The design's two-line section heading: "For Moments / That Stay". Breaks
// after the second word, so it keeps working when the text is edited in the
// admin. Shorter headings stay on one line.
export function twoLineHeading(text: string) {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length < 3) return text;
  return `${words.slice(0, 2).join(" ")}\n${words.slice(2).join(" ")}`;
}

// Word-by-word reveal of a short string (a heading). Line breaks in the
// text are kept. Render it inside the heading element, e.g.
// <h1><RevealWords text={title} /></h1>.
export function RevealWords({
  text,
  startMs = 0,
}: {
  text: string;
  startMs?: number;
}) {
  let index = 0;
  return text.split("\n").map((line, lineIndex) => (
    <span key={lineIndex}>
      {lineIndex > 0 && <br />}
      {line
        .split(" ")
        .filter(Boolean)
        .map((word, i, words) => (
          <span key={i}>
            <span
              className={`inline-block ${enter}`}
              style={delay(startMs + index++ * WORD_STAGGER_MS)}
            >
              {word}
            </span>
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
    </span>
  ));
}

// Fade-up of a block (paragraph, image, grid, card…). `startMs` is usually
// afterWords(heading); `index` staggers several items 100ms apart.
export function RevealItem({
  as: Tag = "div",
  startMs = 0,
  index = 0,
  className = "",
  children,
}: {
  as?: ElementType;
  startMs?: number;
  index?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      className={`${enter} ${className}`}
      style={delay(startMs + index * ITEM_STAGGER_MS)}
    >
      {children}
    </Tag>
  );
}
