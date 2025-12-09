#!/usr/bin/env tsx
import { readFileSync } from 'fs';
import { Pool } from 'pg';

const envContent = readFileSync('.env', 'utf-8');
const dbUrlMatch = envContent.match(/DATABASE_URL="([^"]+)"/);
const DATABASE_URL = dbUrlMatch ? dbUrlMatch[1] : '';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  console.log('🌱 Seeding complete inventory for all products...\n');
  
  try {
    const sql = readFileSync('seed-all-inventory.sql', 'utf-8');
    await pool.query(sql);
    
    console.log('\n✅ Complete inventory seeded successfully!\n');
    
    // Show results
    const result = await pool.query(`
      SELECT "productSlug", COUNT(*) as variants, SUM("stockLevel") as stock
      FROM inventory
      GROUP BY "productSlug"
      ORDER BY "productSlug"
    `);
    
    console.log('📦 Inventory by Product:\n');
    console.table(result.rows);
    
    const total = await pool.query('SELECT COUNT(*) as total FROM inventory');
    console.log(`\n🎯 Total: ${total.rows[0].total} variants across all products\n`);
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

main();
