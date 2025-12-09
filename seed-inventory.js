const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf-8');
const connectionString = envContent.match(/DATABASE_URL="([^"]+)"/)[1];

async function seedInventory() {
  const client = new Client({ connectionString });

  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Define product variants
    const products = [
      { slug: 'nova', name: 'Nova' },
      { slug: 'vow-veil', name: 'Vow & Veil' }
    ];

    const metals = [
      { key: '18k-yellow-gold', name: '18K Yellow Gold', stock: [5, 5, 8, 8, 10, 10, 12, 10, 8, 5, 5, 3, 3] },
      { key: '18k-white-gold', name: '18K White Gold', stock: [5, 5, 8, 8, 10, 10, 12, 10, 8, 5, 5, 3, 3] },
      { key: '18k-rose-gold', name: '18K Rose Gold', stock: [5, 5, 8, 8, 10, 10, 12, 10, 8, 5, 5, 3, 3] },
      { key: 'platinum', name: 'Platinum', stock: [3, 3, 5, 5, 8, 8, 10, 8, 5, 3, 3, 2, 2] }
    ];

    const sizes = ['4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10'];

    let totalInserted = 0;
    let totalSkipped = 0;

    console.log('📦 Seeding inventory data...\n');

    for (const product of products) {
      console.log(`\n${product.name} (${product.slug}):`);

      for (const metal of metals) {
        let inserted = 0;
        let skipped = 0;

        for (let i = 0; i < sizes.length; i++) {
          const size = sizes[i];
          const variantKey = `${metal.key}-${size}`;
          const stockLevel = product.slug === 'vow-veil'
            ? Math.max(1, metal.stock[i] - 1) // Vow & Veil has slightly less stock
            : metal.stock[i];
          const lowStockThreshold = metal.key === 'platinum' ? 2 : 3;

          try {
            const result = await client.query(`
              INSERT INTO inventory ("id", "productSlug", "variantKey", "stockLevel", "reservedStock", "lowStockThreshold", "lastUpdated")
              VALUES (gen_random_uuid(), $1, $2, $3, 0, $4, CURRENT_TIMESTAMP)
              ON CONFLICT ("productSlug", "variantKey") DO NOTHING
              RETURNING id;
            `, [product.slug, variantKey, stockLevel, lowStockThreshold]);

            if (result.rowCount > 0) {
              inserted++;
              totalInserted++;
            } else {
              skipped++;
              totalSkipped++;
            }
          } catch (error) {
            console.error(`  ⚠️  Error inserting ${variantKey}:`, error.message);
          }
        }

        const status = inserted > 0 ? '✓' : '⏭️';
        console.log(`  ${status} ${metal.name}: ${inserted} inserted, ${skipped} skipped`);
      }
    }

    // Verify counts
    console.log('\n' + '='.repeat(60));
    console.log('📊 Inventory Seeding Summary:');
    console.log('='.repeat(60));

    const totalCount = await client.query('SELECT COUNT(*) as count FROM inventory;');
    console.log(`Total inventory records: ${totalCount.rows[0].count}`);

    const byProduct = await client.query(`
      SELECT "productSlug", COUNT(*) as variant_count, SUM("stockLevel") as total_stock
      FROM inventory
      GROUP BY "productSlug"
      ORDER BY "productSlug";
    `);

    console.log('\nBy product:');
    byProduct.rows.forEach(r => {
      console.log(`  ${r.productSlug}: ${r.variant_count} variants, ${r.total_stock} total stock`);
    });

    console.log(`\n✅ Inserted: ${totalInserted} new records`);
    console.log(`⏭️  Skipped: ${totalSkipped} existing records`);

    // Check low stock items
    const lowStock = await client.query('SELECT * FROM check_low_stock();');
    if (lowStock.rows.length > 0) {
      console.log(`\n⚠️  ${lowStock.rows.length} items are at or below low stock threshold`);
    }

    await client.end();

  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    throw error;
  }
}

seedInventory().then(() => {
  console.log('\n✅ Inventory seeding completed!');
  process.exit(0);
}).catch(e => {
  console.error('\n❌ Failed:', e.message);
  process.exit(1);
});
