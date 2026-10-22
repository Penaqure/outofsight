"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Sets data-shown on itself the first time it scrolls into view (and keeps
// it), so children can animate in with `group-data-shown:` classes — see
// TrustedBy's `animated` prop. It's a `group`, so children only need the
// group-data-shown:* variants; the hidden starting state should be
// motion-safe:* so reduced-motion users just see the content.
export function Reveal({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      id={id}
      data-shown={shown || undefined}
      className={`group ${className}`}
    >
      {children}
    </div>
  );
}
