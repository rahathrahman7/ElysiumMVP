# Database Quick Reference Guide

## Quick Status Check

Run these commands to check database status:

```bash
# Full audit
npx tsx audit-database.ts

# Security & performance audit
npx tsx audit-security-performance.ts

# Check if RLS is enabled
psql $DATABASE_URL -c "SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';"

# Check inventory count
psql $DATABASE_URL -c "SELECT productSlug, COUNT(*) as variants, SUM(stockLevel) as stock FROM inventory GROUP BY productSlug;"

# Check low stock items
psql $DATABASE_URL -c "SELECT * FROM check_low_stock();"
```

## Apply Improvements

```bash
# Make script executable (first time only)
chmod +x apply-improvements.sh

# Apply all basic improvements
./apply-improvements.sh all

# Or apply specific improvements
./apply-improvements.sh triggers     # Install updatedAt triggers
./apply-improvements.sh functions    # Install utility functions
./apply-improvements.sh indexes      # Add performance indexes
./apply-improvements.sh inventory    # Seed inventory data

# Show help
./apply-improvements.sh help
```

## Common Database Operations

### Connect to Database

```bash
# Direct connection
psql $DATABASE_URL

# Or with connection string
psql "postgresql://postgres.yrtpqpsuqioecjjwbmcy:Prestige998800!@aws-1-eu-west-1.pooler.supabase.com:5432/postgres"
```

### Prisma Commands

```bash
# Generate Prisma client
npx prisma generate

# Push schema changes (without migrations)
npx prisma db push

# Create and apply migration
npx prisma migrate dev --name migration_name

# View database in Prisma Studio
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Useful Queries

```sql
-- Check all table row counts
SELECT
  schemaname,
  tablename,
  (SELECT COUNT(*) FROM quote_ident(schemaname)||'.'||quote_ident(tablename)) as row_count
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Check database size
SELECT
  pg_size_pretty(pg_database_size(current_database())) as total_size;

-- Check table sizes
SELECT
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- List all indexes
SELECT
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Check foreign keys
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name,
  rc.delete_rule
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

-- Check RLS policies
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

## Inventory Management

### Check Stock Levels

```sql
-- All inventory
SELECT * FROM inventory ORDER BY "productSlug", "variantKey";

-- Low stock items
SELECT * FROM check_low_stock();

-- Available stock for specific variant
SELECT get_available_stock('nova', '18k-yellow-gold-7');

-- Stock by product
SELECT
  "productSlug",
  COUNT(*) as variant_count,
  SUM("stockLevel") as total_stock,
  SUM("reservedStock") as total_reserved,
  SUM("stockLevel" - "reservedStock") as available_stock
FROM inventory
GROUP BY "productSlug";
```

### Update Stock

```sql
-- Add stock
UPDATE inventory
SET "stockLevel" = "stockLevel" + 5,
    "lastUpdated" = CURRENT_TIMESTAMP
WHERE "productSlug" = 'nova'
  AND "variantKey" = '18k-yellow-gold-7';

-- Reserve stock (during checkout)
UPDATE inventory
SET "reservedStock" = "reservedStock" + 1,
    "lastUpdated" = CURRENT_TIMESTAMP
WHERE "productSlug" = 'nova'
  AND "variantKey" = '18k-yellow-gold-7';

-- Fulfill order (reduce stock)
UPDATE inventory
SET "stockLevel" = "stockLevel" - 1,
    "reservedStock" = "reservedStock" - 1,
    "lastUpdated" = CURRENT_TIMESTAMP
WHERE "productSlug" = 'nova'
  AND "variantKey" = '18k-yellow-gold-7';
```

## Order Management

### Common Order Queries

```sql
-- Recent orders
SELECT
  "orderNumber",
  status,
  "totalAmountGbp",
  "customerEmail",
  "createdAt"
FROM orders
ORDER BY "createdAt" DESC
LIMIT 20;

-- Orders by status
SELECT
  status,
  COUNT(*) as order_count,
  SUM("totalAmountGbp") as total_revenue
FROM orders
GROUP BY status;

-- Order details with items
SELECT
  o."orderNumber",
  o.status,
  o."customerEmail",
  oi."productSlug",
  oi.configuration,
  oi.quantity,
  oi."unitPriceGbp"
FROM orders o
JOIN order_items oi ON o.id = oi."orderId"
WHERE o."orderNumber" = '2025-000001';

-- Generate next order number
SELECT generate_order_number();
```

### Update Order Status

```sql
-- Mark order as paid
UPDATE orders
SET status = 'PAID',
    "stripePaymentIntentId" = 'pi_xxxxxxxxxx',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "orderNumber" = '2025-000001';

-- Mark order as shipped
UPDATE orders
SET status = 'SHIPPED',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "orderNumber" = '2025-000001';
```

## User Management

### User Queries

```sql
-- All users
SELECT id, email, name, "createdAt"
FROM users
ORDER BY "createdAt" DESC;

-- User with profile
SELECT
  u.id,
  u.email,
  u.name,
  cp.phone,
  cp."dateOfBirth"
FROM users u
LEFT JOIN customer_profiles cp ON u.id = cp."userId"
WHERE u.email = 'customer@example.com';

-- User's orders
SELECT
  o."orderNumber",
  o.status,
  o."totalAmountGbp",
  o."createdAt"
FROM orders o
WHERE o."userId" = 'user-id-here'
ORDER BY o."createdAt" DESC;

-- User's wishlist
SELECT
  w."productSlug",
  w.configuration,
  w."createdAt"
FROM wishlist_items w
WHERE w."userId" = 'user-id-here';
```

## Analytics

### Product Analytics

```sql
-- Most viewed products
SELECT
  "productSlug",
  COUNT(*) as view_count,
  COUNT(DISTINCT "userId") as unique_users
FROM product_views
WHERE "viewedAt" >= NOW() - INTERVAL '30 days'
GROUP BY "productSlug"
ORDER BY view_count DESC;

-- Most wishlisted products
SELECT
  "productSlug",
  COUNT(*) as wishlist_count
FROM wishlist_items
GROUP BY "productSlug"
ORDER BY wishlist_count DESC;

-- Best selling products
SELECT
  oi."productSlug",
  COUNT(*) as order_count,
  SUM(oi.quantity) as units_sold,
  SUM(oi."totalPriceGbp") as total_revenue
FROM order_items oi
JOIN orders o ON oi."orderId" = o.id
WHERE o.status IN ('PAID', 'FULFILLED', 'SHIPPED', 'DELIVERED')
GROUP BY oi."productSlug"
ORDER BY total_revenue DESC;
```

### Business Metrics

```sql
-- Revenue by date
SELECT
  DATE(o."createdAt") as order_date,
  COUNT(*) as order_count,
  SUM(o."totalAmountGbp") as daily_revenue
FROM orders o
WHERE o.status IN ('PAID', 'FULFILLED', 'SHIPPED', 'DELIVERED')
  AND o."createdAt" >= NOW() - INTERVAL '30 days'
GROUP BY DATE(o."createdAt")
ORDER BY order_date DESC;

-- Average order value
SELECT
  AVG("totalAmountGbp") as avg_order_value,
  MIN("totalAmountGbp") as min_order,
  MAX("totalAmountGbp") as max_order
FROM orders
WHERE status IN ('PAID', 'FULFILLED', 'SHIPPED', 'DELIVERED');

-- Conversion rate (orders / unique product views)
SELECT
  (SELECT COUNT(DISTINCT "userId") FROM orders WHERE status != 'CANCELLED') as customers_who_ordered,
  (SELECT COUNT(DISTINCT "userId") FROM product_views) as unique_visitors,
  ROUND(
    (SELECT COUNT(DISTINCT "userId") FROM orders WHERE status != 'CANCELLED')::numeric /
    NULLIF((SELECT COUNT(DISTINCT "userId") FROM product_views), 0) * 100,
    2
  ) as conversion_rate_pct;
```

## Maintenance Tasks

### Clean Up Old Data

```sql
-- Delete old abandoned carts (>30 days)
DELETE FROM cart_items
WHERE "createdAt" < NOW() - INTERVAL '30 days';

-- Archive old product views (>90 days)
-- (Consider moving to separate table instead of deleting)
DELETE FROM product_views
WHERE "viewedAt" < NOW() - INTERVAL '90 days';
```

### Vacuum and Analyze

```sql
-- Analyze tables for query optimization
ANALYZE;

-- Vacuum specific table
VACUUM ANALYZE orders;

-- Vacuum entire database (run during off-peak hours)
VACUUM FULL ANALYZE;
```

### Reindex

```sql
-- Reindex specific table
REINDEX TABLE orders;

-- Reindex all tables
REINDEX DATABASE postgres;
```

## Backup and Restore

### Manual Backup

```bash
# Backup entire database
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup specific tables
pg_dump $DATABASE_URL -t orders -t order_items > orders_backup.sql

# Backup schema only (no data)
pg_dump $DATABASE_URL --schema-only > schema_backup.sql

# Backup data only (no schema)
pg_dump $DATABASE_URL --data-only > data_backup.sql
```

### Restore from Backup

```bash
# Restore entire database
psql $DATABASE_URL < backup_20250101_120000.sql

# Restore specific tables
psql $DATABASE_URL < orders_backup.sql
```

## Troubleshooting

### Connection Issues

```bash
# Test connection
psql $DATABASE_URL -c "SELECT version();"

# Check active connections
psql $DATABASE_URL -c "SELECT count(*) FROM pg_stat_activity;"

# Kill stuck queries (use with caution)
psql $DATABASE_URL -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'idle in transaction';"
```

### Performance Issues

```sql
-- Find slow queries
SELECT
  query,
  calls,
  total_exec_time,
  mean_exec_time,
  max_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Check table bloat
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check index usage
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan as index_scans
FROM pg_stat_user_indexes
WHERE idx_scan = 0
  AND schemaname = 'public'
ORDER BY tablename, indexname;
```

## Environment Variables

```bash
# Direct connection (for migrations, schema push)
DATABASE_URL="postgresql://postgres.yrtpqpsuqioecjjwbmcy:Prestige998800!@aws-1-eu-west-1.pooler.supabase.com:5432/postgres"

# Pooled connection (for application queries)
DATABASE_URL_POOLED="postgresql://postgres.yrtpqpsuqioecjjwbmcy:Prestige998800!@aws-1-eu-west-1.pooler.supabase.com:6543/postgres"
```

## Important Files

- `DATABASE_AUDIT_REPORT.md` - Complete audit report with action items
- `database-improvements.sql` - RLS policies, triggers, functions, indexes
- `database-seed.sql` - Inventory and test data
- `audit-database.ts` - Database structure audit script
- `audit-security-performance.ts` - Security and performance audit
- `apply-improvements.sh` - Helper script to apply improvements
- `prisma/schema.prisma` - Source of truth for database schema

## Support

For detailed information, refer to:
- Full audit report: `DATABASE_AUDIT_REPORT.md`
- Prisma documentation: https://www.prisma.io/docs
- Supabase documentation: https://supabase.com/docs
- PostgreSQL documentation: https://www.postgresql.org/docs/
