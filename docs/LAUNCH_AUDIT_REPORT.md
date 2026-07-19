# ELYSIUM MVP — Launch & Client Handover Audit

**Date:** February 12, 2025  
**Scope:** Launch readiness, security, stability, documentation, remaining work

---

## 1. Launch Blockers (Must-Fix)

| # | Issue | File(s) | Notes |
|---|-------|---------|-------|
| 1 | ~~**Missing legal/content pages**~~ | `app/privacy/`, `app/terms/`, `app/shipping/`, `app/faq/` | ✅ **FIXED** — Placeholder pages created. Client to provide final copy. |
| 2 | ~~**Footer `id` prop error**~~ | `app/layout.tsx:50` | ✅ **FIXED** — Footer now accepts optional `id` prop. |
| 3 | ~~**metadataBase not set**~~ | `app/layout.tsx` | ✅ **FIXED** — Added metadataBase from NEXT_PUBLIC_SITE_URL. |
| 4 | **Stripe live keys required** | `.env.example`, Vercel env | Client must provide live Stripe keys; checkout will fail without them. |
| 5 | **Inquiry system incomplete** | `docs/REMAINING_CLIENT_NOTES.md` | Enquire → `/contact`; no product-context form, no DB save, no 24h email. Blocks natural-diamond/upgrade flow. |
| 6 | ~~**Engraving fee still in data**~~ | `public/data/products.json` | ✅ **FIXED** — All engravingFeeGBP set to 0. |
| 7 | **Prisma config module** | `prisma.config.ts:1` | `import { defineConfig } from '@prisma/config'` — TS error "Cannot find module '@prisma/config'". May need Prisma 7 migration. |

---

## 2. High-Risk Issues

### Security

| Risk | Location | Severity | Notes |
|------|----------|----------|-------|
| **Demo admin credentials** | `lib/auth/config.ts`, `app/admin/layout.tsx` | High | `DEMO_ADMIN_EMAIL` / `DEMO_ADMIN_PASSWORD` — if set in prod, creates backdoor. Ensure unset in production. |
| **Admin auth bypass** | `app/admin/layout.tsx:8` | Critical | `DISABLE_ADMIN_AUTH=true` disables all admin auth. Must never be set in production. |
| **API keys in env** | `lib/env.ts`, `.env.example` | OK | Keys loaded from env; no hardcoded secrets found. |
| **Nivoda credentials in body** | `app/api/test-nivoda/route.ts` | Medium | Test endpoint accepts username/password in POST body. Consider disabling in prod or protecting. |

### Stability & Data

| Risk | Location | Severity | Notes |
|------|----------|----------|-------|
| **`ignoreBuildErrors: true`** | `next.config.mjs:23` | Medium | TypeScript errors skipped at build. 40+ TS errors exist; runtime bugs may slip through. |
| **`force-dynamic` on homepage** | `app/page.tsx` | Low | Homepage not statically generated; adds latency. Acceptable for GSAP/scroll. |
| **`_products` possibly null** | `lib/products.ts:41` | Medium | Null check needed before use. |
| **Product type mismatch** | `ProductDetail.tsx`, `lib/productTypes` vs `types/product` | Medium | Two Product types; components expect different shapes. |

### Deployment

| Risk | Location | Severity | Notes |
|------|----------|----------|-------|
| **Database migrations** | `VERCEL_DEPLOYMENT.md` | High | Post-deploy: must run `prisma migrate deploy` or `db push`; easy to forget. |
| **Stripe webhook secret** | Env | High | Wrong or missing webhook secret = payments not confirmed, orders stuck. |
| **NEXTAUTH_URL** | Env | High | Must match production domain exactly or auth breaks. |

---

## 3. Missing Docs / Runbooks

| Doc | Status | Notes |
|-----|--------|-------|
| **README** | ✅ Exists | Basic quick start; links to BACKEND_SETUP. |
| **BACKEND_SETUP.md** | ✅ Exists | Database, auth, Stripe, Resend setup. |
| **VERCEL_DEPLOYMENT.md** | ✅ Exists | Env vars, migrations, webhooks. |
| **LAUNCH_CHECKLIST.md** | ✅ Exists | Phased checklist (10 phases). |
| **API Reference** | ✅ Exists | `docs/API_REFERENCE.md`. |
| **Rollback runbook** | ❌ Missing | No step-by-step rollback procedure. |
| **Incident response** | ❌ Missing | No "site down / payments failing" playbook. |
| **Client handover** | ⚠️ Partial | REMAINING_CLIENT_NOTES, UI_AUDIT exist; no single handover doc. |
| **Env var reference** | ⚠️ Partial | `.env.example` + Vercel doc; no "what each var does" table. |
| **CMS (Sanity) runbook** | ⚠️ Partial | Sanity mentioned; no "how to add product" guide for client. |

---

## 4. Remaining Work Checklist

| Priority | Item | Owner | Acceptance Criteria |
|----------|------|-------|---------------------|
| **P0** | Create `/privacy`, `/terms`, `/shipping`, `/faq` pages | Dev | Pages exist; Footer/resizing links work; client provides copy. |
| **P0** | Remove `id` prop from Footer or add to Footer props | Dev | No TS error; layout renders. |
| **P0** | Set `metadataBase` in root layout | Dev | No Next.js metadata warning; OG images resolve. |
| **P0** | Ensure `DEMO_ADMIN_*` and `DISABLE_ADMIN_AUTH` unset in prod | DevOps/Client | Production env verified; no demo auth. |
| **P0** | Stripe live keys + webhook configured | Client + Dev | Live checkout works; webhook events received. |
| **P1** | Inquiry form (product context, DB, 24h email) | Dev | Enquire from PDP → form → BespokeLead → email. |
| **P1** | Remove engraving fee from product data | Dev/Client | £15 removed; "Complimentary" copy only. |
| **P1** | Fix Prisma config / `@prisma/config` | Dev | `pnpm build` and `tsc` pass. |
| **P1** | Fix critical TS errors (Product types, lib/products null) | Dev | `tsc --noEmit` passes or critical paths fixed. |
| **P2** | Product page: metal rows, single diamond selector | Dev | Per REMAINING_CLIENT_NOTES. |
| **P2** | Ring size "I don't know" → guide + contact | Dev | Link to Ring Size Guide; route to contact if agreed. |
| **P2** | Hero: logo, badges, text-only buttons | Dev | Per IMPLEMENTATION_STATUS. |
| **P2** | Footer: compress, layout, company details, social | Dev | Per REMAINING_CLIENT_NOTES. |
| **P2** | Color/token alignment (UI_AUDIT) | Dev | Single brown; StickySummary elysium; body bg. |
| **P3** | Rollback runbook | Dev/DevOps | Documented steps to revert deploy. |
| **P3** | Client handover doc | PM | Single doc: what's done, what's client's, contacts, support. |
| **P3** | Sanity product guide | Dev | "How to add a product" for client. |

---

## 5. Launch & Rollback Plan

### Pre-Launch (T-1 week)

1. Complete all P0 items.
2. Run full LAUNCH_CHECKLIST phases 1–7.
3. Test checkout with Stripe test mode on staging.
4. Verify env vars in Vercel (no demo admin, correct NEXTAUTH_URL).
5. Create database backup before go-live.

### Launch Day

1. **Final deploy**
   - Push to `main` (or production branch).
   - Vercel auto-deploys.
   - Run `prisma migrate deploy` if schema changed.

2. **Smoke test**
   - Homepage loads.
   - Add to cart → checkout → pay with live card (small amount).
   - Verify order in admin; webhook received.

3. **Monitor**
   - Vercel logs, Stripe dashboard, Plausible (if configured).
   - Watch for 5xx, failed webhooks, auth errors.

### Rollback Plan

| Step | Action |
|------|--------|
| 1 | Identify issue (site down, payments failing, data corruption). |
| 2 | **Vercel:** Project → Deployments → find last known good → "Promote to Production". |
| 3 | **Database:** If migration caused issues, restore from backup (Vercel Postgres has point-in-time). |
| 4 | **Stripe:** If webhook misconfigured, fix secret and redeploy; no rollback needed. |
| 5 | **Env:** Revert env var changes in Vercel if they caused the issue. |
| 6 | Communicate to client; post-mortem after stabilisation. |

### Rollback Runbook (To Create)

```
# ELYSIUM Rollback Runbook

## Quick rollback (code only)
1. Go to vercel.com → Project → Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

## Database rollback
1. Vercel Dashboard → Storage → Postgres
2. Use point-in-time recovery if available
3. Or: restore from manual backup

## Contact
- Vercel support: [status.vercel.com]
- Stripe support: [status.stripe.com]
```

---

## Summary

- **Launch blockers:** 7 items (missing pages, Footer prop, metadata, Stripe, inquiry, engraving, Prisma).
- **High-risk:** Demo admin, DISABLE_ADMIN_AUTH, env/config, migrations, webhooks.
- **Docs:** Good coverage; missing rollback and incident runbooks, consolidated handover.
- **Remaining work:** Prioritised P0–P3 with owners and acceptance criteria.
- **Launch plan:** Pre-launch checklist, smoke test, monitoring.
- **Rollback:** Vercel promote previous deploy; DB restore; env revert.

---

*Sync with LAUNCH_CHECKLIST.md, REMAINING_CLIENT_NOTES.md, and IMPLEMENTATION_STATUS.md.*
