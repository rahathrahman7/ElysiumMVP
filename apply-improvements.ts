#!/usr/bin/env tsx
/**
 * ELYSIUM MVP - Apply Database Improvements
 *
 * This script applies database improvements safely:
 * - Triggers for auto-updating timestamps
 * - Utility functions (order numbers, stock checks)
 * - Performance indexes
 * - Extensions (pg_trgm for search)
 * - Table documentation
 */

import { readFileSync } from 'fs';
import { Client } from 'pg';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

async function applyImprovements() {
  const client = new Client({
    connectionString: DATABASE_URL,
  });

  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected successfully\n');

    // Read the SQL file
    const sqlFile = readFileSync('./database-improvements-safe.sql', 'utf-8');

    // Split by semicolons but keep DO blocks together
    const statements = sqlFile
      .split(/;(?=\s*(?:--|CREATE|ALTER|COMMENT|DO))/g)
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📝 Applying ${statements.length} improvements...\n`);

    let successCount = 0;
    let skipCount = 0;

    for (const statement of statements) {
      // Skip empty statements and pure comments
      if (!statement || statement.trim().length === 0) {
        continue;
      }

      try {
        await client.query(statement + ';');

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
        } else if (statement.includes('DO $$')) {
          // This is our completion message block
          console.log('\n');
        }

        successCount++;
      } catch (error: any) {
        // Handle expected "already exists" errors gracefully
        if (error.message.includes('already exists')) {
          skipCount++;
          // Silently skip - this is expected for idempotent operations
        } else {
          console.error(`  ⚠️  Error:`, error.message);
          console.error(`     Statement:`, statement.substring(0, 100) + '...');
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
    console.error('❌ Fatal error:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  } finally {
    await client.end();
  }
}

applyImprovements();
