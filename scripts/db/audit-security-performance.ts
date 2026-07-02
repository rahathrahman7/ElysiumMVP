#!/usr/bin/env tsx
/**
 * ELYSIUM database security and performance audit.
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

type Severity = 'error' | 'warning' | 'info' | 'pass';

interface Finding {
  severity: Severity;
  category: string;
  message: string;
}

const findings: Finding[] = [];

function add(severity: Severity, category: string, message: string) {
  findings.push({ severity, category, message });
}

function createPrismaClient(): PrismaClient | null {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return null;
  const pool = new Pool({ connectionString: databaseUrl, max: 2 });
  return new PrismaClient({ adapter: new PrismaPg(pool) });
}

async function main() {
  console.log('ELYSIUM Security & Performance Audit');
  console.log(`Date: ${new Date().toISOString()}\n`);

  const prisma = createPrismaClient();
  if (!prisma) {
    add('warning', 'connection', 'DATABASE_URL not set — cannot run security audit');
    printAndExit();
    return;
  }

  try {
    await prisma.$connect();
    add('pass', 'connection', 'Connected to database');

    const rls = await prisma.$queryRaw<{ tablename: string; rowsecurity: boolean }[]>`
      SELECT tablename, rowsecurity
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename
    `;

    const withoutRls = rls.filter((t) => !t.rowsecurity);
    if (withoutRls.length) {
      add(
        'error',
        'security',
        `Row Level Security disabled on ${withoutRls.length} table(s): ${withoutRls.map((t) => t.tablename).join(', ')}`
      );
    } else {
      add('pass', 'security', 'Row Level Security enabled on all public tables');
    }

    const indexes = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count
      FROM pg_indexes
      WHERE schemaname = 'public'
    `;
    add('info', 'performance', `Public schema has ${indexes[0]?.count ?? 0} indexes`);

    const fks = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count
      FROM information_schema.table_constraints
      WHERE constraint_type = 'FOREIGN KEY' AND table_schema = 'public'
    `;
    add('info', 'schema', `Public schema has ${fks[0]?.count ?? 0} foreign keys`);

    const dbSize = await prisma.$queryRaw<{ size: string }[]>`
      SELECT pg_size_pretty(pg_database_size(current_database())) AS size
    `;
    add('info', 'performance', `Database size: ${dbSize[0]?.size ?? 'unknown'}`);
  } catch (error) {
    add('error', 'connection', `Database error: ${String(error)}`);
  } finally {
    await prisma.$disconnect();
  }

  printAndExit();
}

function printAndExit() {
  for (const severity of ['error', 'warning', 'info', 'pass'] as Severity[]) {
    const group = findings.filter((f) => f.severity === severity);
    if (!group.length) continue;
    console.log(`\n=== ${severity.toUpperCase()} (${group.length}) ===`);
    for (const f of group) console.log(`[${f.category}] ${f.message}`);
  }

  const errors = findings.filter((f) => f.severity === 'error').length;
  console.log(`\nDone: ${errors} error(s)`);
  process.exit(errors > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
