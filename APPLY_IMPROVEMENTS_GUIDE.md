# Database Improvements - Application Guide

Your Supabase database is set up with all tables, but needs some improvements applied.

## ✅ Current Status

- ✅ Database connected successfully
- ✅ All 13 tables created
- ✅ 27 indexes in place
- ✅ Foreign keys configured
- ✅ Empty inventory (needs seeding)
- ❌ No triggers (updatedAt won't auto-update)
- ❌ No utility functions
- ❌ Missing 7 performance indexes
- ❌ No Row Level Security policies

## 🚀 Quick Start: Apply Improvements

### Step 1: Apply Safe Improvements (5 minutes)

1. **Open Supabase SQL Editor**
   - Go to your [Supabase Dashboard](https://app.supabase.com)
   - Select your ELYSIUM project
   - Click **SQL Editor** in the left sidebar

2. **Run the improvements**
   - Open the file `database-improvements-safe.sql` in your code editor
   - Copy the ENTIRE contents
   - Paste into the Supabase SQL Editor
   - Click **Run** (or press Cmd+Enter)

3. **Verify success**
   You should see:
   ```
   ✅ 6 triggers created
   ✅ 4 functions created
   ✅ 7 indexes created
   ✅ pg_trgm extension enabled
   ✅ Table comments added
   ```

### Step 2: Seed Inventory (2 minutes) - **REQUIRED**

Without inventory, customers cannot add products to their cart!

1. **Open Supabase SQL Editor** (same as above)
2. **Open** `database-seed.sql` in your code editor
3. **Copy** the ENTIRE contents
4. **Paste** into Supabase SQL Editor
5. **Click Run**

This adds 104 inventory records for:
- Nova ring (52 variants: 4 metals × 13 sizes)
- Vow & Veil ring (52 variants: 4 metals × 13 sizes)

### Step 3: Verify Everything Works (1 minute)

```bash
# Run audit to check everything
pnpm db:audit

# Open Prisma Studio to see your data
pnpm db:studio
```

Go to http://localhost:51212 and verify:
- ✅ You see 104 rows in the `inventory` table
- ✅ All tables are present

---

## 📋 What Gets Applied

### Automatic Timestamp Updates (Triggers)
- `updatedAt` fields now auto-update when records change
- Applies to: users, customer_profiles, addresses, cart_items, orders, bespoke_leads

### Utility Functions
- `generate_order_number()` - Creates order numbers like "2025-000001"
- `check_low_stock()` - Returns products with low inventory
- `get_available_stock(slug, variant)` - Gets available stock (total - reserved)

### Performance Indexes
- Order lookups by email (guest checkout)
- Order date range queries
- Cart cleanup (old items)
- Wishlist by product
- Product view analytics
- Bespoke lead management

### Search Extension
- `pg_trgm` extension for trigram search
- Enables fuzzy text search for future features

### Documentation
- Comments on all 12 tables
- Makes database self-documenting

---

## ⚠️ Row Level Security (RLS) - Important Note

**RLS policies are NOT applied** because they require Supabase Auth integration.

### Why RLS is Critical

Without RLS, anyone with database access can:
- ❌ View all user data
- ❌ See other customers' orders
- ❌ Access payment information
- ❌ View personal addresses

### When to Apply RLS

Apply RLS policies **BEFORE** you:
1. Add real customer data
2. Launch to production
3. Enable user registration

### How to Apply RLS (Future)

When you're ready to implement authentication:

1. Set up NextAuth.js or Supabase Auth
2. Open `database-improvements.sql`
3. Copy sections 1-10 (RLS policies)
4. Adapt the `auth.uid()` functions to your auth system
5. Run in Supabase SQL Editor

**For now**, you'll handle security at the application level (API routes).

---

## 🧪 Testing

### Test Triggers

```sql
-- Insert a user
INSERT INTO users (id, email, name, "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'test@example.com', 'Test User', NOW(), NOW());

-- Update the user (updatedAt should auto-update)
UPDATE users SET name = 'Updated Name' WHERE email = 'test@example.com';

-- Check if updatedAt changed
SELECT email, name, "createdAt", "updatedAt" FROM users WHERE email = 'test@example.com';
```

### Test Utility Functions

```sql
-- Generate an order number
SELECT generate_order_number();
-- Should return: 2025-000001

-- Check low stock
SELECT * FROM check_low_stock();
-- Should return products below threshold

-- Get available stock
SELECT get_available_stock('nova', '18k-yellow-gold-6');
-- Should return: 10 (or whatever you seeded)
```

### Test Inventory

```sql
-- Count total inventory
SELECT COUNT(*) FROM inventory;
-- Should return: 104

-- Check nova inventory
SELECT * FROM inventory WHERE "productSlug" = 'nova' LIMIT 5;

-- Check vow-veil inventory
SELECT * FROM inventory WHERE "productSlug" = 'vow-veil' LIMIT 5;
```

---

## 📊 Audit Commands

```bash
# Check database structure
pnpm db:audit

# Check security and performance
pnpm db:audit:security

# Run both
pnpm db:audit:all

# Open database browser
pnpm db:studio
```

---

## 🔄 Rollback (if needed)

If something goes wrong, you can rollback:

```sql
-- Drop triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_customer_profiles_updated_at ON customer_profiles;
DROP TRIGGER IF EXISTS update_addresses_updated_at ON addresses;
DROP TRIGGER IF EXISTS update_cart_items_updated_at ON cart_items;
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
DROP TRIGGER IF EXISTS update_bespoke_leads_updated_at ON bespoke_leads;

-- Drop functions
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS generate_order_number();
DROP FUNCTION IF EXISTS check_low_stock();
DROP FUNCTION IF EXISTS get_available_stock(TEXT, TEXT);

-- Drop indexes (if needed)
DROP INDEX IF EXISTS idx_orders_customer_email;
DROP INDEX IF EXISTS idx_orders_created_at;
-- ... etc
```

---

## ✅ Success Checklist

After applying improvements, you should have:

- [x] Database connected to Supabase
- [x] All 13 tables created
- [ ] 6 triggers for timestamp updates
- [ ] 4 utility functions
- [ ] 7 additional performance indexes
- [ ] pg_trgm extension enabled
- [ ] 104 inventory records (nova + vow-veil)
- [ ] Table documentation comments

---

## 🆘 Troubleshooting

### "Permission denied" errors
- Make sure you're using the Supabase SQL Editor (not direct psql)
- You need database owner permissions

### "Already exists" errors
- Safe to ignore - means it's already applied
- The SQL is idempotent (safe to run multiple times)

### Inventory not showing
- Check you ran `database-seed.sql`
- Verify in Prisma Studio: `pnpm db:studio`
- Query: `SELECT COUNT(*) FROM inventory;`

### Triggers not working
- Test with the SQL queries in the Testing section
- Check trigger exists: `SELECT * FROM pg_trigger WHERE tgname LIKE 'update_%';`

---

## 📚 Next Steps

After applying improvements:

1. ✅ **Test your application**
   - Add products to cart
   - Test checkout flow
   - Verify inventory updates

2. ✅ **Implement API routes**
   - Use the functions in your Next.js API routes
   - Reference `docs/API_REFERENCE.md`

3. ✅ **Set up authentication**
   - Configure NextAuth.js
   - Then apply RLS policies

4. ✅ **Monitor performance**
   - Check Supabase dashboard metrics
   - Review slow query logs

---

**Questions?** Check the detailed documentation:
- `DATABASE_AUDIT_REPORT.md` - Full audit results
- `DATABASE_AUDIT_SUMMARY.md` - Executive summary
- `DATABASE_QUICK_REFERENCE.md` - Common SQL queries
- `database-improvements.sql` - All improvements with RLS
- `database-improvements-safe.sql` - Safe improvements only

**Ready to apply?** Go to Step 1 above! 🚀
