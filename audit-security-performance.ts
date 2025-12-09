import { Pool } from 'pg';

const DATABASE_URL = "postgresql://postgres.yrtpqpsuqioecjjwbmcy:Prestige998800!@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";

const pool = new Pool({
  connectionString: DATABASE_URL,
});

async function auditSecurityAndPerformance() {
  try {
    console.log('='.repeat(80));
    console.log('SECURITY & PERFORMANCE AUDIT');
    console.log('='.repeat(80));
    console.log('');

    // Check for sensitive columns that should be encrypted
    console.log('1. SENSITIVE DATA COLUMNS');
    console.log('-'.repeat(80));

    const sensitiveColumns = [
      { table: 'users', column: 'password', concern: 'Should be hashed (bcrypt/argon2)' },
      { table: 'users', column: 'email', concern: 'Contains PII - needs protection' },
      { table: 'accounts', column: 'access_token', concern: 'OAuth tokens - highly sensitive' },
      { table: 'accounts', column: 'refresh_token', concern: 'OAuth tokens - highly sensitive' },
      { table: 'customer_profiles', column: 'phone', concern: 'PII data' },
      { table: 'customer_profiles', column: 'dateOfBirth', concern: 'PII data' },
      { table: 'addresses', column: 'line1', concern: 'PII - address data' },
      { table: 'bespoke_leads', column: 'email', concern: 'PII data' },
      { table: 'bespoke_leads', column: 'phone', concern: 'PII data' },
    ];

    console.log('Columns containing sensitive/PII data:');
    sensitiveColumns.forEach(col => {
      console.log(`  ⚠️  ${col.table}.${col.column}`);
      console.log(`     ${col.concern}`);
    });
    console.log('');

    // Check database extensions
    console.log('\n2. DATABASE EXTENSIONS');
    console.log('-'.repeat(80));
    const extensionsResult = await pool.query(`
      SELECT extname, extversion
      FROM pg_extension
      WHERE extname NOT IN ('plpgsql')
      ORDER BY extname;
    `);

    console.log('Currently installed extensions:');
    extensionsResult.rows.forEach((ext: { extname: string; extversion: string }) => {
      console.log(`  - ${ext.extname} (v${ext.extversion})`);
    });

    console.log('\n\nRecommended extensions for e-commerce:');
    const recommendedExtensions = [
      { name: 'uuid-ossp', reason: 'Better UUID generation' },
      { name: 'pg_trgm', reason: 'Full-text search with trigrams for product search' },
      { name: 'pgcrypto', reason: 'Cryptographic functions for sensitive data' },
    ];

    for (const ext of recommendedExtensions) {
      const hasExtension = extensionsResult.rows.some((row: { extname: string }) =>
        row.extname === ext.name
      );
      const status = hasExtension ? '✅' : '❌';
      console.log(`  ${status} ${ext.name} - ${ext.reason}`);
    }
    console.log('');

    // Check for database functions/triggers
    console.log('\n3. FUNCTIONS & TRIGGERS');
    console.log('-'.repeat(80));

    const functionsResult = await pool.query(`
      SELECT
        n.nspname as schema,
        p.proname as function_name,
        pg_get_function_identity_arguments(p.oid) as arguments
      FROM pg_proc p
      JOIN pg_namespace n ON p.pronamespace = n.oid
      WHERE n.nspname = 'public'
      ORDER BY p.proname;
    `);

    console.log(`Total custom functions: ${functionsResult.rows.length}`);
    if (functionsResult.rows.length > 0) {
      functionsResult.rows.forEach((fn: any) => {
        console.log(`  - ${fn.function_name}(${fn.arguments})`);
      });
    } else {
      console.log('  No custom functions found');
    }

    const triggersResult = await pool.query(`
      SELECT
        tgname as trigger_name,
        tgrelid::regclass as table_name,
        tgenabled as enabled
      FROM pg_trigger
      WHERE tgisinternal = false
      ORDER BY tgname;
    `);

    console.log(`\nTotal triggers: ${triggersResult.rows.length}`);
    if (triggersResult.rows.length > 0) {
      triggersResult.rows.forEach((trig: any) => {
        const status = trig.enabled === 'O' ? '✅ Enabled' : '❌ Disabled';
        console.log(`  - ${trig.trigger_name} on ${trig.table_name} (${status})`);
      });
    } else {
      console.log('  No triggers found');
    }
    console.log('');

    // Check for table bloat (empty tables won't show this well)
    console.log('\n4. TABLE STATISTICS');
    console.log('-'.repeat(80));

    const statsResult = await pool.query(`
      SELECT
        schemaname,
        tablename,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size,
        pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size,
        pg_size_pretty(pg_indexes_size(schemaname||'.'||tablename)) as indexes_size
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
    `);

    console.log('Table sizes:');
    statsResult.rows.forEach((stat: any) => {
      console.log(`  ${stat.tablename}:`);
      console.log(`    Total: ${stat.total_size}, Table: ${stat.table_size}, Indexes: ${stat.indexes_size}`);
    });
    console.log('');

    // Check for missing updated_at triggers
    console.log('\n5. TIMESTAMP MANAGEMENT');
    console.log('-'.repeat(80));

    const tablesWithUpdatedAt = await pool.query(`
      SELECT table_name, column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND column_name = 'updatedAt'
      ORDER BY table_name;
    `);

    console.log('Tables with updatedAt column:');
    tablesWithUpdatedAt.rows.forEach((row: { table_name: string }) => {
      console.log(`  - ${row.table_name}`);
    });

    console.log('\n⚠️  Recommendation: Create a trigger to automatically update "updatedAt" timestamps');
    console.log('   This ensures data consistency and reduces application-level complexity');
    console.log('');

    // Check for proper cascade settings
    console.log('\n6. CASCADE ANALYSIS');
    console.log('-'.repeat(80));

    const cascadeResult = await pool.query(`
      SELECT
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        rc.delete_rule,
        rc.update_rule
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      JOIN information_schema.referential_constraints AS rc
        ON rc.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
      ORDER BY tc.table_name;
    `);

    console.log('Foreign key cascade rules:');
    const cascadeByTable: { [key: string]: any[] } = {};
    cascadeResult.rows.forEach((fk: any) => {
      if (!cascadeByTable[fk.table_name]) {
        cascadeByTable[fk.table_name] = [];
      }
      cascadeByTable[fk.table_name].push(fk);
    });

    for (const [tableName, fks] of Object.entries(cascadeByTable)) {
      console.log(`\n  ${tableName}:`);
      fks.forEach((fk: any) => {
        console.log(`    ${fk.column_name} → ${fk.foreign_table_name}`);
        console.log(`      ON DELETE ${fk.delete_rule}, ON UPDATE ${fk.update_rule}`);
      });
    }
    console.log('');

    // Check for connection pooling settings
    console.log('\n7. DATABASE CONFIGURATION');
    console.log('-'.repeat(80));

    const configResult = await pool.query(`
      SELECT name, setting, unit, short_desc
      FROM pg_settings
      WHERE name IN (
        'max_connections',
        'shared_buffers',
        'work_mem',
        'maintenance_work_mem',
        'effective_cache_size',
        'default_statistics_target'
      )
      ORDER BY name;
    `);

    console.log('Important PostgreSQL settings:');
    configResult.rows.forEach((setting: any) => {
      const value = setting.unit ? `${setting.setting} ${setting.unit}` : setting.setting;
      console.log(`  ${setting.name}: ${value}`);
      console.log(`    ${setting.short_desc}`);
    });
    console.log('');

    // Recommended seed data
    console.log('\n8. RECOMMENDED SEED DATA');
    console.log('-'.repeat(80));
    console.log(`
Products (from Sanity CMS):
  ✅ Already managed in Sanity - no database seeding needed
  ✅ Product slugs: nova, vow-veil (referenced in frontend)

Inventory:
  ⚠️  Should seed initial inventory for all product variants
  ⚠️  Each combination of (productSlug + variantKey) needs an entry
  ⚠️  Example: nova-18k-gold-6, nova-18k-gold-7, etc.

Order Statuses:
  ✅ Already defined as enum in database

Address Types:
  ✅ Already defined as enum in database

Test Users:
  ⚠️  For development: Create test customer accounts
  ⚠️  For admin panel: Consider admin/staff user flags

Sample Orders:
  ⚠️  For testing: Create sample orders in various states
  ⚠️  Helps test order management workflow
`);

  } catch (error) {
    console.error('Error during security audit:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

auditSecurityAndPerformance().catch(console.error);
