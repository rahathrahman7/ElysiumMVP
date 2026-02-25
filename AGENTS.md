# AGENTS.md

## Cursor Cloud specific instructions

### Overview
ELYSIUM is a luxury jewelry e-commerce platform built with Next.js 16 (App Router), PostgreSQL (Prisma ORM 7), and Tailwind CSS. See `README.md` for the full tech stack.

### Node.js version
The `.nvmrc` specifies Node 18.18.0, but **Prisma 7 requires Node 20+** due to ESM compatibility issues with `zeptomatch`. Use Node 20 LTS (`nvm use 20`).

### Key gotchas
- **`next lint` does not exist in Next.js 16.** The `pnpm lint` script calls `next lint`, which fails. Use `npx eslint . --ext .ts,.tsx,.js,.jsx` directly instead.
- **Prisma CLI does not read `.env.local`.** It reads `.env` or needs `DATABASE_URL` exported in the shell. The `prisma.config.ts` falls back to a placeholder URL if `DATABASE_URL` is not set in the process environment.
- **The app runs without a database.** The Prisma client in `lib/database/prisma.ts` returns a proxy stub when `DATABASE_URL` is missing, so the dev server starts and serves pages. However, any DB-dependent features (auth, cart persistence, orders) will silently return null.
- **The app runs without Sanity CMS.** Product data comes from `lib/products.ts` when Sanity is not configured.
- **Pre-existing lint/type errors exist in the codebase.** Both `eslint` and `tsc --noEmit` report errors that are not regressions.

### Running services
- **Dev server:** `pnpm dev` → http://localhost:3000
- **PostgreSQL:** Ensure the service is started (`sudo service postgresql start`) and `DATABASE_URL` is exported.
- **Lint:** `npx eslint . --ext .ts,.tsx,.js,.jsx` (not `pnpm lint`)
- **Typecheck:** `pnpm typecheck`
- **Playwright tests:** `npx playwright test` (auto-starts dev server; install browsers first with `npx playwright install chromium --with-deps`)

### Database
Local PostgreSQL with user `elysium`, password `elysium123`, database `elysium_dev`. Connection string: `postgresql://elysium:elysium123@localhost:5432/elysium_dev`. Run `npx prisma db push` (with `DATABASE_URL` exported) to sync the schema.
