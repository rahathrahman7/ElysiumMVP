# AGENTS.md

## Cursor Cloud specific instructions

### Architecture
Single Next.js 16 application (App Router + Turbopack) with PostgreSQL via Prisma ORM 7. Not a monorepo. See `README.md` for tech stack details.

### Node version
The `.nvmrc` says 18.18.0, but **Prisma 7 requires Node 20+** due to ESM compatibility (`@prisma/dev` uses `require()` on ESM modules that fail on Node 18). Use Node 20 via nvm.

### Database
Local PostgreSQL 16 is used for development. The database, user, and schema must be set up before the dev server works with auth/cart/orders:
```
sudo pg_ctlcluster 16 main start
sudo -u postgres psql -c "CREATE USER elysium WITH PASSWORD 'elysium_dev' CREATEDB;"
sudo -u postgres psql -c "CREATE DATABASE elysium_dev OWNER elysium;"
```
Then set `DATABASE_URL=postgresql://elysium:elysium_dev@localhost:5432/elysium_dev` in both `.env` (for Prisma CLI) and `.env.local` (for Next.js). Run `pnpm db:generate && DATABASE_URL=... pnpm db:push` to create tables.

### Environment variables
Copy `.env.example` to `.env.local`. Required for basic dev: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`. Sanity CMS is optional (product data falls back to `lib/products.ts`). Stripe/Resend/Plausible are optional.

Prisma CLI reads from `.env` (not `.env.local`), so `DATABASE_URL` must also be in `.env` or exported as an env var when running `prisma` commands.

### Lint
`next lint` was removed in Next.js 16. Run ESLint directly: `npx eslint . --ext .ts,.tsx,.js,.jsx`. There are ~34 pre-existing lint warnings/errors (unescaped entities, hooks deps).

### TypeScript
`pnpm typecheck` runs `tsc --noEmit`. There are ~38 pre-existing type errors. The project builds anyway because `next.config.mjs` sets `typescript.ignoreBuildErrors: true`.

### Dev server
`pnpm dev` starts the Next.js dev server on port 3000. Ensure PostgreSQL is running first.

### Tests
Playwright smoke tests at `tests/smoke.spec.ts`. Run with `pnpm exec playwright test`.
