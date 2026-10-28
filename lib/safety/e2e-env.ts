import { existsSync } from "node:fs";
import path from "node:path";
import { config as loadEnv } from "dotenv";
import { isSupabaseHost, parseDatabaseHost } from "./database-url";
import type { EnvBag } from "./production";

const LIVE_KEY_RE = /(sk_live|pk_live)/i;

export class UnsafeE2EEnvError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnsafeE2EEnvError";
  }
}

function databaseCandidates(env: EnvBag): Array<[string, string]> {
  const keys = [
    "DATABASE_URL",
    "TEST_DATABASE_URL",
    "POSTGRES_URL",
    "POSTGRES_PRISMA_URL",
    "POSTGRES_URL_NON_POOLING",
  ] as const;
  const found: Array<[string, string]> = [];
  for (const key of keys) {
    const value = env[key]?.trim();
    if (value) found.push([key, value]);
  }
  return found;
}

export function assertSafeE2EEnv(env: EnvBag = process.env): void {
  const stripeKeys = [
    env.STRIPE_SECRET_KEY,
    env.STRIPE_PUBLISHABLE_KEY,
    env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  ];
  for (const value of stripeKeys) {
    if (value && LIVE_KEY_RE.test(value)) {
      throw new UnsafeE2EEnvError(
        "Refusing to run browser/e2e tests with live Stripe keys (sk_live / pk_live)."
      );
    }
  }

  for (const [key, value] of Object.entries(env)) {
    if (typeof value === "string" && LIVE_KEY_RE.test(value)) {
      throw new UnsafeE2EEnvError(
        `Refusing to run browser/e2e tests: ${key} contains a live key (sk_live / pk_live).`
      );
    }
  }

  for (const [key, value] of databaseCandidates(env)) {
    let host: string;
    try {
      host = parseDatabaseHost(value);
    } catch {
      throw new UnsafeE2EEnvError(
        `Refusing to run browser/e2e tests: ${key} is not a valid database URL.`
      );
    }
    if (isSupabaseHost(host)) {
      throw new UnsafeE2EEnvError(
        `Refusing to run browser/e2e tests against Supabase/prod host in ${key} (${host}).`
      );
    }
  }
}

export function loadE2EEnv(cwd: string = process.cwd()): string {
  const envPath = path.resolve(cwd, ".env.e2e");
  if (!existsSync(envPath)) {
    throw new UnsafeE2EEnvError(
      "Missing .env.e2e. Copy .env.e2e.example to .env.e2e and point it at a local test database. Browser tests never load .env.local production keys."
    );
  }
  loadEnv({ path: envPath, override: true });
  assertSafeE2EEnv(process.env);
  return envPath;
}
