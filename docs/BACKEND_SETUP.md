# ELYSIUM Backend Setup Guide

## Overview

This guide covers the complete setup of the ELYSIUM backend infrastructure, including database configuration, authentication, and deployment.

## Prerequisites

- Node.js >= 18.18.0
- pnpm package manager
- Vercel account (for hosting and database)
- Stripe account
- Resend account (for emails)

## 1. Database Setup (Vercel Postgres)

### Step 1: Create Vercel Postgres Database

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to Storage > Create Database
3. Select **Postgres**
4. Choose a region close to your users (UK/EU recommended)
5. Name your database: `elysium-production`

### Step 2: Get Connection Strings

After creating the database, you'll receive several connection strings:

- `POSTGRES_URL` - Direct connection (with connection pooling)
- `POSTGRES_PRISMA_URL` - Optimized for Prisma
- `POSTGRES_URL_NON_POOLING` - Direct connection without pooling
- `DATABASE_URL` - Same as POSTGRES_PRISMA_URL

### Step 3: Add to Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Add your database connection strings to `.env.local`:

```env
DATABASE_URL="your-postgres-prisma-url"
POSTGRES_URL="your-postgres-url"
POSTGRES_PRISMA_URL="your-postgres-prisma-url"
POSTGRES_URL_NON_POOLING="your-postgres-url-non-pooling"
```

## 2. Run Database Migrations

Generate Prisma client and run migrations:

```bash
# Generate Prisma Client
pnpm prisma generate

# Run migrations (creates all tables)
pnpm prisma migrate dev --name init

# Or if using Vercel Postgres in production
pnpm prisma db push
```

### View Database

```bash
# Open Prisma Studio to view/edit data
pnpm prisma studio
```

## 3. Authentication Setup (NextAuth.js)

### Step 1: Generate NextAuth Secret

```bash
openssl rand -base64 32
```

### Step 2: Add to .env.local

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET="your-generated-secret"
```

### Step 3: (Optional) Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

Add to `.env.local`:

```env
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## 4. Stripe Configuration

### Development Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Switch to **Test Mode**
3. Get your test keys from Developers > API keys

```env
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

### Webhook Setup

1. Install Stripe CLI: `brew install stripe/stripe-cli/stripe`
2. Login: `stripe login`
3. Forward webhooks to local:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

4. Copy the webhook signing secret:

```env
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### Production Webhooks

1. Go to Stripe Dashboard > Developers > Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
4. Copy signing secret to production environment variables

## 5. Email Setup (Resend)

1. Go to [Resend](https://resend.com/)
2. Create API key
3. Add to `.env.local`:

```env
RESEND_API_KEY="re_..."
```

4. Update sender email in [app/api/bespoke/route.ts](../app/api/bespoke/route.ts):
   - Change `studio@elysium.example` to your verified domain email

## 6. Complete Environment Variables

Your final `.env.local` should look like:

```env
# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://..."
POSTGRES_URL="postgresql://..."
POSTGRES_PRISMA_URL="postgresql://..."
POSTGRES_URL_NON_POOLING="postgresql://..."

# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET="your-secret"
GOOGLE_CLIENT_ID="optional"
GOOGLE_CLIENT_SECRET="optional"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email
RESEND_API_KEY="re_..."

# Sanity (existing)
NEXT_PUBLIC_SANITY_PROJECT_ID="your-project-id"
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN="your-token"

# Analytics
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=""
```

## 7. Run the Application

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Visit `http://localhost:3000`

## 8. Testing the Backend

### Test Authentication

```bash
# Register a new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### Test Cart APIs

First, sign in at `http://localhost:3000/api/auth/signin` to get a session.

```bash
# Add to cart (requires authentication)
curl -X POST http://localhost:3000/api/cart \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{
    "productSlug": "seraphina-signature-six-claw",
    "configuration": {
      "metal": "18k-yellow-gold",
      "size": "M",
      "diamond": {
        "shape": "round",
        "carat": 1.5,
        "color": "D",
        "clarity": "VVS1"
      }
    },
    "quantity": 1
  }'
```

## 9. Database Seeding (Optional)

Create seed file at `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create test user
  const hashedPassword = await bcrypt.hash('password123', 12);

  const user = await prisma.user.create({
    data: {
      email: 'test@elysium.com',
      name: 'Test User',
      password: hashedPassword,
    }
  });

  // Create test inventory
  await prisma.inventory.createMany({
    data: [
      {
        productSlug: 'seraphina-signature-six-claw',
        variantKey: '18k-yellow-gold-M',
        stockLevel: 10,
        lowStockThreshold: 2,
      },
      {
        productSlug: 'luna-low-set-solitaire',
        variantKey: '18k-white-gold-L',
        stockLevel: 5,
        lowStockThreshold: 2,
      }
    ]
  });

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Run seed:

```bash
pnpm prisma db seed
```

## 10. Deployment to Vercel

### Step 1: Connect Repository

1. Push code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Import your repository

### Step 2: Add Environment Variables

In Vercel project settings, add all production environment variables:

- Update `NEXT_PUBLIC_SITE_URL` to your production domain
- Update `NEXTAUTH_URL` to your production domain
- Use production Stripe keys
- Add production webhook secrets

### Step 3: Deploy

Vercel will automatically deploy on push to main branch.

## 11. Post-Deployment Tasks

### Run Migrations on Production

```bash
pnpm prisma migrate deploy
```

Or use `prisma db push` for Vercel Postgres:

```bash
pnpm prisma db push
```

### Test Production APIs

```bash
# Test health
curl https://yourdomain.com/api/health

# Test product inventory
curl https://yourdomain.com/api/inventory?productSlug=seraphina-signature-six-claw
```

## API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth endpoints (login, logout, etc.)
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add to cart
- `PUT /api/cart/[id]` - Update cart item
- `DELETE /api/cart/[id]` - Remove from cart
- `DELETE /api/cart` - Clear cart

### Orders
- `POST /api/checkout` - Create checkout session
- `GET /api/orders` - Get user orders
- `GET /api/orders/[id]` - Get specific order

### Wishlist
- `GET /api/wishlist` - Get wishlist
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist?productSlug=...` - Remove from wishlist

### Inventory
- `GET /api/inventory?productSlug=...` - Get product inventory
- `GET /api/inventory?productSlug=...&variantKey=...&quantity=1` - Check availability

### Analytics
- `POST /api/analytics/track-view` - Track product view
- `GET /api/analytics/recently-viewed` - Get recently viewed products

### Webhooks
- `POST /api/webhooks/stripe` - Stripe webhook handler

## Troubleshooting

### Database Connection Issues

```bash
# Test connection
pnpm prisma db pull

# Reset database (WARNING: deletes all data)
pnpm prisma migrate reset
```

### Prisma Client Issues

```bash
# Regenerate client
pnpm prisma generate

# Clear cache
rm -rf node_modules/.prisma
pnpm install
```

### NextAuth Session Issues

1. Clear cookies
2. Verify `NEXTAUTH_SECRET` is set
3. Check `NEXTAUTH_URL` matches your domain

## Security Checklist

- [ ] All environment variables are in `.env.local` (not committed)
- [ ] `NEXTAUTH_SECRET` is strong and unique
- [ ] Stripe webhook secret is configured
- [ ] Database uses SSL in production
- [ ] Production Stripe keys (not test keys)
- [ ] Email sender domain is verified
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled (consider adding)

## Next Steps

1. Implement rate limiting for API endpoints
2. Add Redis caching for session storage
3. Set up monitoring (Sentry, LogRocket)
4. Configure backup strategy for database
5. Implement admin dashboard for order management
6. Add email templates for order confirmations
7. Set up CI/CD pipeline for testing

## Support

For issues or questions:
- Check the [Technical Specification](./technical-specification-database-architecture.md)
- Review [API Documentation](./architecture/api-documentation.md)
- See [Architecture Diagrams](./architecture/component-diagrams.md)
