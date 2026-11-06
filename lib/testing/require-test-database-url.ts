import { assertSafeDatabaseUrl } from "@/lib/safety/database-url";
import type { EnvBag } from "@/lib/safety/production";

/**
 * Integration tests must set TEST_DATABASE_URL. There is no fallback to
 * DATABASE_URL — that would let a wipe/reset/truncate hit prod.
 */
export function requireTestDatabaseUrl(
  env: EnvBag = process.env
): string {
  const url = env.TEST_DATABASE_URL?.trim();
  if (!url) {
    throw new Error(
      "TEST_DATABASE_URL is required for tests that touch the database. Refusing to fall back to DATABASE_URL."
    );
  }
  return assertSafeDatabaseUrl(url, env);
}
