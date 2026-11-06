"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

// Sets data-shown on itself the first time it scrolls into view (and keeps
// it), so children can animate in with `group-data-shown/reveal:` classes —
// see RevealWords/RevealItem in ./RevealText. It's a NAMED group so it can't
// set off plain `group-hover:` effects inside it (project tiles, team
// photos). That variant matches ANY shown reveal ancestor, so don't nest
// one Reveal inside another.
// `active` holds the reveal back until something else is ready too (e.g.
// the Home hero waits for its background video).
export function Reveal({
  id,
  as: Tag = "div",
  active = true,
  children,
  className = "",
}: {
  id?: string;
  as?: "div" | "section";
  active?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Fires once the top of the element is ~15% up from the bottom of the
    // viewport — works the same for short headings and very tall grids
    // (a ratio threshold can never be reached by an element several
    // screens tall).
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as RefObject<HTMLDivElement>}
      id={id}
      data-shown={(inView && active) || undefined}
      className={`group/reveal ${className}`}
    >
      {children}
    </Tag>
  );
}
