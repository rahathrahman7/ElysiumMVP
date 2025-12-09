# ELYSIUM MVP - Database Documentation

This directory contains comprehensive database audit reports and improvement scripts for the ELYSIUM MVP Supabase PostgreSQL database.

## Quick Start

### 1. Run Database Audit

```bash
# Using npm scripts (recommended)
npm run db:audit              # Structure audit
npm run db:audit:security     # Security & performance audit
npm run db:audit:all          # Run both audits

# Or directly
npx tsx audit-database.ts
npx tsx audit-security-performance.ts
```

### 2. Apply Improvements

```bash
# Apply all basic improvements (triggers, functions, indexes)
./apply-improvements.sh all

# Seed inventory data (REQUIRED for site to function)
./apply-improvements.sh inventory

# Show all options
./apply-improvements.sh help
```

### 3. Review Reports

Start with the summary, then dive into details:

1. **DATABASE_AUDIT_SUMMARY.md** - Executive summary (read this first)
2. **DATABASE_AUDIT_REPORT.md** - Complete 12-section analysis
3. **DATABASE_QUICK_REFERENCE.md** - Common queries and commands

---

## Files Overview

### Documentation (26 KB)

| File | Purpose | When to Use |
|------|---------|-------------|
| `DATABASE_README.md` | This file - quick start guide | Start here |
| `DATABASE_AUDIT_SUMMARY.md` | Executive summary, key findings | Quick overview |
| `DATABASE_AUDIT_REPORT.md` | Comprehensive 12-section audit | Detailed analysis |
| `DATABASE_QUICK_REFERENCE.md` | Common queries and commands | Day-to-day operations |

### SQL Scripts (28 KB)

| File | Purpose | How to Apply |
|------|---------|--------------|
| `database-improvements.sql` | RLS policies, triggers, functions, indexes | Via Supabase SQL Editor or `psql` |
| `database-seed.sql` | Inventory + test data | Via `./apply-improvements.sh inventory` |

### TypeScript Scripts (21 KB)

| File | Purpose | How to Run |
|------|---------|-----------|
| `audit-database.ts` | Database structure audit | `npm run db:audit` |
| `audit-security-performance.ts` | Security & performance audit | `npm run db:audit:security` |

### Automation (10 KB)

| File | Purpose | How to Run |
|------|---------|-----------|
| `apply-improvements.sh` | Helper script to apply improvements | `./apply-improvements.sh [command]` |

**Total:** 8 files, 85 KB

---

## Current Database Status

### Structure: ✅ EXCELLENT
- All 13 tables created
- Matches Prisma schema exactly
- 27 indexes configured
- 11 foreign key relationships
- 2 enums properly defined

### Security: ❌ CRITICAL ISSUES
- NO Row Level Security (RLS) policies
- All user data exposed
- PII data unprotected
- OAuth tokens accessible

### Performance: 🟡 GOOD (Needs Minor Improvements)
- Good baseline indexes
- Missing 7 recommended indexes
- No pg_trgm extension (for search)
- No utility functions

### Data: 🟡 EMPTY (Expected)
- 0 rows in all tables
- Needs ~104 inventory rows
- Ready for seeding

---

## Critical Actions Required

### Priority 1: DO TODAY (Before Adding Real Data)

1. **Apply Basic Improvements** (~15 minutes)
   ```bash
   chmod +x apply-improvements.sh
   ./apply-improvements.sh all
   ```
   This installs:
   - `updatedAt` triggers (automatic timestamp updates)
   - Utility functions (order numbers, stock checks)
   - Performance indexes (7 additional indexes)
   - pg_trgm extension (for search)

2. **Seed Inventory Data** (~5 minutes)
   ```bash
   ./apply-improvements.sh inventory
   ```
   This adds ~104 inventory rows for nova and vow-veil products.
   **REQUIRED** for site to function properly.

3. **Apply RLS Policies** (~30 minutes)
   - Open Supabase SQL Editor
   - Copy sections 1-10 from `database-improvements.sql`
   - Execute in SQL Editor
   - Test authentication flows

   **CRITICAL:** Without RLS, any user can access all data.

### Priority 2: BEFORE LAUNCH

4. **Test Authentication with RLS** (~30 minutes)
   - Create test user
   - Verify data isolation
   - Test cart, wishlist, orders

5. **Set Up Automated Backups** (~15 minutes)
   - Configure in Supabase dashboard
   - Set daily backup schedule
   - Test restore procedure

6. **Add Test Data** (Optional, ~5 minutes)
   ```bash
   ./apply-improvements.sh test-data
   ```
   Only use in development/staging environments.

7. **Run Final Audit** (~5 minutes)
   ```bash
   npm run db:audit:all
   ```
   Verify all improvements applied correctly.

---

## Common Tasks

### Database Management

```bash
# View database in browser
npm run db:studio

# Push schema changes
npm run db:push

# Create migration
npm run db:migrate

# Generate Prisma client
npm run db:generate

# Run audit
npm run db:audit:all
```

### Connect to Database

```bash
# Interactive psql session
psql $DATABASE_URL

# Run single query
psql $DATABASE_URL -c "SELECT COUNT(*) FROM users;"

# Execute SQL file
psql $DATABASE_URL -f database-improvements.sql
```

### Check Status

```bash
# Check RLS status
psql $DATABASE_URL -c "SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';"

# Check inventory
psql $DATABASE_URL -c "SELECT productSlug, COUNT(*) FROM inventory GROUP BY productSlug;"

# Check table sizes
psql $DATABASE_URL -c "SELECT tablename, pg_size_pretty(pg_total_relation_size('public.'||tablename)) FROM pg_tables WHERE schemaname = 'public' ORDER BY pg_total_relation_size('public.'||tablename) DESC;"
```

---

## Understanding the Audit Results

### What the Audit Found

**Good News:**
- Database structure is perfect
- All tables, indexes, and relationships are correct
- Foreign keys properly configured
- Data types and constraints are appropriate
- Ready for production (after security fixes)

**Critical Issues:**
- No Row Level Security (RLS) - any authenticated user can access all data
- No automatic timestamp updates (updatedAt fields)
- Missing some performance indexes
- Empty inventory table (site won't function)

**Minor Improvements:**
- Need pg_trgm extension for search
- Need utility functions for common operations
- Could use additional indexes for analytics queries

### Overall Assessment

**Grade:** B (Structure: A, Security: D, Performance: B+)
**After Fixes:** A (Structure: A, Security: A, Performance: A)

**Time to Fix:** ~1 hour (mostly automated)
**Complexity:** Low (scripts provided)
**Risk Level:** HIGH (no RLS) → LOW (after improvements)

---

## Security Details

### Current Security Issues

| Issue | Severity | Impact |
|-------|----------|--------|
| No RLS policies | 🔴 CRITICAL | Any user can access all data |
| PII exposed | 🔴 CRITICAL | GDPR violations, data breach risk |
| OAuth tokens visible | 🔴 CRITICAL | Account takeover possible |

### After Applying RLS

| Protection | Status |
|------------|--------|
| User data isolation | ✅ Protected |
| Cart/wishlist privacy | ✅ Protected |
| Order history privacy | ✅ Protected |
| Admin access control | ✅ Service role only |
| GDPR compliance | ✅ Compliant |

---

## Performance Optimization

### Current Performance

- **Good:** Foreign key indexes, userId indexes
- **Good:** OrderNumber, productSlug indexes
- **Missing:** Date-based query indexes
- **Missing:** Analytics query optimization
- **Missing:** Full-text search capability

### After Improvements

- ✅ All foreign keys indexed
- ✅ Date queries optimized (createdAt indexes)
- ✅ Guest checkout optimized (email index)
- ✅ Analytics queries faster (composite indexes)
- ✅ Search capability enabled (pg_trgm)

**Expected Performance:** <5ms for most queries

---

## Inventory Management

### Required Inventory

**Products:** nova, vow-veil

**Variants per Product:**
- **Metals:** 18K Yellow Gold, 18K White Gold, 18K Rose Gold, Platinum
- **Sizes:** 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10

**Total Variants:** 52 per product × 2 products = **104 rows required**

### Check Inventory

```bash
# Using utility function (after applying improvements)
psql $DATABASE_URL -c "SELECT * FROM check_low_stock();"

# Check all inventory
psql $DATABASE_URL -c "SELECT * FROM inventory ORDER BY productSlug, variantKey;"

# Summary by product
psql $DATABASE_URL -c "SELECT productSlug, COUNT(*) as variants, SUM(stockLevel) as stock FROM inventory GROUP BY productSlug;"
```

---

## Troubleshooting

### RLS Issues

**Problem:** Users can't access their own data after enabling RLS
**Solution:** Ensure RLS policies are applied (sections 2-10 of database-improvements.sql)

**Problem:** Service role can't access data
**Solution:** Verify you're using service role key, not anon key

### Connection Issues

**Problem:** Can't connect to database
**Solution:** Check DATABASE_URL in .env file

**Problem:** Connection timeout
**Solution:** Use pooled connection (port 6543) for API routes

### Seed Issues

**Problem:** Inventory seeding fails with "duplicate key"
**Solution:** Inventory already seeded - check with query above

**Problem:** Test data won't insert
**Solution:** Conflict with existing data - check user emails

---

## Integration with Application

### Prisma Integration

```typescript
// lib/database/client.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Use Prisma for all database queries
const orders = await prisma.order.findMany({
  where: { userId: session.user.id },
  include: { items: true }
})
```

### Connection Pooling

```bash
# Use direct connection for:
# - Migrations (db:migrate)
# - Schema push (db:push)
# - Prisma Studio (db:studio)
DATABASE_URL="postgresql://...pooler.supabase.com:5432/postgres"

# Use pooled connection for:
# - API routes
# - Server actions
# - Background jobs
DATABASE_URL_POOLED="postgresql://...pooler.supabase.com:6543/postgres"
```

### Utility Functions

After applying improvements, use these SQL functions:

```sql
-- Generate order number
SELECT generate_order_number();

-- Check low stock
SELECT * FROM check_low_stock();

-- Check available stock
SELECT get_available_stock('nova', '18k-yellow-gold-7');
```

---

## Production Checklist

Before going live:

- [ ] RLS policies applied and tested
- [ ] Inventory seeded (all 104 variants)
- [ ] Automated backups configured
- [ ] Monitoring and alerts set up
- [ ] Test user flows (signup, checkout, orders)
- [ ] Performance testing completed
- [ ] Security audit passed
- [ ] Disaster recovery plan documented
- [ ] Team trained on database operations

---

## Support & Resources

### Documentation

1. **Start Here:** DATABASE_AUDIT_SUMMARY.md
2. **Deep Dive:** DATABASE_AUDIT_REPORT.md
3. **Daily Use:** DATABASE_QUICK_REFERENCE.md
4. **This Guide:** DATABASE_README.md

### External Resources

- **Prisma Docs:** https://www.prisma.io/docs
- **Supabase Docs:** https://supabase.com/docs
- **PostgreSQL Docs:** https://www.postgresql.org/docs/
- **RLS Guide:** https://supabase.com/docs/guides/auth/row-level-security

### Package Scripts

```bash
# Database operations
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema changes
npm run db:migrate       # Create and apply migration
npm run db:studio        # Open Prisma Studio
npm run db:seed          # Run seed script

# Database audits (NEW)
npm run db:audit         # Structure audit
npm run db:audit:security # Security audit
npm run db:audit:all     # All audits
```

---

## Need Help?

1. **Check the audit reports** - Most questions are answered there
2. **Review quick reference** - Common queries and solutions
3. **Run the audit** - `npm run db:audit:all` for current status
4. **Check Supabase dashboard** - Real-time metrics and logs

---

**Last Updated:** December 8, 2025
**Database Version:** PostgreSQL 15
**Schema Version:** Matches prisma/schema.prisma
**Audit Status:** Complete - Action items identified

**Next Step:** Review DATABASE_AUDIT_SUMMARY.md and apply improvements
