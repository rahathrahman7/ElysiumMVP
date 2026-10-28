/**
 * Fail-closed wrapper for wipe/reset/migrate/seed commands.
 * Usage: tsx scripts/db/guarded-run.ts -- prisma migrate dev
 */
import { spawnSync } from "node:child_process";
import { config as loadEnv } from "dotenv";
import { assertSafeDatabaseTargetFromEnv } from "../../lib/safety/database-url";
import { assertNotProductionSeed } from "../../lib/safety/production";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

const dash = process.argv.indexOf("--");
const args = (dash >= 0 ? process.argv.slice(dash + 1) : process.argv.slice(2)).filter(Boolean);

if (args.length === 0) {
  console.error("usage: tsx scripts/db/guarded-run.ts -- <command> [...args]");
  process.exit(1);
}

try {
  assertSafeDatabaseTargetFromEnv();
  if (args.some((arg) => /seed|reset|wipe/i.test(arg))) {
    assertNotProductionSeed();
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}

const result = spawnSync(args[0], args.slice(1), {
  stdio: "inherit",
  env: process.env,
});

process.exit(result.status ?? 1);
