import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/database/prisma";

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

export async function GET() {
  try {
    const rows = await prisma.tmcRingReview.findMany();
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
    return NextResponse.json({ ok: true, reviews: byHandle });
  } catch (error) {
    console.error("[tmc-review] GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
