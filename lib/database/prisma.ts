import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaPool: Pool | undefined;
  prismaAdapter: PrismaPg | undefined;
};

/** Resolve a Postgres URL from common Vercel / Supabase env names. */
export function resolveDatabaseUrl(): string | undefined {
  const candidates = [
    process.env.DATABASE_URL,
    process.env.POSTGRES_PRISMA_URL,
    process.env.POSTGRES_URL,
    process.env.POSTGRES_URL_NON_POOLING,
  ];
  for (const value of candidates) {
    if (value && value.trim() && !value.includes('placeholder:placeholder')) {
      return value.trim();
    }
  }
  return undefined;
}

function isBuildPhase(): boolean {
  if (process.env.NEXT_PHASE === 'phase-production-build') return true;
  if (process.env.BUILDING === 'true') return true;
  return false;
}

function createMockClient(): PrismaClient {
  // Build-time stub: model methods return empty/safe values so imports succeed.
  return new Proxy({} as PrismaClient, {
    get: (_target, prop) => {
      if (prop === 'then') return undefined;
      if (typeof prop === 'string') {
        return new Proxy(
          {},
          {
            get: (_t, method) => {
              if (method === 'findMany') return async () => [];
              if (method === 'count') return async () => 0;
              if (method === 'aggregate' || method === 'groupBy') return async () => [];
              return async () => null;
            },
          }
        );
      }
      return undefined;
    },
  });
}

function getPrismaClient(): PrismaClient {
  const databaseUrl = resolveDatabaseUrl();

  if (!databaseUrl || isBuildPhase()) {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = createMockClient();
    }
    return globalForPrisma.prisma;
  }

  // Keep Prisma schema `env("DATABASE_URL")` happy when only POSTGRES_* is set.
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = databaseUrl;
  }

  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  const pool = new Pool({
    connectionString: databaseUrl,
    max: 10,
    connectionTimeoutMillis: 5_000,
    idleTimeoutMillis: 10_000,
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
