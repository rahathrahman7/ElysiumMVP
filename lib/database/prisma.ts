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
  if (process.env.npm_lifecycle_event === 'build') return true;
  // On Vercel, build workers often have VERCEL=1 without a stable VERCEL_URL.
  // Avoid opening Postgres pools during those imports — they hang the deploy.
  if (process.env.VERCEL === '1' && !process.env.VERCEL_URL) return true;
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

function createPrismaClient(): PrismaClient {
  try {
    const databaseUrl = resolveDatabaseUrl();

    if (!databaseUrl || isBuildPhase()) {
      return createMockClient();
    }

    // Keep Prisma schema `env("DATABASE_URL")` happy when only POSTGRES_* is set.
    if (!process.env.DATABASE_URL) {
      process.env.DATABASE_URL = databaseUrl;
    }

    const pool = new Pool({
      connectionString: databaseUrl,
      max: 5,
      connectionTimeoutMillis: 4_000,
      idleTimeoutMillis: 10_000,
      // Serverless / Vercel often needs TLS to Supabase poolers.
      ssl:
        databaseUrl.includes('supabase') || databaseUrl.includes('sslmode=require')
          ? { rejectUnauthorized: false }
          : undefined,
    });

    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });

    globalForPrisma.prismaPool = pool;
    globalForPrisma.prismaAdapter = adapter;

    return prisma;
  } catch (error) {
    console.error('[prisma] Failed to initialise client, using mock:', error);
    return createMockClient();
  }
}

function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

// Lazy proxy so importing this module during `next build` does not open a Pool.
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getPrismaClient();
    const value = Reflect.get(client as object, prop, receiver);
    return typeof value === 'function' ? value.bind(client) : value;
  },
});

export default prisma;
