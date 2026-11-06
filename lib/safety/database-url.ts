import type { EnvBag } from "./production";

/**
 * Shared database target allowlist.
 *
 * Wipe / reset / migrate / seed scripts must refuse to run unless the
 * connection string points at localhost, 127.0.0.1, a docker hostname,
 * or a host listed in ALLOWED_TEST_DB_HOSTS.
 *
 * Production Supabase hosts are never allowed, even if listed.
 */

const LOCAL_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
  "[::1]",
  "postgres",
  "db",
  "database",
  "host.docker.internal",
]);

const SUPABASE_HOST_RE =
  /(^|\.)supabase\.(co|com)$|(^|\.)pooler\.supabase\.com$/i;

export class UnsafeDatabaseTargetError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnsafeDatabaseTargetError";
  }
}

export function parseDatabaseHost(connectionString: string): string {
  try {
    const parsed = new URL(connectionString);
    return (parsed.hostname || "").toLowerCase();
  } catch {
    throw new UnsafeDatabaseTargetError(
      "Invalid database URL. Expected a postgresql:// connection string."
    );
  }
}

export function isSupabaseHost(host: string): boolean {
  const normalised = host.toLowerCase().replace(/^\[|\]$/g, "");
  return SUPABASE_HOST_RE.test(normalised) || normalised.includes("supabase.co");
}

export function allowedTestDbHosts(
  env: EnvBag = process.env
): string[] {
  return (env.ALLOWED_TEST_DB_HOSTS || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

export function isLocalOrAllowedDatabaseHost(
  host: string,
  env: EnvBag = process.env
): boolean {
  const normalised = host.toLowerCase().replace(/^\[|\]$/g, "");
  if (isSupabaseHost(normalised)) {
    return false;
  }
  if (LOCAL_HOSTS.has(normalised)) {
    return true;
  }
  return allowedTestDbHosts(env).includes(normalised);
}

export function assertSafeDatabaseUrl(
  connectionString: string,
  env: EnvBag = process.env
): string {
  const trimmed = connectionString.trim();
  if (!trimmed) {
    throw new UnsafeDatabaseTargetError("Database URL is empty.");
  }
  const host = parseDatabaseHost(trimmed);
  if (!host) {
    throw new UnsafeDatabaseTargetError("Database URL is missing a host.");
  }
  if (isSupabaseHost(host)) {
    throw new UnsafeDatabaseTargetError(
      `Refusing to run against Supabase host "${host}". Wipe/reset/migrate/seed scripts never target prod Supabase.`
    );
  }
  if (!isLocalOrAllowedDatabaseHost(host, env)) {
    throw new UnsafeDatabaseTargetError(
      `Refusing to run against database host "${host}". Allowed hosts: localhost, 127.0.0.1, docker (postgres/db/database/host.docker.internal), or ALLOWED_TEST_DB_HOSTS. Never prod Supabase.`
    );
  }
  return trimmed;
}

function firstConfiguredUrl(env: EnvBag): string | undefined {
  const candidates = [
    env.DATABASE_URL,
    env.POSTGRES_PRISMA_URL,
    env.POSTGRES_URL,
    env.POSTGRES_URL_NON_POOLING,
  ];
  for (const value of candidates) {
    if (value && value.trim() && !value.includes("placeholder:placeholder")) {
      return value.trim();
    }
  }
  return undefined;
}

export function assertSafeDatabaseTargetFromEnv(
  env: EnvBag = process.env
): string {
  const url = firstConfiguredUrl(env);
  if (!url) {
    throw new UnsafeDatabaseTargetError(
      "No DATABASE_URL (or POSTGRES_PRISMA_URL / POSTGRES_URL) is set."
    );
  }
  return assertSafeDatabaseUrl(url, env);
}
