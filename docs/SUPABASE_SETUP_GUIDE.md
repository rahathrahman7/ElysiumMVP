# Supabase Database Setup Guide

Complete guide for setting up Supabase with MCP integration for ELYSIUM MVP.

## Prerequisites

- Node.js 18.18.0 or higher
- pnpm package manager
- A Supabase account (free tier is sufficient to start)

## Step 1: Create a Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Fill in the project details:
   - **Project Name**: `elysium-mvp` (or your preferred name)
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to your users (e.g., `eu-west-2` for UK)
   - **Pricing Plan**: Free tier is fine for development

4. Wait for the project to be created (takes ~2 minutes)

## Step 2: Get Your Database Connection String

1. In your Supabase project dashboard, go to **Settings** → **Database**
2. Scroll down to **Connection String** section
3. Select the **URI** tab (not Transaction pooler)
4. Copy the connection string that looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
5. Replace `[YOUR-PASSWORD]` with the database password you created

### Connection String Format

Your connection string should look like this:
```
postgresql://postgres:your_actual_password@db.abcdefghijklmnop.supabase.co:5432/postgres
```

**Important:**
- Use the **direct connection** URL (port 5432), not the pooled connection
- Make sure to URL-encode special characters in your password

## Step 3: Configure Environment Variables

1. Open your `.env` file in the project root
2. Add your Supabase connection string:

```bash
# Database (Supabase)
DATABASE_URL="postgresql://postgres:your_password@db.your-project-ref.supabase.co:5432/postgres"
```

3. For production, also set:
```bash
# Supabase Direct Connection (for migrations)
POSTGRES_URL_NON_POOLING="postgresql://postgres:your_password@db.your-project-ref.supabase.co:5432/postgres"

# Supabase Pooled Connection (for app queries)
POSTGRES_PRISMA_URL="postgresql://postgres:your_password@db.your-project-ref.supabase.co:6543/postgres?pgbouncer=true"
```

**Note:** The `.env` file is gitignored. Never commit your actual connection strings to version control.

## Step 4: Initialize the Database

Now that your Supabase connection is configured, let's create the database schema:

### Generate Prisma Client

```bash
pnpm db:generate
```

This generates the Prisma client based on your schema.

### Push Schema to Database

```bash
pnpm db:push
```

This command will:
- Connect to your Supabase database
- Create all tables defined in your Prisma schema
- Set up all relationships, indexes, and constraints

You should see output like:
```
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database

🚀  Your database is now in sync with your Prisma schema. Done in XXXms

✔ Generated Prisma Client
```

## Step 5: Verify Your Database

### Option 1: Using Prisma Studio

Open Prisma Studio to visually inspect your database:

```bash
pnpm db:studio
```

This opens a browser interface at `http://localhost:5555` where you can:
- View all tables
- Inspect schema
- Add test data
- Run queries

### Option 2: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Click **Table Editor** in the left sidebar
3. You should see all your tables:
   - users
   - accounts
   - sessions
   - verification_tokens
   - customer_profiles
   - addresses
   - cart_items
   - orders
   - order_items
   - inventory
   - wishlist_items
   - product_views
   - bespoke_leads

### Option 3: Using Supabase MCP (Recommended)

With the MCP integration configured, you can query your database directly:

1. Restart Claude Code to load the MCP configuration
2. You should now have access to database tools through MCP
3. You can query tables, inspect schema, and manage data directly

## Step 6: Seed Initial Data (Optional)

If you want to populate your database with initial data:

```bash
pnpm db:seed
```

Make sure you create the seed file first at `prisma/seed.ts`.

## Database Schema Overview

Your ELYSIUM database includes:

### Authentication Tables
- **users**: User accounts
- **accounts**: OAuth provider accounts
- **sessions**: Active user sessions
- **verification_tokens**: Email verification tokens

### E-commerce Tables
- **customer_profiles**: Extended user profile data
- **addresses**: Billing and shipping addresses
- **cart_items**: Shopping cart items
- **orders**: Order records
- **order_items**: Individual items in orders
- **inventory**: Stock tracking for product variants

### Engagement Tables
- **wishlist_items**: User wishlist
- **product_views**: Product view tracking
- **bespoke_leads**: Custom jewelry enquiries

## Common Commands

```bash
# Generate Prisma client after schema changes
pnpm db:generate

# Push schema changes to database
pnpm db:push

# Create a migration (for production)
pnpm db:migrate

# Open Prisma Studio
pnpm db:studio

# Seed database with initial data
pnpm db:seed
```

## Troubleshooting

### Connection Issues

**Error: "Can't reach database server"**
- Check your internet connection
- Verify your connection string is correct
- Make sure the database password is URL-encoded
- Check if Supabase is experiencing downtime

**Error: "Invalid DATABASE_URL"**
- Ensure the connection string is properly formatted
- Check for spaces or line breaks in the URL
- Verify the password doesn't contain unescaped special characters

### Schema Issues

**Error: "Table already exists"**
- Use `pnpm db:push` to sync schema (it handles existing tables)
- Or reset the database in Supabase dashboard and run push again

### Authentication Issues

**Error: "Password authentication failed"**
- Double-check your database password
- URL-encode special characters in password
- Reset password in Supabase dashboard if needed

## Security Best Practices

1. **Never commit `.env` file** - It contains sensitive credentials
2. **Use different databases** for development and production
3. **Enable Row Level Security (RLS)** in Supabase for production
4. **Rotate passwords regularly** in production environments
5. **Use connection pooling** in production (via POSTGRES_PRISMA_URL)
6. **Monitor database usage** in Supabase dashboard

## Next Steps

After setting up your database:

1. ✅ Database schema created
2. 🔄 Set up NextAuth.js authentication
3. 🔄 Implement API routes for cart, orders, etc.
4. 🔄 Add Stripe payment integration
5. 🔄 Set up email notifications with Resend
6. 🔄 Configure database backups

## Useful Links

- [Supabase Dashboard](https://app.supabase.com)
- [Supabase Documentation](https://supabase.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [MCP Documentation](https://modelcontextprotocol.io/)

## Support

If you encounter issues:
1. Check the [Supabase Status Page](https://status.supabase.com/)
2. Review [Prisma Common Errors](https://www.prisma.io/docs/reference/api-reference/error-reference)
3. Check the Supabase Dashboard logs
4. Review your `.env` configuration

---

**Last Updated:** December 8, 2025
**Project:** ELYSIUM MVP
**Database Provider:** Supabase PostgreSQL
