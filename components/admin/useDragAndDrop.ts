"use client";

import { useRef, useState, type DragEvent } from "react";

// Marks a drag as "reordering a list item", so the upload Dropzones can tell
// it apart from an OS file or an Image Library drag.
export const SORT_MIME = "application/x-outofsight-sort";

// Drag-to-reorder for an admin list. Spread itemProps(i) on each item and
// handleProps(i) on whatever starts the drag — the item itself for image
// tiles, or a small handle on cards with text fields, where a draggable card
// would get in the way of selecting text. A drag only counts within its own
// list, because the state below is per hook.
export function useSortable<T>(items: T[], onReorder: (next: T[]) => void) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  function clear() {
    setDragIndex(null);
    setOverIndex(null);
  }

  function itemProps(index: number) {
    return {
      "data-sort-item": true,
      onDragOver(event: DragEvent) {
        if (dragIndex === null) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        if (overIndex !== index) setOverIndex(index);
      },
      onDrop(event: DragEvent) {
        if (dragIndex === null) return;
        event.preventDefault();
        if (dragIndex !== index) {
          const next = [...items];
          const [moved] = next.splice(dragIndex, 1);
          next.splice(index, 0, moved);
          onReorder(next);
        }
        clear();
      },
    };
  }

  function handleProps(index: number) {
    return {
      draggable: true,
      onDragStart(event: DragEvent<HTMLElement>) {
        event.dataTransfer.setData(SORT_MIME, "1");
        event.dataTransfer.effectAllowed = "move";
        // From a handle, show the whole card under the cursor.
        const item = event.currentTarget.closest("[data-sort-item]");
        if (item && item !== event.currentTarget) {
          event.dataTransfer.setDragImage(item, 24, 24);
        }
        setDragIndex(index);
      },
      onDragEnd: clear,
    };
  }

  // Feedback while dragging: the moving item fades, its target is outlined.
  function itemClass(index: number) {
    if (index === dragIndex) return "opacity-40";
    if (index === overIndex && dragIndex !== null) return "ring-2 ring-primary";
    return "";
  }

  return { itemProps, handleProps, itemClass };
}

// Drop image files from the computer onto an area to upload them. Ignores
// every other kind of drag (list reordering, Image Library thumbnails).
export function useImageFileDrop(onFiles: (files: File[]) => void) {
  const [isFileOver, setIsFileOver] = useState(false);
  // dragenter/leave also fire for every child crossed; count them so the
  // highlight doesn't flicker.
  const depth = useRef(0);

  const isFileDrag = (event: DragEvent) =>
    event.dataTransfer.types.includes("Files");

  const dropProps = {
    onDragEnter(event: DragEvent) {
      if (!isFileDrag(event)) return;
      depth.current += 1;
      setIsFileOver(true);
    },
    onDragOver(event: DragEvent) {
      if (!isFileDrag(event)) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
    },
    onDragLeave(event: DragEvent) {
      if (!isFileDrag(event)) return;
      depth.current -= 1;
      if (depth.current <= 0) {
        depth.current = 0;
        setIsFileOver(false);
      }
    },
    onDrop(event: DragEvent) {
      if (!isFileDrag(event)) return;
      event.preventDefault();
      depth.current = 0;
      setIsFileOver(false);
      const images = Array.from(event.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/")
      );
      if (images.length > 0) onFiles(images);
    },
  };

  return { isFileOver, dropProps };
}
