/**
 * Classify a TMC review "Keep" row as a new catalog product vs an
 * image-replacement instruction for an existing ELYSIUM ring.
 */

export type TmcSelectionKind = "new_product" | "image_replacement" | "incomplete";

export type TmcReviewFields = {
  keep?: boolean;
  displayName?: string | null;
  priceGbp?: string | null;
  notes?: string | null;
  preferredMetal?: string | null;
  options?: unknown;
};

const REPLACEMENT_PATTERN =
  /\b(replace|replacing|this to replace|to replace)\b/i;

export function isImageReplacementInstruction(displayName: string | null | undefined): boolean {
  const name = (displayName ?? "").trim();
  if (!name) return false;
  return REPLACEMENT_PATTERN.test(name);
}

export function classifyTmcSelection(review: TmcReviewFields): TmcSelectionKind {
  if (!review.keep) return "incomplete";
  const name = (review.displayName ?? "").trim();
  if (!name) return "incomplete";
  if (isImageReplacementInstruction(name)) return "image_replacement";
  return "new_product";
}

export function slugifyDisplayName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
