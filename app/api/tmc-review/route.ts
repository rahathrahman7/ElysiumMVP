import { NextResponse } from "next/server";
import { z } from "zod";
import { dbErrorMessage, loadReviewFallback } from "@/lib/tmc/review-fallback";

export const dynamic = "force-dynamic";

const optionsSchema = z.object({
  metals: z.array(z.string().max(40)).max(20).optional(),
  origins: z.array(z.string().max(20)).max(5).optional(),
  carats: z.array(z.string().max(20)).max(20).optional(),
  colours: z.array(z.string().max(10)).max(10).optional(),
  clarities: z.array(z.string().max(10)).max(10).optional(),
  certificates: z.array(z.string().max(10)).max(5).optional(),
  sizes: z.string().max(120).optional(),
});

const patchSchema = z.object({
  handle: z.string().min(1).max(200),
  keep: z.boolean().optional(),
  displayName: z.string().max(200).optional(),
  priceGbp: z.string().max(50).optional(),
  notes: z.string().max(2000).optional(),
  preferredMetal: z.string().max(30).optional(),
  options: optionsSchema.optional(),
});

function rowsToReviews(
  rows: Array<{
    handle: string;
    keep: boolean;
    displayName: string | null;
    priceGbp: string | null;
    notes: string | null;
    preferredMetal: string | null;
    options: string | null;
  }>
) {
  const byHandle: Record<string, unknown> = {};
  for (const r of rows) {
    let options: unknown = undefined;
    if (r.options) {
      try {
        options = JSON.parse(r.options);
      } catch {
        options = undefined;
      }
    }
    byHandle[r.handle] = {
      keep: r.keep,
      displayName: r.displayName ?? "",
      priceGbp: r.priceGbp ?? "",
      notes: r.notes ?? "",
      preferredMetal: r.preferredMetal ?? "",
      options,
    };
  }
  return byHandle;
}

function fallbackResponse(warning: string) {
  return NextResponse.json({
    ok: true,
    reviews: loadReviewFallback(),
    source: "fallback",
    warning,
  });
}

export async function GET() {
  // Always prefer returning the seeded snapshot over a 500 — the configurator
  // must load even when Postgres / Prisma is unhealthy on Vercel.
  try {
    const { prisma, resolveDatabaseUrl } = await import("@/lib/database/prisma");

    if (!resolveDatabaseUrl()) {
      return fallbackResponse("DATABASE_URL is not configured; serving seeded review snapshot.");
    }

    const rows = await Promise.race([
      prisma.tmcRingReview.findMany(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("tmc_ring_reviews query timed out after 4s")), 4000)
      ),
    ]);

    const fromDb = rowsToReviews(rows ?? []);
    const keptInDb = Object.values(fromDb).filter(
      (r) => (r as { keep?: boolean }).keep
    ).length;

    if ((rows?.length ?? 0) === 0 && keptInDb === 0) {
      const fallback = loadReviewFallback();
      const keptInFallback = Object.values(fallback).filter((r) => r.keep).length;
      if (keptInFallback > 0) {
        return fallbackResponse("Database returned no review rows; serving seeded snapshot.");
      }
    }

    return NextResponse.json({
      ok: true,
      reviews: fromDb,
      source: "database",
    });
  } catch (error) {
    console.error("[tmc-review] GET error:", error);
    return fallbackResponse(dbErrorMessage(error));
  }
}

export async function POST(request: Request) {
  try {
    const { prisma, resolveDatabaseUrl } = await import("@/lib/database/prisma");

    if (!resolveDatabaseUrl()) {
      return NextResponse.json(
        {
          error: "Database unavailable",
          detail:
            "Set DATABASE_URL (or POSTGRES_PRISMA_URL / POSTGRES_URL) so review saves can persist.",
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { handle, ...fields } = patchSchema.parse(body);

    const data: Record<string, unknown> = {};
    if (fields.keep !== undefined) data.keep = fields.keep;
    if (fields.displayName !== undefined) data.displayName = fields.displayName;
    if (fields.priceGbp !== undefined) data.priceGbp = fields.priceGbp;
    if (fields.notes !== undefined) data.notes = fields.notes;
    if (fields.preferredMetal !== undefined) data.preferredMetal = fields.preferredMetal;
    if (fields.options !== undefined) data.options = JSON.stringify(fields.options);

    await prisma.tmcRingReview.upsert({
      where: { handle },
      create: { handle, ...data },
      update: data,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    console.error("[tmc-review] POST error:", error);
    return NextResponse.json(
      { error: "Internal server error", detail: dbErrorMessage(error) },
      { status: 500 }
    );
  }
}
