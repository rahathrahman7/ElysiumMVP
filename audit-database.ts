import { Pool } from 'pg';

const DATABASE_URL = "postgresql://postgres.yrtpqpsuqioecjjwbmcy:Prestige998800!@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";

const pool = new Pool({
  connectionString: DATABASE_URL,
});

interface TableInfo {
  tableName: string;
  rowCount: number;
  columns: ColumnInfo[];
}

interface ColumnInfo {
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string | null;
}

interface IndexInfo {
  tablename: string;
  indexname: string;
  indexdef: string;
}

interface ForeignKeyInfo {
  constraint_name: string;
  table_name: string;
  column_name: string;
  foreign_table_name: string;
  foreign_column_name: string;
}

interface RLSPolicyInfo {
  tablename: string;
  policyname: string;
  permissive: string;
  roles: string[];
  cmd: string;
  qual: string | null;
  with_check: string | null;
}

async function auditDatabase() {
  try {
    console.log('='.repeat(80));
    console.log('ELYSIUM MVP - DATABASE AUDIT REPORT');
    console.log('='.repeat(80));
    console.log('');

    // 1. List all tables
    console.log('1. DATABASE TABLES');
    console.log('-'.repeat(80));
    const tablesResult = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    const tables = tablesResult.rows.map(r => r.table_name);
    console.log(`Total tables found: ${tables.length}`);
    console.log('Tables:', tables.join(', '));
    console.log('');

    // Expected tables from Prisma schema
    const expectedTables = [
      'users',
      'accounts',
      'sessions',
      'verification_tokens',
      'customer_profiles',
      'addresses',
      'cart_items',
      'orders',
      'order_items',
      'inventory',
      'wishlist_items',
      'product_views',
      'bespoke_leads'
    ];

    const missingTables = expectedTables.filter(t => !tables.includes(t));
    const extraTables = tables.filter(t => !expectedTables.includes(t));

    if (missingTables.length > 0) {
      console.log('⚠️  MISSING TABLES (defined in Prisma schema):');
      missingTables.forEach(t => console.log(`   - ${t}`));
      console.log('');
    }

    if (extraTables.length > 0) {
      console.log('ℹ️  EXTRA TABLES (not in Prisma schema):');
      extraTables.forEach(t => console.log(`   - ${t}`));
      console.log('');
    }

    // 2. Check each table's structure and row counts
    console.log('2. TABLE STRUCTURES AND ROW COUNTS');
    console.log('-'.repeat(80));

    for (const tableName of tables) {
      const countResult = await pool.query(`SELECT COUNT(*) as count FROM "${tableName}"`);
      const rowCount = parseInt(countResult.rows[0].count);

      const columnsResult = await pool.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = $1
        ORDER BY ordinal_position;
      `, [tableName]);

      console.log(`\nTable: ${tableName}`);
      console.log(`  Rows: ${rowCount}`);
      console.log(`  Columns (${columnsResult.rows.length}):`);
      columnsResult.rows.forEach((col: ColumnInfo) => {
        const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
        const defaultVal = col.column_default ? ` DEFAULT ${col.column_default}` : '';
        console.log(`    - ${col.column_name}: ${col.data_type} ${nullable}${defaultVal}`);
      });
    }
    console.log('');

    // 3. Check for indexes
    console.log('\n3. INDEXES');
    console.log('-'.repeat(80));
    const indexesResult = await pool.query(`
      SELECT tablename, indexname, indexdef
      FROM pg_indexes
      WHERE schemaname = 'public'
      ORDER BY tablename, indexname;
    `);

    const indexesByTable: { [key: string]: IndexInfo[] } = {};
    indexesResult.rows.forEach((idx: IndexInfo) => {
      if (!indexesByTable[idx.tablename]) {
        indexesByTable[idx.tablename] = [];
      }
      indexesByTable[idx.tablename].push(idx);
    });

    for (const [tableName, indexes] of Object.entries(indexesByTable)) {
      console.log(`\n${tableName}:`);
      indexes.forEach(idx => {
        console.log(`  - ${idx.indexname}`);
        console.log(`    ${idx.indexdef}`);
      });
    }

    // Check for missing indexes based on Prisma schema
    console.log('\n\n⚠️  RECOMMENDED INDEXES (from Prisma schema):');
    const recommendedIndexes = [
      { table: 'orders', column: 'userId', reason: '@index in schema' },
      { table: 'orders', column: 'orderNumber', reason: '@index in schema' },
      { table: 'orders', column: 'status', reason: '@index in schema' },
      { table: 'inventory', column: 'productSlug', reason: '@index in schema' },
      { table: 'product_views', column: 'productSlug', reason: '@index in schema' },
      { table: 'product_views', column: 'sessionId', reason: '@index in schema' },
    ];

    for (const rec of recommendedIndexes) {
      if (tables.includes(rec.table)) {
        const hasIndex = indexesByTable[rec.table]?.some(idx =>
          idx.indexdef.toLowerCase().includes(rec.column.toLowerCase())
        );
        if (!hasIndex) {
          console.log(`  ⚠️  ${rec.table}.${rec.column} - ${rec.reason}`);
        }
      }
    }
    console.log('');

    // 4. Check Row Level Security (RLS) policies
    console.log('\n4. ROW LEVEL SECURITY (RLS) POLICIES');
    console.log('-'.repeat(80));

    const rlsStatusResult = await pool.query(`
      SELECT tablename, rowsecurity
      FROM pg_tables
      WHERE schemaname = 'public';
    `);

    console.log('RLS Status by Table:');
    rlsStatusResult.rows.forEach((row: { tablename: string; rowsecurity: boolean }) => {
      const status = row.rowsecurity ? '✅ ENABLED' : '❌ DISABLED';
      console.log(`  ${row.tablename}: ${status}`);
    });

    const policiesResult = await pool.query(`
      SELECT
        schemaname,
        tablename,
        policyname,
        permissive,
        roles,
        cmd,
        qual,
        with_check
      FROM pg_policies
      WHERE schemaname = 'public';
    `);

    console.log(`\nTotal RLS Policies: ${policiesResult.rows.length}`);
    if (policiesResult.rows.length > 0) {
      console.log('\nPolicies:');
      policiesResult.rows.forEach((policy: RLSPolicyInfo) => {
        console.log(`\n  ${policy.tablename}.${policy.policyname}`);
        console.log(`    Command: ${policy.cmd}`);
        console.log(`    Roles: ${policy.roles.join(', ')}`);
        console.log(`    Permissive: ${policy.permissive}`);
        if (policy.qual) console.log(`    Using: ${policy.qual}`);
        if (policy.with_check) console.log(`    With Check: ${policy.with_check}`);
      });
    } else {
      console.log('\n⚠️  NO RLS POLICIES FOUND - Database is not secured!');
    }
    console.log('');

    // 5. Check foreign key relationships
    console.log('\n5. FOREIGN KEY RELATIONSHIPS');
    console.log('-'.repeat(80));
    const fkResult = await pool.query(`
      SELECT
        tc.constraint_name,
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name,
        rc.delete_rule
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      JOIN information_schema.referential_constraints AS rc
        ON rc.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
      ORDER BY tc.table_name, tc.constraint_name;
    `);

    console.log(`Total Foreign Keys: ${fkResult.rows.length}`);
    if (fkResult.rows.length > 0) {
      const fksByTable: { [key: string]: any[] } = {};
      fkResult.rows.forEach((fk: any) => {
        if (!fksByTable[fk.table_name]) {
          fksByTable[fk.table_name] = [];
        }
        fksByTable[fk.table_name].push(fk);
      });

      for (const [tableName, fks] of Object.entries(fksByTable)) {
        console.log(`\n${tableName}:`);
        fks.forEach(fk => {
          console.log(`  - ${fk.column_name} → ${fk.foreign_table_name}(${fk.foreign_column_name})`);
          console.log(`    ON DELETE ${fk.delete_rule}`);
        });
      }
    }
    console.log('');

    // 6. Check constraints
    console.log('\n6. CONSTRAINTS');
    console.log('-'.repeat(80));
    const constraintsResult = await pool.query(`
      SELECT
        tc.table_name,
        tc.constraint_name,
        tc.constraint_type,
        cc.check_clause
      FROM information_schema.table_constraints AS tc
      LEFT JOIN information_schema.check_constraints AS cc
        ON tc.constraint_name = cc.constraint_name
      WHERE tc.table_schema = 'public'
        AND tc.constraint_type IN ('UNIQUE', 'CHECK')
      ORDER BY tc.table_name, tc.constraint_type;
    `);

    const constraintsByTable: { [key: string]: any[] } = {};
    constraintsResult.rows.forEach((constraint: any) => {
      if (!constraintsByTable[constraint.table_name]) {
        constraintsByTable[constraint.table_name] = [];
      }
      constraintsByTable[constraint.table_name].push(constraint);
    });

    for (const [tableName, constraints] of Object.entries(constraintsByTable)) {
      console.log(`\n${tableName}:`);
      constraints.forEach(c => {
        if (c.constraint_type === 'CHECK') {
          console.log(`  - CHECK: ${c.check_clause}`);
        } else {
          console.log(`  - ${c.constraint_type}: ${c.constraint_name}`);
        }
      });
    }
    console.log('');

    // 7. Enums check
    console.log('\n7. ENUM TYPES');
    console.log('-'.repeat(80));
    const enumsResult = await pool.query(`
      SELECT
        t.typname AS enum_name,
        e.enumlabel AS enum_value
      FROM pg_type t
      JOIN pg_enum e ON t.oid = e.enumtypid
      JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
      WHERE n.nspname = 'public'
      ORDER BY t.typname, e.enumsortorder;
    `);

    const enumsByType: { [key: string]: string[] } = {};
    enumsResult.rows.forEach((row: { enum_name: string; enum_value: string }) => {
      if (!enumsByType[row.enum_name]) {
        enumsByType[row.enum_name] = [];
      }
      enumsByType[row.enum_name].push(row.enum_value);
    });

    console.log('Enums found:');
    for (const [enumName, values] of Object.entries(enumsByType)) {
      console.log(`\n${enumName}:`);
      values.forEach(v => console.log(`  - ${v}`));
    }

    const expectedEnums = {
      'AddressType': ['BILLING', 'SHIPPING'],
      'OrderStatus': ['PENDING', 'PROCESSING', 'PAYMENT_FAILED', 'PAID', 'FULFILLED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']
    };

    console.log('\n\nExpected Enums from Prisma Schema:');
    for (const [enumName, expectedValues] of Object.entries(expectedEnums)) {
      const actualValues = enumsByType[enumName];
      if (!actualValues) {
        console.log(`  ⚠️  MISSING: ${enumName}`);
      } else {
        const missing = expectedValues.filter(v => !actualValues.includes(v));
        const extra = actualValues.filter(v => !expectedValues.includes(v));
        if (missing.length > 0 || extra.length > 0) {
          console.log(`  ⚠️  ${enumName} has differences:`);
          if (missing.length > 0) console.log(`    Missing: ${missing.join(', ')}`);
          if (extra.length > 0) console.log(`    Extra: ${extra.join(', ')}`);
        } else {
          console.log(`  ✅ ${enumName}`);
        }
      }
    }
    console.log('');

    // Summary
    console.log('\n' + '='.repeat(80));
    console.log('SUMMARY');
    console.log('='.repeat(80));
    console.log(`Total Tables: ${tables.length}`);
    console.log(`Missing Tables: ${missingTables.length}`);
    console.log(`Foreign Keys: ${fkResult.rows.length}`);
    console.log(`RLS Policies: ${policiesResult.rows.length}`);
    console.log(`Indexes: ${indexesResult.rows.length}`);
    console.log('');

  } catch (error) {
    console.error('Error during audit:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

auditDatabase().catch(console.error);
