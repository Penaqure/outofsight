"use client";

import type { ReactNode } from "react";

export function Modal({
  onClose,
  children,
  width = "max-w-2xl",
}: {
  onClose: () => void;
  children: ReactNode;
  width?: string;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/60 p-6"
      onClick={onClose}
    >
      <div
        className={`w-full ${width} rounded-md bg-secondary p-8 text-obsidian shadow-xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
