# How to Seed Inventory - Step by Step

## 🎯 Quick Method (Recommended)

### Step 1: Open Supabase SQL Editor
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your ELYSIUM project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Copy the Seed SQL
1. Open `database-seed.sql` in your code editor (VS Code)
2. Press **Cmd+A** to select all
3. Press **Cmd+C** to copy

### Step 3: Run the Seed
1. Go back to Supabase SQL Editor
2. Press **Cmd+V** to paste the SQL
3. Click **Run** (or press **Cmd+Enter**)

### Step 4: Verify
You should see a success message. Then check:

```sql
-- Count total inventory
SELECT COUNT(*) FROM inventory;
-- Should return: 104

-- Check nova products
SELECT "productSlug", "variantKey", "stockLevel"
FROM inventory
WHERE "productSlug" = 'nova'
LIMIT 10;

-- Check vow-veil products
SELECT "productSlug", "variantKey", "stockLevel"
FROM inventory
WHERE "productSlug" = 'vow-veil'
LIMIT 10;
```

## ✅ What Gets Seeded

### Nova Ring - 52 variants
- **Metals**: 18k Yellow Gold, 18k White Gold, 18k Rose Gold, Platinum
- **Sizes**: 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10
- **Total**: 4 metals × 13 sizes = 52 variants
- **Stock levels**: 3-12 per variant (realistic inventory)

### Vow & Veil Ring - 52 variants
- **Metals**: 18k Yellow Gold, 18k White Gold, 18k Rose Gold, Platinum
- **Sizes**: 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10
- **Total**: 4 metals × 13 sizes = 52 variants
- **Stock levels**: 2-10 per variant (realistic inventory)

### Total: 104 inventory records

## 🔍 Verify in Prisma Studio

```bash
# Open Prisma Studio
pnpm db:studio
```

Go to http://localhost:51212:
1. Click **inventory** table
2. You should see 104 rows
3. Filter by `productSlug = 'nova'` → 52 rows
4. Filter by `productSlug = 'vow-veil'` → 52 rows

## 🐛 Troubleshooting

### "Duplicate key" error
This means inventory is already seeded. You can:
- **Ignore it** - seed is safe to run multiple times
- **Clear first**: `DELETE FROM inventory;` then run seed again

### No rows showing
1. Check SQL ran successfully (green checkmark in Supabase)
2. Refresh Prisma Studio (Cmd+R)
3. Query directly: `SELECT COUNT(*) FROM inventory;`

### "Table does not exist"
- Make sure you ran `pnpm db:push` first
- Check you're connected to the right database

## 📝 Sample Inventory Data

After seeding, you'll have entries like:

| productSlug | variantKey | stockLevel | reservedStock | lowStockThreshold |
|-------------|------------|------------|---------------|-------------------|
| nova | 18k-yellow-gold-6 | 10 | 0 | 3 |
| nova | 18k-white-gold-7 | 12 | 0 | 3 |
| nova | platinum-6.5 | 8 | 0 | 2 |
| vow-veil | 18k-rose-gold-6 | 6 | 0 | 3 |
| vow-veil | platinum-7 | 5 | 0 | 2 |

## 🎨 Customizing Inventory

Want to change stock levels? Edit `database-seed.sql`:

```sql
-- Example: Increase nova yellow gold size 7 stock
INSERT INTO inventory (..., "stockLevel", ...)
VALUES (..., 20, ...); -- Change from 12 to 20
```

Want to add more products? Follow the same pattern:

```sql
-- Add inventory for a new product
INSERT INTO inventory ("id", "productSlug", "variantKey", "stockLevel", "reservedStock", "lowStockThreshold", "lastUpdated")
VALUES
  (gen_random_uuid(), 'your-product-slug', 'metal-size', 10, 0, 3, CURRENT_TIMESTAMP);
```

## ✅ Success!

After seeding, you can now:
- ✅ Add products to cart in your app
- ✅ Check stock availability
- ✅ Track inventory levels
- ✅ Get low stock alerts

Next step: Test adding a product to cart in your app!
