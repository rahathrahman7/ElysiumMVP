import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/database/prisma";

export const dynamic = "force-dynamic";

const schema = z.object({
  elysiumSlug: z.string().min(1).max(200),
  elysiumTitle: z.string().max(200).optional(),
  tmcHandle: z.string().max(200).nullable().optional(),
});

export async function GET() {
  try {
    const rows = await prisma.tmcRingMatch.findMany();
    const bySlug: Record<string, { elysiumTitle: string; tmcHandle: string }> = {};
    const ownedByHandle: Record<string, string> = {};
    for (const r of rows) {
      bySlug[r.elysiumSlug] = {
        elysiumTitle: r.elysiumTitle ?? "",
        tmcHandle: r.tmcHandle ?? "",
      };
      if (r.tmcHandle) ownedByHandle[r.tmcHandle] = r.elysiumTitle ?? "";
    }
    return NextResponse.json({ ok: true, bySlug, ownedByHandle });
  } catch (error) {
    console.error("[tmc-matches] GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
