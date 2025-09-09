## ELYSIUM — Luxury Jewellery Storefront

Next.js 15 + Tailwind v4 + Sanity + Stripe + SWR + Zustand + Resend + next-seo + Plausible.

### Quick start
- pnpm install
- Create `.env.local` with:
```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
```
- pnpm dev

### Sanity
- Configure project and dataset, then seed: `pnpm sanity:seed`

### Stripe
- Uses `/api/checkout` to create a Checkout Session.

### Bespoke
- `/api/bespoke` sends email (Resend) and creates `lead` in Sanity.

### SEO & Analytics
- next-seo default config and JSON-LD on Home and PDP.
- Plausible loads when `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is set.

### Tests
- Playwright smoke at `tests/smoke.spec.ts` (do not run locally here).










