import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/database/prisma";
import { sendWaitlistSignupNotification } from "@/lib/services/email";

const waitlistSchema = z.object({
  email: z.string().email("Invalid email address"),
  source: z.string().min(1).max(100).default("prive-collection"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = waitlistSchema.parse(body);

    await prisma.waitlistSignup.upsert({
      where: {
        email_source: {
          email: data.email.toLowerCase(),
          source: data.source,
        },
      },
      create: {
        email: data.email.toLowerCase(),
        source: data.source,
      },
      update: {},
    });

    try {
      await sendWaitlistSignupNotification(data.email, data.source);
    } catch (emailError) {
      console.error("Waitlist admin notification failed:", emailError);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Waitlist signup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
