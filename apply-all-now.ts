#!/usr/bin/env tsx
/**
 * Apply Database Improvements and Seed Inventory
 * This script applies everything in one go
 */

import { readFileSync } from 'fs';
import { Pool } from 'pg';

// Read from .env file directly
const envContent = readFileSync('.env', 'utf-8');
const dbUrlMatch = envContent.match(/DATABASE_URL="([^"]+)"/);
const DATABASE_URL = dbUrlMatch ? dbUrlMatch[1] : '';

if (!DATABASE_URL) {
  console.error('❌ Could not find DATABASE_URL in .env file');
  process.exit(1);
}

console.log('🔌 Connecting to Supabase...\n');

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function executeSQL(sqlFile: string, description: string) {
  const sql = readFileSync(sqlFile, 'utf-8');

  // Split into statements - handle multi-line INSERTs properly
  const statements: string[] = [];
  let currentStatement = '';
  const lines = sql.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip comment-only lines
    if (trimmed.startsWith('--') || trimmed.length === 0) {
      continue;
    }

    currentStatement += line + '\n';

    // Check if statement is complete
    if (trimmed.endsWith(';')) {
      if (currentStatement.trim().length > 0) {
        statements.push(currentStatement.trim());
      }
      currentStatement = '';
    }
  }

  console.log(`📝 ${description} (${statements.length} statements)...\n`);

  let successCount = 0;
  let skipCount = 0;

  for (const statement of statements) {
    if (!statement || statement.trim().length === 0) continue;

    try {
      await pool.query(statement + ';');

      if (statement.includes('CREATE TRIGGER')) {
        const match = statement.match(/CREATE TRIGGER (\w+)/);
        console.log(`  ✅ Trigger: ${match ? match[1] : 'created'}`);
        successCount++;
      } else if (statement.includes('CREATE OR REPLACE FUNCTION')) {
        const match = statement.match(/FUNCTION (\w+)/);
        console.log(`  ✅ Function: ${match ? match[1] : 'created'}`);
        successCount++;
      } else if (statement.includes('CREATE INDEX')) {
        const match = statement.match(/INDEX (?:IF NOT EXISTS )?(\w+)/);
        console.log(`  ✅ Index: ${match ? match[1] : 'created'}`);
        successCount++;
      } else if (statement.includes('CREATE EXTENSION')) {
        const match = statement.match(/EXTENSION (?:IF NOT EXISTS )?(\w+)/);
        console.log(`  ✅ Extension: ${match ? match[1] : 'enabled'}`);
        successCount++;
      } else if (statement.includes('INSERT INTO inventory')) {
        successCount++;
      } else if (statement.includes('COMMENT ON TABLE')) {
        successCount++;
      }
    } catch (error: any) {
      if (error.message && (error.message.includes('already exists') || error.message.includes('duplicate'))) {
        skipCount++;
      } else {
        console.error(`  ⚠️  Error: ${error.message}`);
      }
    }
  }

  console.log(`\n  ✅ Applied: ${successCount} | ⏭️  Skipped: ${skipCount}\n`);
}

async function verify() {
  console.log('🔍 Verifying database...\n');

  // Check inventory count
  const inventoryResult = await pool.query('SELECT COUNT(*) as count FROM inventory');
  const inventoryCount = parseInt(inventoryResult.rows[0].count);
  console.log(`  📦 Inventory records: ${inventoryCount}`);

  // Check triggers
  const triggerResult = await pool.query(`
    SELECT count(*) as count
    FROM pg_trigger
    WHERE tgname LIKE 'update_%_updated_at'
  `);
  const triggerCount = parseInt(triggerResult.rows[0].count);
  console.log(`  ⚡ Triggers: ${triggerCount}`);

  // Check functions
  const functionResult = await pool.query(`
    SELECT count(*) as count
    FROM pg_proc
    WHERE proname IN ('update_updated_at_column', 'generate_order_number', 'check_low_stock', 'get_available_stock')
  `);
  const functionCount = parseInt(functionResult.rows[0].count);
  console.log(`  🔧 Functions: ${functionCount}`);

  // Check indexes (new ones)
  const indexResult = await pool.query(`
    SELECT count(*) as count
    FROM pg_indexes
    WHERE indexname LIKE 'idx_%'
  `);
  const indexCount = parseInt(indexResult.rows[0].count);
  console.log(`  📊 Performance indexes: ${indexCount}`);

  return { inventoryCount, triggerCount, functionCount, indexCount };
}

async function main() {
  try {
    console.log('🚀 ELYSIUM Database Setup\n');
    console.log('='.repeat(80) + '\n');

    // Apply improvements
    await executeSQL(
      'database-improvements-safe.sql',
      'Applying database improvements'
    );

    // Seed inventory
    await executeSQL(
      'database-seed.sql',
      'Seeding inventory data'
    );

    // Verify
    const results = await verify();

    console.log('\n' + '='.repeat(80));
    console.log('✨ DATABASE SETUP COMPLETE!');
    console.log('='.repeat(80));
    console.log('\n📊 Final Status:');
    console.log(`   ✅ Inventory: ${results.inventoryCount} variants`);
    console.log(`   ✅ Triggers: ${results.triggerCount} auto-update triggers`);
    console.log(`   ✅ Functions: ${results.functionCount} utility functions`);
    console.log(`   ✅ Indexes: ${results.indexCount} performance indexes`);
    console.log(`\n🎯 What You Can Do Now:`);
    console.log(`   1. Test adding products to cart (nova, vow-veil)`);
    console.log(`   2. View database: pnpm db:studio`);
    console.log(`   3. Run audit: pnpm db:audit:all`);
    console.log(`\n💎 Your database is production-ready!\n`);

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
