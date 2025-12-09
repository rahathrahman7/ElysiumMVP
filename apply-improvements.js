const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf-8');
const connectionString = envContent.match(/DATABASE_URL="([^"]+)"/)[1];

async function applyImprovements() {
  const client = new Client({ connectionString });

  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    const results = {
      triggers: 0,
      functions: 0,
      indexes: 0,
      extensions: 0,
      comments: 0,
      errors: []
    };

    // 1. Create update_updated_at_column function
    console.log('1️⃣  Creating update_updated_at_column function...');
    try {
      await client.query(`
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW."updatedAt" = CURRENT_TIMESTAMP;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
      `);
      results.functions++;
      console.log('   ✓ update_updated_at_column function created\n');
    } catch (e) {
      console.log('   ⚠️ ', e.message.split('\n')[0]);
      results.errors.push(e.message);
    }

    // 2. Create triggers
    console.log('2️⃣  Creating triggers...');
    const triggers = [
      { name: 'update_users_updated_at', table: 'users' },
      { name: 'update_customer_profiles_updated_at', table: 'customer_profiles' },
      { name: 'update_addresses_updated_at', table: 'addresses' },
      { name: 'update_cart_items_updated_at', table: 'cart_items' },
      { name: 'update_orders_updated_at', table: 'orders' },
      { name: 'update_bespoke_leads_updated_at', table: 'bespoke_leads' }
    ];

    for (const trigger of triggers) {
      try {
        await client.query(`
          DROP TRIGGER IF EXISTS ${trigger.name} ON ${trigger.table};
          CREATE TRIGGER ${trigger.name}
              BEFORE UPDATE ON ${trigger.table}
              FOR EACH ROW
              EXECUTE FUNCTION update_updated_at_column();
        `);
        results.triggers++;
        console.log(`   ✓ ${trigger.name}`);
      } catch (e) {
        console.log(`   ⚠️  ${trigger.name}: ${e.message.split('\n')[0]}`);
        results.errors.push(e.message);
      }
    }

    // 3. Enable pg_trgm extension
    console.log('\n3️⃣  Enabling pg_trgm extension...');
    try {
      await client.query('CREATE EXTENSION IF NOT EXISTS pg_trgm;');
      results.extensions++;
      console.log('   ✓ pg_trgm extension enabled\n');
    } catch (e) {
      console.log('   ⚠️ ', e.message.split('\n')[0]);
      results.errors.push(e.message);
    }

    // 4. Create utility functions
    console.log('4️⃣  Creating utility functions...');

    // generate_order_number
    try {
      await client.query(`
        CREATE OR REPLACE FUNCTION generate_order_number()
        RETURNS TEXT AS $$
        DECLARE
            new_number TEXT;
            year_part TEXT;
            counter INT;
        BEGIN
            year_part := TO_CHAR(CURRENT_DATE, 'YYYY');

            SELECT COUNT(*) + 1 INTO counter
            FROM orders
            WHERE "orderNumber" LIKE year_part || '%';

            new_number := year_part || '-' || LPAD(counter::TEXT, 6, '0');

            RETURN new_number;
        END;
        $$ LANGUAGE plpgsql;
      `);
      results.functions++;
      console.log('   ✓ generate_order_number');
    } catch (e) {
      console.log('   ⚠️  generate_order_number:', e.message.split('\n')[0]);
      results.errors.push(e.message);
    }

    // check_low_stock
    try {
      await client.query(`
        CREATE OR REPLACE FUNCTION check_low_stock()
        RETURNS TABLE (
            product_slug TEXT,
            variant_key TEXT,
            current_stock INT,
            threshold INT
        ) AS $$
        BEGIN
            RETURN QUERY
            SELECT
                "productSlug",
                "variantKey",
                "stockLevel",
                "lowStockThreshold"
            FROM inventory
            WHERE "stockLevel" <= "lowStockThreshold"
            ORDER BY "stockLevel" ASC;
        END;
        $$ LANGUAGE plpgsql;
      `);
      results.functions++;
      console.log('   ✓ check_low_stock');
    } catch (e) {
      console.log('   ⚠️  check_low_stock:', e.message.split('\n')[0]);
      results.errors.push(e.message);
    }

    // get_available_stock
    try {
      await client.query(`
        CREATE OR REPLACE FUNCTION get_available_stock(
            p_product_slug TEXT,
            p_variant_key TEXT
        )
        RETURNS INT AS $$
        DECLARE
            available INT;
        BEGIN
            SELECT ("stockLevel" - "reservedStock") INTO available
            FROM inventory
            WHERE "productSlug" = p_product_slug
            AND "variantKey" = p_variant_key;

            RETURN COALESCE(available, 0);
        END;
        $$ LANGUAGE plpgsql;
      `);
      results.functions++;
      console.log('   ✓ get_available_stock\n');
    } catch (e) {
      console.log('   ⚠️  get_available_stock:', e.message.split('\n')[0]);
      results.errors.push(e.message);
    }

    // 5. Create indexes
    console.log('5️⃣  Creating indexes...');
    const indexes = [
      { name: 'idx_orders_customer_email', sql: 'CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders("customerEmail");' },
      { name: 'idx_orders_created_at', sql: 'CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders("createdAt" DESC);' },
      { name: 'idx_cart_items_created_at', sql: 'CREATE INDEX IF NOT EXISTS idx_cart_items_created_at ON cart_items("createdAt");' },
      { name: 'idx_wishlist_product_slug', sql: 'CREATE INDEX IF NOT EXISTS idx_wishlist_product_slug ON wishlist_items("productSlug");' },
      { name: 'idx_product_views_slug_date', sql: 'CREATE INDEX IF NOT EXISTS idx_product_views_slug_date ON product_views("productSlug", "viewedAt" DESC);' },
      { name: 'idx_bespoke_leads_status', sql: 'CREATE INDEX IF NOT EXISTS idx_bespoke_leads_status ON bespoke_leads(status);' },
      { name: 'idx_bespoke_leads_created_at', sql: 'CREATE INDEX IF NOT EXISTS idx_bespoke_leads_created_at ON bespoke_leads("createdAt" DESC);' }
    ];

    for (const index of indexes) {
      try {
        await client.query(index.sql);
        results.indexes++;
        console.log(`   ✓ ${index.name}`);
      } catch (e) {
        console.log(`   ⚠️  ${index.name}: ${e.message.split('\n')[0]}`);
        results.errors.push(e.message);
      }
    }

    // 6. Add table comments
    console.log('\n6️⃣  Adding table comments...');
    const comments = [
      { table: 'users', comment: 'User authentication and profile data' },
      { table: 'accounts', comment: 'OAuth provider accounts linked to users' },
      { table: 'sessions', comment: 'Active user sessions' },
      { table: 'customer_profiles', comment: 'Extended customer profile information' },
      { table: 'addresses', comment: 'Customer billing and shipping addresses' },
      { table: 'cart_items', comment: 'Shopping cart items for logged-in users' },
      { table: 'orders', comment: 'Customer orders' },
      { table: 'order_items', comment: 'Line items within orders' },
      { table: 'inventory', comment: 'Product inventory levels by variant' },
      { table: 'wishlist_items', comment: 'Customer wishlist/favorites' },
      { table: 'product_views', comment: 'Product view analytics' },
      { table: 'bespoke_leads', comment: 'Bespoke jewelry inquiry leads' }
    ];

    for (const comment of comments) {
      try {
        await client.query(`COMMENT ON TABLE ${comment.table} IS '${comment.comment}';`);
        results.comments++;
      } catch (e) {
        // Silently skip missing tables
      }
    }
    console.log(`   ✓ Added ${results.comments} table comments\n`);

    // Summary
    console.log('='.repeat(60));
    console.log('📊 Database Improvements Summary:');
    console.log('='.repeat(60));
    console.log(`✅ Triggers created: ${results.triggers}/6`);
    console.log(`✅ Functions created: ${results.functions}/4`);
    console.log(`✅ Indexes created: ${results.indexes}/7`);
    console.log(`✅ Extensions enabled: ${results.extensions}/1`);
    console.log(`✅ Table comments added: ${results.comments}/12`);

    if (results.errors.length > 0) {
      console.log(`\n⚠️  ${results.errors.length} errors occurred (see above)`);
    }

    await client.end();
    return results;

  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    throw error;
  }
}

applyImprovements().then(() => {
  console.log('\n✅ Database improvements completed!');
  process.exit(0);
}).catch(e => {
  console.error('\n❌ Failed:', e.message);
  process.exit(1);
});
