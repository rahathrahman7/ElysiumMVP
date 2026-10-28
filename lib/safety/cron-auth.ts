import { NextResponse } from "next/server";
import type { EnvBag } from "./production";

/**
 * Fail-closed cron/scheduled-route authorisation.
 * Vercel sends `Authorization: Bearer ${CRON_SECRET}` when CRON_SECRET is set.
 * If CRON_SECRET is unset, every request is rejected (no "Bearer undefined").
 */
export type CronAuthResult =
  | { ok: true }
  | { ok: false; status: 401; message: string };

export function authorizeCronRequest(
  request: Request,
  env: EnvBag = process.env
): CronAuthResult {
  const secret = env.CRON_SECRET?.trim();
  if (!secret) {
    return {
      ok: false,
      status: 401,
      message: "CRON_SECRET is not configured",
    };
  }

  const header = request.headers.get("authorization");
  if (header !== `Bearer ${secret}`) {
    return { ok: false, status: 401, message: "Unauthorized" };
  }

  return { ok: true };
}

export function cronUnauthorizedResponse(result: Exclude<CronAuthResult, { ok: true }>) {
  return NextResponse.json({ error: result.message }, { status: result.status });
}

export function assertCronAuthorized(
  request: Request,
  env: EnvBag = process.env
): NextResponse | null {
  const result = authorizeCronRequest(request, env);
  if (result.ok) return null;
  return cronUnauthorizedResponse(result);
}
