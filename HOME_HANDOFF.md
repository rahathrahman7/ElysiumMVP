# Home Handoff — Database, Inventory & Checkout

**Branch:** `cursor/database-audit-products-433f`  
**Pull Request:** https://github.com/rahathrahman7/ElysiumMVP/pull/2  
**Status:** Ready to merge → seed Supabase → test checkout

Use this doc when you're back at your desk to verify everything and finish setup.

---

## What the cloud agent did (summary)

### 1. Database audit tooling
- Added `pnpm db:audit` — checks catalog vs PostgreSQL (orphan slugs, variant keys, row counts)
- Added `pnpm db:audit:security` — RLS / schema checks
- Found old seed docs used wrong slug (`nova`) and numeric sizes instead of UK letter sizes

### 2. Inventory seed (catalog-aligned)
- `pnpm db:seed` reads `public/data/products.json`
- Creates **one row per metal × UK ring size** (e.g. `18k-yellow-gold-g-1/2`)
- **5,442** total variants across 39 products
- Safe to re-run: adds missing rows, removes stale orphans, does not overwrite existing stock

### 3. Checkout inventory wiring
Stock is now enforced end-to-end:

```
Add to bag → Checkout API → validate stock → reserve → Stripe
                ↓ fail                         ↓ success
           "out of stock" error          payment_intent.succeeded → fulfill (deduct stock)
                ↓ cancel / fail / expire
                                    release reservation
```

### 4. Files changed (key ones)

| File | Purpose |
|------|---------|
| `lib/inventory/variantKey.ts` | Builds variant keys from metal + UK size |
| `lib/inventory/catalogInventory.ts` | Generates seed rows from catalog |
| `prisma/seed.ts` | Seeds inventory table |
| `lib/services/checkoutInventory.ts` | Validate / reserve / release / fulfill for checkout |
| `app/api/checkout/route.ts` | Checks + reserves before Stripe |
| `app/api/checkout/cancel/route.ts` | Releases stock when user cancels |
| `app/api/webhooks/stripe/route.ts` | Fulfill on PAID, release on fail/expire |
| `app/checkout/success/` | Clears cart after successful payment |
| `app/checkout/cancel/` | Calls cancel API to release reservations |
| `scripts/db/audit-database.ts` | Full audit script |
| `scripts/db/test-checkout-inventory.ts` | Smoke test for inventory logic |

---

## Your checklist when you get home

### Step 1 — Merge the PR
```bash
git checkout main
git pull
# Merge PR #2 on GitHub, or:
git merge cursor/database-audit-products-433f
```

### Step 2 — Connect Supabase

**Option A: `.env` file** (project root)
```bash
cp .env.example .env
```

Add from Supabase Dashboard → **Settings** → **Database** → **URI** (port 5432):
```bash
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres"
```

**Option B: Supabase MCP in Cursor**  
Ask Composer: *"Run pnpm db:seed using my connected Supabase project"*

### Step 3 — Push schema & seed inventory
```bash
pnpm install
pnpm db:push
pnpm db:seed
pnpm db:audit
```

**Expected audit results:**
- `inventory: 5442` rows
- `0 errors`
- Featured products: `nova-oval-solitaire-round-marquise` (180 variants), `vow-veil` (180)

**Verify in SQL (Supabase SQL Editor):**
```sql
SELECT COUNT(*) FROM inventory;
-- → 5442

SELECT "productSlug", "variantKey", "stockLevel"
FROM inventory
WHERE "productSlug" = 'vow-veil'
  AND "variantKey" LIKE '%g-1/2';
-- → 18k-yellow-gold-g-1/2, 18k-rose-gold-g-1/2, etc.
```

### Step 4 — Other env vars (if not set)
```bash
NEXTAUTH_SECRET=          # openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
STRIPE_SECRET_KEY=        # Stripe dashboard (test mode)
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=    # from stripe listen (see step 6)
```

### Step 5 — Run smoke tests
```bash
# Inventory logic (needs seeded DB)
pnpm db:test:checkout-inventory

# Full audit
pnpm db:audit

# Production build
pnpm build

# E2E (optional)
pnpm exec playwright install
pnpm exec playwright test tests/smoke.spec.ts
```

### Step 6 — Stripe webhook (local testing)
```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# Copy whsec_... into .env as STRIPE_WEBHOOK_SECRET
```

**In Stripe Dashboard → Webhooks**, ensure these events are enabled:
- `checkout.session.completed`
- `checkout.session.expired` ← **new, required for abandoned checkout**
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

### Step 7 — Manual checkout test
1. `pnpm dev` → http://localhost:3000
2. Open a ring (e.g. Vow & Veil)
3. Select metal + UK size (e.g. **G 1/2**)
4. Add to bag → Checkout
5. Pay with test card: `4242 4242 4242 4242`

**Verify stock changed:**
```sql
SELECT "stockLevel", "reservedStock"
FROM inventory
WHERE "productSlug" = 'vow-veil'
  AND "variantKey" = '18k-yellow-gold-g-1/2';
-- stockLevel should decrease by 1 after payment
-- reservedStock should be 0 after fulfill
```

**Test cancel:** start checkout, cancel on Stripe page → land on `/checkout/cancel?order=...` → reserved stock released.

---

## How variant keys work (for double-checking)

| Catalog selection | `variantKey` in DB |
|-------------------|-------------------|
| 18k Yellow Gold + G 1/2 | `18k-yellow-gold-g-1/2` |
| Platinum + F | `platinum-f` |
| Earring (no size) | `18k-yellow-gold-one-size` |

Cart `configuration` stored at checkout:
```json
{
  "metal": "18k Yellow Gold",
  "size": "G 1/2"
}
```

---

## Known issues / not done yet

| Item | Notes |
|------|-------|
| **Earrings can't add to bag** | `ProductDetail` requires `selectedSize` but earrings have no sizes in catalog |
| **Lumea images missing** | `/products/Lumea/` folder doesn't exist — broken gallery |
| **Hero mobile image** | `herov3mobile.png` referenced but missing |
| **Men's ring widths** | Inventory tracks metal+size only, not width |
| **RLS on Supabase** | Still disabled per Dec 2025 audit — enable before production |
| **Old docs** | `DATABASE_QUICK_REFERENCE.md` still has dead Supabase URL + `nova` slug — don't use |

---

## Quick reference commands

```bash
pnpm db:push          # Apply Prisma schema to DB
pnpm db:seed          # Seed inventory from products.json
pnpm db:audit         # Catalog + DB consistency check
pnpm db:audit:all     # Audit + security
pnpm db:studio        # Visual DB browser
pnpm dev              # Local dev server
```

---

## If something goes wrong

| Symptom | Fix |
|---------|-----|
| Checkout says "out of stock" for everything | Run `pnpm db:seed` |
| Checkout says "Missing metal selection" | Ensure ring metal + size selected before add to bag |
| Webhook doesn't update order | Check `STRIPE_WEBHOOK_SECRET`, run `stripe listen` |
| Stock stuck as reserved | Cancel order via `/checkout/cancel?order=ORDER_ID` or wait for session expire |
| Wrong variant keys in DB | Re-run `pnpm db:seed` — removes stale `nova` / numeric size rows |

---

## Test results from cloud agent (local Postgres)

| Test | Result |
|------|--------|
| `pnpm build` | ✅ Pass |
| `pnpm db:seed` | ✅ 5,442 rows |
| `pnpm db:audit` | ✅ 0 errors (local DB) |
| `pnpm db:test:checkout-inventory` | ✅ Pass (validate → reserve → fulfill) |
| Playwright smoke | Needs `pnpm exec playwright install` |
| Live Supabase | ⏸️ Not tested — waiting for your credentials |

---

*Generated during cloud agent session. Update this file or delete once you've completed the home checklist.*
