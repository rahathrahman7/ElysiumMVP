/**
 * Runtime environment helpers. Fail closed in production so demo/debug
 * bypasses cannot be enabled by a stray Vercel env var.
 *
 * "Production" here means either:
 * - NODE_ENV=production (next start, Vercel builds/runtime)
 * - VERCEL_ENV=production (Vercel production deployments)
 *
 * Preview deployments also set NODE_ENV=production, so bypasses stay off there.
 */
export type EnvBag = Record<string, string | undefined>;

export function isProductionRuntime(
  env: EnvBag = process.env
): boolean {
  return env.NODE_ENV === "production" || env.VERCEL_ENV === "production";
}

export function assertNotProductionSeed(
  env: EnvBag = process.env
): void {
  if (
    isProductionRuntime(env) &&
    env.ALLOW_PRODUCTION_SEED !== "true"
  ) {
    throw new Error(
      "Refusing to seed/wipe/reset in production. Set ALLOW_PRODUCTION_SEED=true only for an explicit, allowlisted test target (never prod Supabase)."
    );
  }
}
