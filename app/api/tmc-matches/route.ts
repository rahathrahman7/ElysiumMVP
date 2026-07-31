import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma, resolveDatabaseUrl } from "@/lib/database/prisma";
import { dbErrorMessage, loadMatchFallback } from "@/lib/tmc/review-fallback";

export const dynamic = "force-dynamic";

const schema = z.object({
  elysiumSlug: z.string().min(1).max(200),
  elysiumTitle: z.string().max(200).optional(),
  tmcHandle: z.string().max(200).nullable().optional(),
});

export async function GET() {
  try {
    if (!resolveDatabaseUrl()) {
      return NextResponse.json({
        ok: true,
        ...loadMatchFallback(),
        source: "fallback",
        warning: "DATABASE_URL is not configured; serving seeded match snapshot.",
      });
    }

    const rows = await Promise.race([
      prisma.tmcRingMatch.findMany(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("tmc_ring_matches query timed out after 4s")), 4000)
      ),
    ]);
    const bySlug: Record<string, { elysiumTitle: string; tmcHandle: string }> = {};
    const ownedByHandle: Record<string, string> = {};
    for (const r of rows ?? []) {
      bySlug[r.elysiumSlug] = {
        elysiumTitle: r.elysiumTitle ?? "",
        tmcHandle: r.tmcHandle ?? "",
      };
      if (r.tmcHandle) ownedByHandle[r.tmcHandle] = r.elysiumTitle ?? "";
    }
    return NextResponse.json({ ok: true, bySlug, ownedByHandle, source: "database" });
  } catch (error) {
    console.error("[tmc-matches] GET error:", error);
    return NextResponse.json({
      ok: true,
      ...loadMatchFallback(),
      source: "fallback",
      warning: dbErrorMessage(error),
    });
  }
}

export async function POST(request: Request) {
  try {
    if (!resolveDatabaseUrl()) {
      return NextResponse.json(
        {
          error: "Database unavailable",
          detail:
            "Set DATABASE_URL (or POSTGRES_PRISMA_URL / POSTGRES_URL) so match saves can persist.",
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { elysiumSlug, elysiumTitle, tmcHandle } = schema.parse(body);

    await prisma.tmcRingMatch.upsert({
      where: { elysiumSlug },
      create: { elysiumSlug, elysiumTitle: elysiumTitle ?? "", tmcHandle: tmcHandle ?? null },
      update: { elysiumTitle: elysiumTitle ?? "", tmcHandle: tmcHandle ?? null },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    console.error("[tmc-matches] POST error:", error);
    return NextResponse.json(
      { error: "Internal server error", detail: dbErrorMessage(error) },
      { status: 500 }
    );
  }
}
