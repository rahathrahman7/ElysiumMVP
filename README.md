## ELYSIUM — Luxury Jewellery E-commerce Platform

A production-ready luxury jewelry e-commerce platform built with Next.js 16, featuring a complete backend with PostgreSQL, NextAuth.js authentication, Stripe payments, and comprehensive order management.

### Tech Stack

**Frontend:**
- Next.js 16 (App Router + Turbopack) + Tailwind CSS 3.4
- SWR + Zustand + GSAP
- Plausible Analytics

**Backend:**
- PostgreSQL (Vercel Postgres) + Prisma ORM 7
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

See [.env.example](./.env.example) for all required variables.

3. **Set up database**
```bash
pnpm db:generate  # Generate Prisma client
pnpm db:push      # Push schema to database
```

4. **Run development server**
```bash
pnpm dev
```

Visit `http://localhost:3000`

## 📊 Project Status

**Overall Completion: 85%** | [View Full Status](./PROJECT_STATUS_OVERVIEW.md)

- ✅ Frontend & UI/UX (100%)
- ✅ Backend & Database (100%)
- ✅ Authentication (100%)
- ✅ Payment Processing (100%)
- 🟡 Testing (60%)
- ✅ Deployment (100%) - Live on Vercel

**Next Step:** Database provisioning (30 min) → [Setup Guide](./docs/BACKEND_SETUP.md)

### Backend Features

✅ **Authentication** - Email/password + Google OAuth
✅ **Shopping Cart** - Persistent storage with configuration saving
✅ **Order Management** - Complete lifecycle with Stripe integration
✅ **Inventory** - Stock tracking with reserved stock
✅ **Customer Features** - Wishlist, recently viewed, address management
✅ **Bespoke Enquiries** - Lead capture with email notifications

See [docs/BACKEND_SUMMARY.md](./docs/BACKEND_SUMMARY.md) for complete details.

### Documentation

- [Backend Setup Guide](./docs/BACKEND_SETUP.md) - Complete deployment instructions
- [API Reference](./docs/API_REFERENCE.md) - All API endpoints
- [Backend Summary](./docs/BACKEND_SUMMARY.md) - Architecture overview
- [Technical Specification](./docs/technical-specification-database-architecture.md)

### Database Scripts

```bash
pnpm db:generate    # Generate Prisma client
pnpm db:migrate     # Run migrations (dev)
pnpm db:push        # Push schema to database
pnpm db:studio      # Open Prisma Studio
```

### Sanity
- Configure project and dataset, then seed: `pnpm sanity:seed`

### Stripe
- Enhanced checkout with order tracking
- Webhook handlers for payment events

### Tests
- Playwright smoke at `tests/smoke.spec.ts`

### MCP (Context7)
- Project-level MCP config for Cursor in `.cursor/mcp.json`
- Set `CONTEXT7_API_KEY` for higher rate limits
- Local run: `pnpm context7:mcp`














