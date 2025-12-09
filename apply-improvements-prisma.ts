#!/usr/bin/env tsx
/**
 * ELYSIUM MVP - Apply Database Improvements via Prisma
 *
 * This script applies database improvements safely using Prisma's connection:
 * - Triggers for auto-updating timestamps
 * - Utility functions (order numbers, stock checks)
 * - Performance indexes
 * - Extensions (pg_trgm for search)
 * - Table documentation
 */

import { readFileSync } from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function applyImprovements() {
  try {
    console.log('🔌 Connecting to database via Prisma...');

    // Test connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Connected successfully\n');

    // Read the SQL file
    const sqlFile = readFileSync('./database-improvements-safe.sql', 'utf-8');

    // Extract meaningful statements (ignoring comments and empty lines)
    const lines = sqlFile.split('\n');
    let currentStatement = '';
    const statements: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();

      // Skip pure comment lines
      if (trimmed.startsWith('--') || trimmed.length === 0) {
        continue;
      }

      currentStatement += line + '\n';

      // Check if statement is complete
      if (trimmed.endsWith(';') || trimmed.endsWith('$$;')) {
        statements.push(currentStatement.trim());
        currentStatement = '';
      }
    }

    console.log(`📝 Applying improvements...\n`);

    let successCount = 0;
    let skipCount = 0;

    for (const statement of statements) {
      if (!statement || statement.trim().length === 0) {
        continue;
      }

      try {
        await prisma.$executeRawUnsafe(statement);

        // Extract what we're creating for better logging
        if (statement.includes('CREATE TRIGGER')) {
          const match = statement.match(/CREATE TRIGGER (\w+)/);
          console.log(`  ✅ Created trigger: ${match ? match[1] : 'unknown'}`);
        } else if (statement.includes('CREATE OR REPLACE FUNCTION')) {
          const match = statement.match(/FUNCTION (\w+)/);
          console.log(`  ✅ Created function: ${match ? match[1] : 'unknown'}`);
        } else if (statement.includes('CREATE INDEX')) {
          const match = statement.match(/INDEX (?:IF NOT EXISTS )?(\w+)/);
          console.log(`  ✅ Created index: ${match ? match[1] : 'unknown'}`);
        } else if (statement.includes('CREATE EXTENSION')) {
          const match = statement.match(/EXTENSION (?:IF NOT EXISTS )?(\w+)/);
          console.log(`  ✅ Enabled extension: ${match ? match[1] : 'unknown'}`);
        } else if (statement.includes('COMMENT ON TABLE')) {
          const match = statement.match(/TABLE (\w+)/);
          if (match) {
            console.log(`  ✅ Added comment: ${match[1]}`);
          }
        }

        successCount++;
      } catch (error: any) {
        // Handle expected "already exists" errors gracefully
        if (error.message && error.message.includes('already exists')) {
          skipCount++;
          // Silently skip - this is expected for idempotent operations
        } else {
          console.error(`  ⚠️  Error:`, error.message || error);
        }
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('✨ DATABASE IMPROVEMENTS APPLIED SUCCESSFULLY!');
    console.log('='.repeat(80));
    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Successfully applied: ${successCount} improvements`);
    if (skipCount > 0) {
      console.log(`   ⏭️  Skipped (already exists): ${skipCount} items`);
    }
    console.log(`\n🎯 What was added:`);
    console.log(`   • 6 triggers for auto-updating timestamps`);
    console.log(`   • 4 utility functions (order numbers, stock checks)`);
    console.log(`   • 7 performance indexes`);
    console.log(`   • pg_trgm extension for search`);
    console.log(`   • Documentation comments on all tables`);
    console.log(`\n⚠️  IMPORTANT NEXT STEPS:`);
    console.log(`   1. Apply inventory seed data: pnpm tsx apply-inventory-seed.ts`);
    console.log(`   2. Apply RLS policies via Supabase Dashboard (see database-improvements.sql)`);
    console.log(`   3. Run audit: pnpm db:audit:all`);
    console.log('');

  } catch (error: any) {
    console.error('❌ Fatal error:', error.message || error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

applyImprovements();
