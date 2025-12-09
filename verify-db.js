const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf-8');
const connectionString = envContent.match(/DATABASE_URL="([^"]+)"/)[1];

async function verify() {
  const client = new Client({ connectionString });

  try {
    await client.connect();
    console.log('✅ Connected to database\n');
    console.log('🔍 Verifying database state...\n');

    // Check triggers
    const triggers = await client.query(`
      SELECT trigger_name, event_object_table
      FROM information_schema.triggers
      WHERE trigger_name LIKE 'update_%_updated_at'
      ORDER BY event_object_table;
    `);
    console.log('📌 Triggers (auto-update timestamps):');
    if (triggers.rows.length === 0) {
      console.log('  ⚠️  No triggers found');
    } else {
      triggers.rows.forEach(r => console.log(`  ✓ ${r.trigger_name} on ${r.event_object_table}`));
    }

    // Check functions
    const functions = await client.query(`
      SELECT routine_name
      FROM information_schema.routines
      WHERE routine_schema = 'public'
      AND routine_type = 'FUNCTION'
      AND routine_name IN ('update_updated_at_column', 'generate_order_number', 'check_low_stock', 'get_available_stock')
      ORDER BY routine_name;
    `);
    console.log('\n🔧 Functions:');
    if (functions.rows.length === 0) {
      console.log('  ⚠️  No functions found');
    } else {
      functions.rows.forEach(r => console.log(`  ✓ ${r.routine_name}`));
    }

    // Check indexes
    const indexes = await client.query(`
      SELECT indexname
      FROM pg_indexes
      WHERE schemaname = 'public'
      AND indexname LIKE 'idx_%'
      ORDER BY indexname;
    `);
    console.log('\n📑 Indexes:');
    if (indexes.rows.length === 0) {
      console.log('  ⚠️  No indexes found');
    } else {
      indexes.rows.forEach(r => console.log(`  ✓ ${r.indexname}`));
    }

    // Check extensions
    const extensions = await client.query(`
      SELECT extname FROM pg_extension WHERE extname = 'pg_trgm';
    `);
    console.log('\n🧩 Extensions:');
    if (extensions.rows.length === 0) {
      console.log('  ⚠️  pg_trgm extension not found');
    } else {
      extensions.rows.forEach(r => console.log(`  ✓ ${r.extname}`));
    }

    // Check inventory count
    const inventory = await client.query(`
      SELECT COUNT(*) as count FROM inventory;
    `);
    console.log('\n📦 Inventory:');
    console.log(`  Total records: ${inventory.rows[0].count}`);

    // Check inventory by product
    const byProduct = await client.query(`
      SELECT "productSlug", COUNT(*) as variant_count, SUM("stockLevel") as total_stock
      FROM inventory
      GROUP BY "productSlug"
      ORDER BY "productSlug";
    `);
    if (byProduct.rows.length > 0) {
      console.log('\n  By product:');
      byProduct.rows.forEach(r => {
        console.log(`    ${r.productSlug}: ${r.variant_count} variants, ${r.total_stock} total stock`);
      });
    }

    // Check tables exist
    const tables = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);
    console.log('\n📊 Tables in database:');
    tables.rows.forEach(r => console.log(`  - ${r.table_name}`));

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await client.end();
  }
}

verify();
