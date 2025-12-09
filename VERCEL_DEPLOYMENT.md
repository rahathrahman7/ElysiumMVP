# Vercel Deployment Guide - ELYSIUM MVP

This guide covers the most efficient way to deploy your ELYSIUM MVP to Vercel.

## Quick Deploy (Recommended)

### Option 1: Using Vercel CLI (Fastest)

1. **Deploy directly from your project root:**
   ```bash
   npx vercel
   ```
   
2. **Follow the prompts:**
   - Link to existing project or create new
   - Confirm project settings (auto-detected)
   - Deploy to production: `npx vercel --prod`

### Option 2: Git Integration (Automatic Deployments)

1. **Connect your Git repository to Vercel:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your Git repository
   - Vercel will auto-detect Next.js settings

2. **Configure environment variables** (see below)
   - Go to Project Settings → Environment Variables
   - Add all required variables

3. **Push to main branch** to trigger automatic deployment

## Required Environment Variables

Set these in **Vercel Dashboard → Project Settings → Environment Variables**:

### Database (Vercel Postgres)

1. **Create Vercel Postgres Database:**
   - Go to Vercel Dashboard → Storage → Create Database
   - Select **Postgres**
   - Choose region (e.g., `eu-west-1` for EU)
   - Name: `elysium-production`
   - Copy all connection strings

2. **Add Database Variables:**
   ```
   DATABASE_URL=<from-vercel-postgres>
   POSTGRES_URL=<from-vercel-postgres>
   POSTGRES_PRISMA_URL=<from-vercel-postgres>
   POSTGRES_URL_NON_POOLING=<from-vercel-postgres>
   ```

### Authentication (NextAuth.js)

```
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=<generate-with: openssl rand -base64 32>
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### Sanity CMS

```
NEXT_PUBLIC_SANITY_PROJECT_ID=<your-sanity-project-id>
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=<your-sanity-api-token>
```

### Stripe

```
STRIPE_SECRET_KEY=sk_live_... (or sk_test_... for testing)
STRIPE_PUBLISHABLE_KEY=pk_live_... (or pk_test_... for testing)
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Email (Resend)

```
RESEND_API_KEY=re_...
```

### App Configuration

```
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NODE_ENV=production
```

### Optional

```
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=<your-domain>
CONTEXT7_API_KEY=<if-using-context7>
```

## Post-Deployment Steps

### 1. Run Database Migrations

After first deployment, you need to run Prisma migrations:

```bash
# Option A: Using Vercel CLI (recommended)
npx vercel env pull .env.local
npx prisma migrate deploy

# Option B: Using Vercel Dashboard
# Connect via Vercel Postgres → Query Editor, then run:
# Or use Prisma Studio: npx prisma studio
```

### 2. Seed Database (Optional)

```bash
# Pull environment variables
npx vercel env pull .env.local

# Run seed scripts
npm run db:seed
npm run db:seed:inventory
```

### 3. Configure Stripe Webhooks

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Add endpoint: `https://your-domain.vercel.app/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
4. Copy webhook signing secret to Vercel environment variables

### 4. Update NextAuth URL

After deployment, update `NEXTAUTH_URL` to your production domain:
```
NEXTAUTH_URL=https://your-domain.vercel.app
```

## Build Configuration

The project is configured with:
- ✅ `postinstall` script: Automatically generates Prisma client
- ✅ `build` script: Includes Prisma generation + Next.js build
- ✅ Auto-detected Next.js 15 framework
- ✅ Node.js 18+ specified in `package.json`

## Troubleshooting

### Build Fails with Prisma Error
- Ensure `DATABASE_URL` is set in environment variables
- Check that Prisma can connect during build (migrations run separately)

### Database Connection Issues
- Verify all 4 database connection strings are set
- Use `POSTGRES_PRISMA_URL` for the app, `POSTGRES_URL_NON_POOLING` for migrations

### NextAuth Issues
- Verify `NEXTAUTH_URL` matches your deployment URL exactly
- Ensure `NEXTAUTH_SECRET` is set and different from development

### Missing Environment Variables
- All variables from `.env.example` must be set in Vercel Dashboard
- Variables prefixed with `NEXT_PUBLIC_` are exposed to client-side

## Deployment Commands Reference

```bash
# Initial deployment
npx vercel

# Production deployment
npx vercel --prod

# Preview deployment
npx vercel

# Pull environment variables locally
npx vercel env pull .env.local

# View deployments
npx vercel ls

# View logs
npx vercel logs [deployment-url]
```

## Performance Optimization

Vercel automatically optimizes Next.js 15 with:
- ✅ Edge Runtime for API routes (when configured)
- ✅ Automatic image optimization
- ✅ Static generation for static pages
- ✅ Server-side rendering for dynamic pages
- ✅ Built-in CDN caching

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Set environment variables
3. ✅ Run database migrations
4. ✅ Seed database (if needed)
5. ✅ Configure Stripe webhooks
6. ✅ Test production deployment
7. ✅ Set up custom domain (optional)

---

**Note:** Your `.vercelignore` file excludes unnecessary directories from deployment, keeping deployments fast and secure.

