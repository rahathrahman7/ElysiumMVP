import reviewsSnapshot from "../../public/data/tmc-reviews.json";
import matchesSnapshot from "../../public/data/tmc-matches.json";

export type TmcReviewRecord = {
  keep: boolean;
  displayName: string;
  priceGbp: string;
  notes: string;
  preferredMetal: string;
  options?: unknown;
};

export type TmcMatchRecord = {
  elysiumTitle: string;
  tmcHandle: string;
};

/**
 * Seeded snapshot used when the database is unavailable.
 * Imported statically so it is bundled into the Vercel serverless function
 * (reading public/ via fs does not work in that environment).
 */
export function loadReviewFallback(): Record<string, TmcReviewRecord> {
  const data = reviewsSnapshot as { reviews?: Record<string, TmcReviewRecord> };
  return data?.reviews ?? {};
}

export function loadMatchFallback(): {
  bySlug: Record<string, TmcMatchRecord>;
  ownedByHandle: Record<string, string>;
} {
  const data = matchesSnapshot as {
    bySlug?: Record<string, TmcMatchRecord>;
    ownedByHandle?: Record<string, string>;
  };
  return {
    bySlug: data?.bySlug ?? {},
    ownedByHandle: data?.ownedByHandle ?? {},
  };
}

export function dbErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return "Unknown database error";
}
