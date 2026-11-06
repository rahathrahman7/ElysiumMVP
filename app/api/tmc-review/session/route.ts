import { NextResponse } from "next/server";
import { z } from "zod";
import {
  clearTmcReviewCookieHeader,
  passcodeLoginConfigured,
  passcodeMatches,
  signTmcReviewCookie,
  tmcReviewCookieHeader,
} from "@/lib/auth/tmcReviewPasscode";

export const dynamic = "force-dynamic";

const schema = z.object({
  passcode: z.string().min(1).max(200),
});

export async function POST(request: Request) {
  if (!passcodeLoginConfigured()) {
    return NextResponse.json(
      { error: "Passcode login is not configured" },
      { status: 401 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid passcode" }, { status: 400 });
  }

  if (!passcodeMatches(parsed.data.passcode)) {
    return NextResponse.json({ error: "Invalid passcode" }, { status: 401 });
  }

  try {
    const token = signTmcReviewCookie();
    const response = NextResponse.json({ ok: true });
    response.headers.set("Set-Cookie", tmcReviewCookieHeader(token));
    return response;
  } catch (error) {
    console.error("[tmc-review] session cookie failed:", error);
    return NextResponse.json(
      { error: "Passcode login is not configured" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.headers.set("Set-Cookie", clearTmcReviewCookieHeader());
  return response;
}
