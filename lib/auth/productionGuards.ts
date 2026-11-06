import { isProductionRuntime, type EnvBag } from "@/lib/safety/production";

/**
 * DISABLE_ADMIN_AUTH and DEMO_ADMIN_* never take effect in production
 * (NODE_ENV=production or VERCEL_ENV=production). Fail closed.
 */
export function isAdminAuthDisabled(
  env: EnvBag = process.env
): boolean {
  if (isProductionRuntime(env)) return false;
  return env.DISABLE_ADMIN_AUTH === "true";
}

export function isDemoAdminBypassEnabled(
  env: EnvBag = process.env
): boolean {
  if (isProductionRuntime(env)) return false;
  return Boolean(env.DEMO_ADMIN_EMAIL && env.DEMO_ADMIN_PASSWORD);
}

export function tmcReviewAllowedEmails(
  env: EnvBag = process.env
): string[] {
  return (env.TMC_REVIEW_ALLOWED_EMAILS || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}
