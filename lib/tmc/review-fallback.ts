import { readFile } from "fs/promises";
import path from "path";

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

async function readJsonFile<T>(relativePath: string): Promise<T | null> {
  try {
    const filePath = path.join(process.cwd(), relativePath);
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/** Seeded snapshot used when the database is unavailable. */
export async function loadReviewFallback(): Promise<Record<string, TmcReviewRecord>> {
  const data = await readJsonFile<{ reviews?: Record<string, TmcReviewRecord> }>(
    "public/data/tmc-reviews.json"
  );
  return data?.reviews ?? {};
}

export async function loadMatchFallback(): Promise<{
  bySlug: Record<string, TmcMatchRecord>;
  ownedByHandle: Record<string, string>;
}> {
  const data = await readJsonFile<{
    bySlug?: Record<string, TmcMatchRecord>;
    ownedByHandle?: Record<string, string>;
  }>("public/data/tmc-matches.json");
  return {
    bySlug: data?.bySlug ?? {},
    ownedByHandle: data?.ownedByHandle ?? {},
  };
}

export function dbErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return "Unknown database error";
}
