import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaPool: Pool | undefined;
  prismaAdapter: PrismaPg | undefined;
};

// Check if we're in a build environment
function isBuildPhase(): boolean {
  // Check various build-time indicators
  if (process.env.NEXT_PHASE === 'phase-production-build') return true;
  if (process.env.BUILDING === 'true') return true;
  // During Vercel build, VERCEL is set but VERCEL_ENV might be 'production'
  if (process.env.VERCEL === '1' && !process.env.VERCEL_URL) return true;
  return false;
}

function getPrismaClient(): PrismaClient {
  // If no DATABASE_URL, return a mock/stub client for build
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl || isBuildPhase()) {
    // During build or when no DB URL, create client without adapter
    // This won't work for queries but allows build to proceed
    if (!globalForPrisma.prisma) {
      // Create a minimal client that won't crash on import
      // Actual queries will fail but build will succeed
      globalForPrisma.prisma = new Proxy({} as PrismaClient, {
        get: (target, prop) => {
          if (prop === 'then') return undefined; // Not a promise
          if (typeof prop === 'string') {
            // Return a proxy for model access that returns empty results
            return new Proxy({}, {
              get: () => async () => {
                console.warn(`Prisma: Database not available during build (${String(prop)})`);
                return null;
              }
            });
          }
          return undefined;
        }
      });
    }
    return globalForPrisma.prisma;
  }

  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  const pool = new Pool({
    connectionString: databaseUrl,
    max: 10,
  });

  const adapter = new PrismaPg(pool);

  const prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaPool = pool;
  globalForPrisma.prismaAdapter = adapter;

  return prisma;
}

export const prisma = getPrismaClient();
export default prisma;
