## ELYSIUM — Luxury Jewellery E-commerce Platform

A production-ready luxury jewelry e-commerce platform built with Next.js 16, featuring a complete backend with PostgreSQL, NextAuth.js authentication, Stripe payments, and comprehensive order management.

### Tech Stack

**Frontend:**
- Next.js 16 (App Router + Turbopack) + Tailwind CSS 3.4
- SWR + Zustand + GSAP
- Plausible Analytics

**Backend:**
- PostgreSQL (Supabase Postgres) + Prisma ORM 7
- NextAuth.js 4 + Stripe API + Resend

**CMS:**
- Sanity CMS

### Quick Start

1. **Install dependencies**
```bash
pnpm install
```

2. **Set up environment variables**
```bash
cp .env.example .env.local
```

See [.env.example](./.env.example) for all required variables. Wipe/reset/migrate/seed scripts refuse remote/prod Supabase hosts — use localhost, `127.0.0.1`, Docker, or `ALLOWED_TEST_DB_HOSTS`.

3. **Set up database**
```bash
pnpm db:generate  # Generate Prisma client
pnpm db:push      # Push schema to an allowlisted local/test database
```

4. **Run development server**
```bash
pnpm dev
```

Visit `http://localhost:3000`

## Project Status

**Overall Completion: 85%** | [View Full Status](./PROJECT_STATUS_OVERVIEW.md)

- Frontend & UI/UX (100%)
- Backend & Database (100%)
- Authentication (100%)
- Payment Processing (100%)
- Testing (unit guards + Playwright smoke)
- Deployment (100%) - Live on Vercel

**Next Step:** Database provisioning (30 min) → [Setup Guide](./docs/BACKEND_SETUP.md)

### Backend Features

- **Authentication** - Email/password + Google OAuth
- **Shopping Cart** - Persistent storage with configuration saving
- **Order Management** - Complete lifecycle with Stripe integration
- **Inventory** - Stock tracking with reserved stock (admin inventory API is stock-only)
- **Customer Features** - Wishlist, recently viewed, address management
- **Bespoke Enquiries** - Lead capture with email notifications

See [docs/BACKEND_SUMMARY.md](./docs/BACKEND_SUMMARY.md) for complete details.

### Documentation

- [Backend Setup Guide](./docs/BACKEND_SETUP.md) - Complete deployment instructions
- [API Reference](./docs/API_REFERENCE.md) - All API endpoints
- [Backend Summary](./docs/BACKEND_SUMMARY.md) - Architecture overview
- [Technical Specification](./docs/technical-specification-database-architecture.md)

### Database Scripts

These commands refuse to run against prod Supabase. They only accept localhost / `127.0.0.1` / Docker hosts, or a host in `ALLOWED_TEST_DB_HOSTS`.

```bash
pnpm db:generate      # Generate Prisma client
pnpm db:migrate       # Run migrations (dev, allowlisted DB)
pnpm db:push          # Push schema to an allowlisted database
pnpm db:studio        # Open Prisma Studio
pnpm db:seed          # Guarded no-op seed (refuses production)
pnpm db:seed:tmc      # Upsert TMC review/match JSON (allowlisted DB only)
pnpm db:create-admin  # ADMIN_EMAIL + ADMIN_PASSWORD (>=12 chars)
```

### TMC review access (`/tmc-review`, `/tmc-review/match`)

The review UI and write APIs (`/api/tmc-review`, `/api/tmc-matches`) require a login. Unauthenticated GET/POST return 401. There are currently no application users in the database, so pick **one** of:

1. **Client passcode (simplest):** set `TMC_REVIEW_PASSCODE` and `NEXTAUTH_SECRET` on Vercel. Send the client `https://<host>/tmc-review/login` and the passcode. This sets an httpOnly cookie (7 days).
2. **Admin user:** on an allowlisted local DB, run `ADMIN_EMAIL=... ADMIN_PASSWORD=... pnpm db:create-admin`, then sign in with that email (role `ADMIN`).
3. **Allowlisted client email:** create a NextAuth user and set `TMC_REVIEW_ALLOWED_EMAILS=client@their-domain`.

`DISABLE_ADMIN_AUTH` and `DEMO_ADMIN_EMAIL` / `DEMO_ADMIN_PASSWORD` **never take effect** when `NODE_ENV` or `VERCEL_ENV` is `production`.

### Cron routes

There are no scheduled API routes yet. Any future `/api/cron/*` handler must call `authorizeCronRequest` in `lib/safety/cron-auth.ts`. Requests fail closed if `CRON_SECRET` is unset (including `Authorization: Bearer undefined`). Set `CRON_SECRET` on Vercel before adding crons.

### Sanity
- Configure project and dataset, then seed: `pnpm sanity:seed` (refuses production runtime unless `ALLOW_PRODUCTION_SEED=true`)

### Stripe
- Enhanced checkout with order tracking
- Webhook handlers for payment events
- Browser tests refuse `sk_live` / `pk_live`

### Tests

```bash
pnpm test          # Vitest unit tests (guards + TMC review auth)
pnpm lint
pnpm typecheck
pnpm test:e2e      # Playwright — requires .env.e2e (see .env.e2e.example)
```

- Unit/integration tests that touch Postgres require `TEST_DATABASE_URL` and never fall back to `DATABASE_URL`.
- Playwright loads `.env.e2e` only and refuses live Stripe keys and Supabase/prod DB hosts.
- Playwright smoke lives at `tests/smoke.spec.ts`.

### MCP (Context7)
- Project-level MCP config for Cursor in `.cursor/mcp.json`
- Set `CONTEXT7_API_KEY` for higher rate limits
- Local run: `pnpm context7:mcp`
