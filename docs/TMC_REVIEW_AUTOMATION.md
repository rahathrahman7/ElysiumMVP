# TMC Review → notify → plan → approve → import

When the client taps **Add to ELYSIUM** on `/tmc-review` (and the row has a usable display name), ELYSIUM now:

1. **Emails you** at `ADMIN_NOTIFICATION_EMAIL` (Resend) with a proposed execution plan  
2. **Optionally fires a Cursor Automations webhook** so a cloud agent can deepen the plan and prompt you to approve  
3. **Waits for your go-ahead** before mutating `public/data/products.json`

Nothing is imported automatically.

## What changed in the app

| Piece | Role |
|-------|------|
| `POST /api/tmc-review` | After upsert, detects newly actionable Keep rows and notifies |
| `lib/tmc/notify-selection.ts` | Builds plan text, emails admin, POSTs Cursor webhook |
| `lib/tmc/selection-kind.ts` | Classifies `new_product` vs `image_replacement` |
| `scripts/plan-tmc-import.mjs` | Diffs Keep rows vs `products.json` (read-only) |
| `.cursor/automations/*.md` | Ready-to-paste Cursor Automation prompts |

### When a notification fires

- `keep` flips to `true` **and** `displayName` is non-empty, or  
- Row was already kept and the client **first sets** a display name  

Debounced field edits (price/notes/options) alone do **not** re-notify.

Display names matching `/replace/i` (e.g. “This to replace Unity images”) are classified as **image replacements**, not new products.

## One-time setup (you)

### 1. Email (already used elsewhere)

In Vercel → Project → Settings → Environment Variables:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `ADMIN_NOTIFICATION_EMAIL` → your inbox (e.g. `rahathrahman7@gmail.com`)
- `NEXT_PUBLIC_SITE_URL` → production site URL

Redeploy after setting.

### 2. Cursor Automation — **TMC Review — item added** (primary)

Cloud agents cannot create Automations via API (UI + login required). Create it yourself:

1. Open [cursor.com/automations/new](https://cursor.com/automations/new)  
2. Follow [`.cursor/automations/tmc-review-item-added.md`](../.cursor/automations/tmc-review-item-added.md)  
   - Name: **TMC Review — item added**  
   - Trigger: **Incoming HTTP webhook**  
3. After save, copy the webhook URL (+ API key if shown) into Vercel project **elysium-mvp**:

   - `TMC_REVIEW_WEBHOOK_URL`
   - `TMC_REVIEW_WEBHOOK_API_KEY` (if provided)
   - Also confirm: `DATABASE_URL`, `RESEND_API_KEY`, `ADMIN_NOTIFICATION_EMAIL`

4. Redeploy.

Optional deeper import workflow (plan → approve → execute): see  
`.cursor/automations/tmc-product-import-plan.md` and `tmc-product-import-execute.md`.

### 3. Smoke test

1. On staging/production with DB + Resend configured, open `/tmc-review`  
2. Add a named test Keep (or rename an existing kept ring from empty → named)  
3. Confirm:
   - Email arrives with execution plan + approval CTA  
   - Cursor Plan agent run starts (if webhook set)  
4. Do **not** approve unless you intend to import  

Local dry plan without writing catalog:

```bash
REVIEW_API=https://elysium-mvp.vercel.app/api/tmc-review node scripts/plan-tmc-import.mjs
node scripts/import-selected-rings.mjs --dry-run --update
```

## Execution after you approve

```bash
node scripts/import-selected-rings.mjs --update
# image replacements as needed:
# python scripts/apply-tmc-image-replacements.py
```

Then commit `public/data/products.json` + `public/products/tmc-import/**`, open/merge PR, deploy, spot-check PDPs. See also `docs/TMC_IMPORT_REPORT.md`.

## Flow

```mermaid
flowchart TD
  A[Client Add to ELYSIUM on /tmc-review] --> B[POST /api/tmc-review]
  B --> C[(Postgres tmc_ring_reviews)]
  B --> D{Newly actionable Keep?}
  D -->|yes| E[Email ADMIN_NOTIFICATION_EMAIL]
  D -->|yes| F[Webhook Cursor Plan automation]
  F --> G[Agent dry-runs plan-tmc-import + import --dry-run]
  G --> H[Slack / agent prompt: approve?]
  E --> H
  H -->|you approve| I[Execute automation or reply execute the plan]
  I --> J[import-selected-rings.mjs --update]
  J --> K[PR → merge → Vercel]
  D -->|no| L[Save only]
```
