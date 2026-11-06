import { createHmac, timingSafeEqual } from "node:crypto";
import type { EnvBag } from "@/lib/safety/production";

export const TMC_REVIEW_COOKIE = "elysium_tmc_review";
const COOKIE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function cookieSecret(env: EnvBag = process.env): string | undefined {
  const secret =
    env.TMC_REVIEW_COOKIE_SECRET?.trim() || env.NEXTAUTH_SECRET?.trim();
  return secret || undefined;
}

export function safeEqualString(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) {
    if (left.length > 0) {
      timingSafeEqual(left, left);
    }
    return false;
  }
  return timingSafeEqual(left, right);
}

export function signTmcReviewCookie(
  now = Date.now(),
  env: EnvBag = process.env
): string {
  const secret = cookieSecret(env);
  if (!secret) {
    throw new Error(
      "Cannot issue a TMC review session: set NEXTAUTH_SECRET or TMC_REVIEW_COOKIE_SECRET."
    );
  }
  const expiresAt = String(now + COOKIE_TTL_MS);
  const payload = `v1.${expiresAt}`;
  const hmac = createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${hmac}`;
}

export function verifyTmcReviewCookie(
  token: string | undefined,
  now = Date.now(),
  env: EnvBag = process.env
): boolean {
  if (!token) return false;
  const secret = cookieSecret(env);
  if (!secret) return false;

  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "v1") return false;
  const [, expiresAt, hmac] = parts;
  if (!expiresAt || !hmac) return false;
  const expiresMs = Number(expiresAt);
  if (!Number.isFinite(expiresMs) || expiresMs < now) return false;

  const payload = `v1.${expiresAt}`;
  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  return safeEqualString(hmac, expected);
}

export function tmcReviewCookieHeader(
  token: string,
  env: EnvBag = process.env
): string {
  const maxAge = Math.floor(COOKIE_TTL_MS / 1000);
  const secure =
    env.NODE_ENV === "production" || env.VERCEL_ENV === "production"
      ? "; Secure"
      : "";
  return `${TMC_REVIEW_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

export function clearTmcReviewCookieHeader(): string {
  return `${TMC_REVIEW_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export function passcodeLoginConfigured(
  env: EnvBag = process.env
): boolean {
  return Boolean(env.TMC_REVIEW_PASSCODE?.trim());
}

export function passcodeMatches(
  candidate: string,
  env: EnvBag = process.env
): boolean {
  const expected = env.TMC_REVIEW_PASSCODE?.trim();
  if (!expected || !candidate) return false;
  return safeEqualString(candidate, expected);
}

export function readCookieFromRequest(
  request: Request | undefined,
  name: string
): string | undefined {
  if (!request) return undefined;
  const header = request.headers.get("cookie");
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const trimmed = part.trim();
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    if (key === name) {
      return decodeURIComponent(trimmed.slice(eq + 1));
    }
  }
  return undefined;
}
