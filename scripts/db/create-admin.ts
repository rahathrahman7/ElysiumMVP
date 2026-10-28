/**
 * Create (or promote) an ADMIN user on an allowlisted local/test database.
 * Usage: ADMIN_EMAIL=a@b.c ADMIN_PASSWORD='...' pnpm db:create-admin
 */
import { config as loadEnv } from "dotenv";
import bcrypt from "bcryptjs";
import { assertSafeDatabaseTargetFromEnv } from "../../lib/safety/database-url";
import { assertNotProductionSeed } from "../../lib/safety/production";
import { prisma } from "../../lib/database/prisma";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

async function main() {
  assertSafeDatabaseTargetFromEnv();
  assertNotProductionSeed();

  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || "ELYSIUM Admin";

  if (!email || !password) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD.");
  }
  if (password.length < 12) {
    throw new Error("ADMIN_PASSWORD must be at least 12 characters.");
  }

  const hashed = await bcrypt.hash(password, 12);
  const user = await prisma.user.upsert({
    where: { email },
    create: { email, password: hashed, name, role: "ADMIN" },
    update: { password: hashed, name, role: "ADMIN" },
    select: { id: true, email: true, role: true },
  });

  console.log(`Admin ready: ${user.email} (${user.role})`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  })
  .finally(async () => {
    const disconnect = (prisma as { $disconnect?: () => Promise<void> }).$disconnect;
    if (typeof disconnect === "function") {
      await disconnect.call(prisma).catch(() => undefined);
    }
  });
