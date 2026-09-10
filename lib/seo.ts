// Small helpers for turning editable page content into <meta> values.

// Collapse whitespace and clip to a length that reads well in search
// results / social cards (~160 chars for descriptions), breaking on a word
// boundary and adding an ellipsis when clipped.
export function metaDescription(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const clipped = clean.slice(0, max);
  const lastSpace = clipped.lastIndexOf(" ");
  return `${clipped.slice(0, lastSpace > 0 ? lastSpace : max).trimEnd()}…`;
}
