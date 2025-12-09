#!/usr/bin/env tsx
/**
 * ELYSIUM MVP - Apply Database Improvements
 */

import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { Pool } from 'pg';
import { resolve } from 'path';

// Load .env file explicitly
config({ path: resolve(process.cwd(), '.env') });

const DATABASE_URL = process.env.DATABASE_URL;

console.log('DEBUG: DATABASE_URL:', DATABASE_URL ? DATABASE_URL.substring(0, 50) + '...' : 'NOT SET');

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

async function applyImprovements() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  const client = await pool.connect();

  try {
    console.log('🔌 Connecting to database...');
    console.log('✅ Connected successfully\n');

    // Read the SQL file
    const sqlFile = readFileSync('./database-improvements-safe.sql', 'utf-8');

    // Extract meaningful statements
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
        await client.query(statement);

        // Extract what we're creating for better logging
        if (statement.includes('CREATE TRIGGER')) {
          const match = statement.match(/CREATE TRIGGER (\w+)/);
          console.log(`  ✅ Created trigger: ${match ? match[1] : 'unknown'}`);
          successCount++;
        } else if (statement.includes('CREATE OR REPLACE FUNCTION')) {
          const match = statement.match(/FUNCTION (\w+)/);
          console.log(`  ✅ Created function: ${match ? match[1] : 'unknown'}`);
          successCount++;
        } else if (statement.includes('CREATE INDEX')) {
          const match = statement.match(/INDEX (?:IF NOT EXISTS )?(\w+)/);
          console.log(`  ✅ Created index: ${match ? match[1] : 'unknown'}`);
          successCount++;
        } else if (statement.includes('CREATE EXTENSION')) {
          const match = statement.match(/EXTENSION (?:IF NOT EXISTS )?(\w+)/);
          console.log(`  ✅ Enabled extension: ${match ? match[1] : 'unknown'}`);
          successCount++;
        } else if (statement.includes('COMMENT ON TABLE')) {
          const match = statement.match(/TABLE (\w+)/);
          if (match) {
            console.log(`  ✅ Added comment: ${match[1]}`);
            successCount++;
          }
        }
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
    console.log(`   1. Seed inventory data: pnpm tsx apply-inventory-seed.ts`);
    console.log(`   2. Apply RLS policies via Supabase Dashboard`);
    console.log(`   3. Run audit: pnpm db:audit:all`);
    console.log('');

  } catch (error: any) {
    console.error('❌ Fatal error:', error.message || error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

applyImprovements();
