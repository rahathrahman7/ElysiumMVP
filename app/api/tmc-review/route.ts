import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma, resolveDatabaseUrl } from "@/lib/database/prisma";
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

export async function GET() {
  try {
    if (!resolveDatabaseUrl()) {
      const reviews = await loadReviewFallback();
      return NextResponse.json({
        ok: true,
        reviews,
        source: "fallback",
        warning: "DATABASE_URL is not configured; serving seeded review snapshot.",
      });
    }

    const rows = await prisma.tmcRingReview.findMany();
    return NextResponse.json({
      ok: true,
      reviews: rowsToReviews(rows ?? []),
      source: "database",
    });
  } catch (error) {
    console.error("[tmc-review] GET error:", error);
    try {
      const reviews = await loadReviewFallback();
      return NextResponse.json({
        ok: true,
        reviews,
        source: "fallback",
        warning: dbErrorMessage(error),
      });
    } catch {
      return NextResponse.json(
        { error: "Internal server error", detail: dbErrorMessage(error) },
        { status: 500 }
      );
    }
  }
}

export async function POST(request: Request) {
  try {
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
