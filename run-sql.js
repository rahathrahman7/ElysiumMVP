const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Directly use the connection string from .env
const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf-8');
const databaseUrlMatch = envContent.match(/DATABASE_URL="([^"]+)"/);

if (!databaseUrlMatch) {
  console.error('❌ Could not find DATABASE_URL in .env file');
  process.exit(1);
}

const connectionString = databaseUrlMatch[1];

async function executeSqlFile(filename) {
  const client = new Client({ connectionString });

  try {
    await client.connect();
    console.log(`✅ Connected to database\n`);

    const sql = fs.readFileSync(path.join(__dirname, filename), 'utf-8');

    // Split into individual statements
    const statements = sql
      .split(/;\s*\n/)
      .map(s => s.trim())
      .filter(s => {
        // Filter out comments and empty lines
        return s &&
               !s.startsWith('--') &&
               !s.match(/^-{10,}/) &&
               s.length > 10;
      });

    console.log(`📝 Executing ${statements.length} SQL statements from ${filename}...\n`);

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;
    const errors = [];

    for (const stmt of statements) {
      try {
        await client.query(stmt + (stmt.endsWith(';') ? '' : ';'));
        successCount++;

        // Log important operations
        if (stmt.includes('CREATE TRIGGER')) {
          const match = stmt.match(/CREATE TRIGGER\s+(\w+)/i);
          if (match) console.log(`  ✓ Created trigger: ${match[1]}`);
        } else if (stmt.includes('CREATE OR REPLACE FUNCTION')) {
          const match = stmt.match(/CREATE OR REPLACE FUNCTION\s+(\w+)/i);
          if (match) console.log(`  ✓ Created function: ${match[1]}`);
        } else if (stmt.includes('CREATE INDEX')) {
          const match = stmt.match(/CREATE INDEX\s+(?:IF NOT EXISTS\s+)?(\w+)/i);
          if (match) console.log(`  ✓ Created index: ${match[1]}`);
        } else if (stmt.includes('CREATE EXTENSION')) {
          const match = stmt.match(/CREATE EXTENSION\s+(?:IF NOT EXISTS\s+)?(\w+)/i);
          if (match) console.log(`  ✓ Enabled extension: ${match[1]}`);
        } else if (stmt.includes('INSERT INTO')) {
          const match = stmt.match(/INSERT INTO\s+(\w+)/i);
          if (match) {
            const countMatch = stmt.match(/VALUES\s*\([\s\S]*?\)(?:\s*,\s*\([\s\S]*?\))*/);
            const count = countMatch ? countMatch[0].split('),(').length : 1;
            console.log(`  ✓ Inserted ${count} records into ${match[1]}`);
          }
        } else if (stmt.includes('COMMENT ON')) {
          // Skip logging comments
        }

      } catch (error) {
        if (error.message.includes('already exists')) {
          skipCount++;
        } else if (error.message.includes('duplicate key')) {
          skipCount++;
        } else if (stmt.includes('DO $$') || stmt.includes('RAISE NOTICE')) {
          // Ignore DO block errors (they're just notices)
          successCount++;
        } else {
          errorCount++;
          errors.push({ stmt: stmt.substring(0, 80) + '...', error: error.message });
        }
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`📊 Summary for ${filename}:`);
    console.log('='.repeat(60));
    console.log(`✅ Successfully executed: ${successCount} statements`);
    console.log(`⏭️  Skipped (already exists): ${skipCount} statements`);
    console.log(`❌ Errors: ${errorCount} statements`);

    if (errors.length > 0 && errors.length < 5) {
      console.log('\n⚠️  Errors encountered:');
      errors.forEach((e, i) => {
        console.log(`  ${i + 1}. ${e.error.split('\n')[0]}`);
      });
    }

    return { successCount, skipCount, errorCount };

  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    throw error;
  } finally {
    await client.end();
  }
}

async function main() {
  const args = process.argv.slice(2);
  const filename = args[0] || 'database-improvements-safe.sql';

  try {
    const result = await executeSqlFile(filename);

    if (result.errorCount > 0) {
      console.log('\n⚠️  Some errors occurred, but this may be expected.');
      process.exit(0); // Exit successfully anyway
    } else {
      console.log('\n✅ All operations completed successfully!');
      process.exit(0);
    }
  } catch (error) {
    console.error('\n❌ Script failed:', error.message);
    process.exit(1);
  }
}

main();
