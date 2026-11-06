import { config as loadEnv } from "dotenv";
import { assertSafeDatabaseTargetFromEnv } from "../lib/safety/database-url";
import { assertNotProductionSeed } from "../lib/safety/production";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

async function main() {
  assertSafeDatabaseTargetFromEnv();
  assertNotProductionSeed();
  console.log(
    "No default demo seed. TMC review data: pnpm db:seed:tmc. First admin: pnpm db:create-admin."
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
