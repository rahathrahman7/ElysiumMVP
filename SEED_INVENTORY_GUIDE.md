# How to Seed Inventory - Step by Step

Inventory rows are generated from `public/data/products.json` using the same UK letter ring sizes shown on the product configurator (F, F 1/2, G, G 1/2, … through Z+4).

## Quick method (recommended)

```bash
# Ensure schema is pushed and DATABASE_URL is set in .env
pnpm db:push
pnpm db:seed
```

This creates one inventory row per **metal × size** combination for each catalog product.

## What gets seeded

| Product type | Sizes used | Variant key format |
|--------------|------------|-------------------|
| Engagement / men's rings | UK letter sizes from catalog (`F`, `G 1/2`, …) | `18k-yellow-gold-f`, `platinum-g-1/2` |
| Earrings | `one-size` (no ring sizes in catalog) | `18k-yellow-gold-one-size` |
| Bracelets without sizes | `one-size` | `18k-rose-gold-one-size` |

### Featured examples

**Nova** (`nova-oval-solitaire-round-marquise`)
- 4 metals × 45 UK sizes = **180 variants**
- Sample keys: `platinum-f`, `18k-yellow-gold-g-1/2`

**Vow & Veil** (`vow-veil`)
- 4 metals × 45 UK sizes = **180 variants**

**Full catalog:** 39 products → **5,442** inventory variants total

## Verify

```bash
pnpm db:audit
```

Or in SQL:

```sql
SELECT COUNT(*) FROM inventory;

SELECT "productSlug", COUNT(*) AS variants
FROM inventory
GROUP BY "productSlug"
ORDER BY "productSlug";

SELECT "productSlug", "variantKey", "stockLevel"
FROM inventory
WHERE "productSlug" = 'nova-oval-solitaire-round-marquise'
LIMIT 10;

SELECT "productSlug", "variantKey", "stockLevel"
FROM inventory
WHERE "productSlug" = 'vow-veil'
  AND "variantKey" LIKE '%-g-1/2'
LIMIT 5;
```

## Prisma Studio

```bash
pnpm db:studio
```

1. Open the **inventory** table
2. Filter `productSlug = nova-oval-solitaire-round-marquise` → 180 rows
3. Confirm `variantKey` values use UK sizes (not numeric 4–10)

## Re-running the seed

`pnpm db:seed` is safe to re-run:

- Adds missing variants for new catalog products/sizes
- Removes stale rows (wrong slug or outdated variant keys, e.g. old `nova` slug or numeric sizes)
- Does **not** overwrite stock levels on existing matching rows

## Troubleshooting

### `DATABASE_URL is required`
Set `DATABASE_URL` in `.env` (see `.env.example`).

### Duplicate key errors
Usually means a partial seed already exists. Re-run `pnpm db:seed` — it skips existing variant keys.

### Wrong sizes in database
If you previously ran old seed SQL with numeric sizes (`18k-yellow-gold-6`) or slug `nova`, run:

```bash
pnpm db:seed
```

The seed removes orphan rows that don't match the current catalog.

## Customizing stock levels

Edit `lib/inventory/catalogInventory.ts` (`stockLevelForVariant`) or update rows via the admin inventory UI / `PATCH /api/admin/inventory`.
