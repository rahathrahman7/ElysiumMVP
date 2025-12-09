-- ============================================
-- ELYSIUM MVP - Database Improvements
-- ============================================
-- This file contains recommended improvements for:
-- 1. Row Level Security (RLS) policies
-- 2. Database triggers for timestamp management
-- 3. Additional performance optimizations
-- 4. Utility functions

-- ============================================
-- 1. ENABLE ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all user-related tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE bespoke_leads ENABLE ROW LEVEL SECURITY;

-- Note: inventory table can remain without RLS as it's managed by admin/system

-- ============================================
-- 2. RLS POLICIES - USERS TABLE
-- ============================================

-- Users can only read their own data
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Service role can manage all users
CREATE POLICY "Service role can manage users"
  ON users FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- 3. RLS POLICIES - ACCOUNTS & SESSIONS
-- ============================================

-- Users can only see their own OAuth accounts
CREATE POLICY "Users can view own accounts"
  ON accounts FOR SELECT
  USING (auth.uid() = "userId");

CREATE POLICY "Service role can manage accounts"
  ON accounts FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Users can only see their own sessions
CREATE POLICY "Users can view own sessions"
  ON sessions FOR SELECT
  USING (auth.uid() = "userId");

CREATE POLICY "Service role can manage sessions"
  ON sessions FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- 4. RLS POLICIES - CUSTOMER PROFILES
-- ============================================

CREATE POLICY "Users can view own profile"
  ON customer_profiles FOR SELECT
  USING (auth.uid() = "userId");

CREATE POLICY "Users can update own profile"
  ON customer_profiles FOR UPDATE
  USING (auth.uid() = "userId");

CREATE POLICY "Users can insert own profile"
  ON customer_profiles FOR INSERT
  WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Service role can manage profiles"
  ON customer_profiles FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- 5. RLS POLICIES - ADDRESSES
-- ============================================

CREATE POLICY "Users can view own addresses"
  ON addresses FOR SELECT
  USING (auth.uid() = "userId");

CREATE POLICY "Users can manage own addresses"
  ON addresses FOR ALL
  USING (auth.uid() = "userId");

CREATE POLICY "Service role can manage addresses"
  ON addresses FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- 6. RLS POLICIES - CART ITEMS
-- ============================================

CREATE POLICY "Users can view own cart"
  ON cart_items FOR SELECT
  USING (auth.uid() = "userId");

CREATE POLICY "Users can manage own cart"
  ON cart_items FOR ALL
  USING (auth.uid() = "userId");

CREATE POLICY "Service role can manage carts"
  ON cart_items FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- 7. RLS POLICIES - WISHLIST
-- ============================================

CREATE POLICY "Users can view own wishlist"
  ON wishlist_items FOR SELECT
  USING (auth.uid() = "userId");

CREATE POLICY "Users can manage own wishlist"
  ON wishlist_items FOR ALL
  USING (auth.uid() = "userId");

CREATE POLICY "Service role can manage wishlists"
  ON wishlist_items FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- 8. RLS POLICIES - ORDERS
-- ============================================

-- Users can view their own orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = "userId");

-- Only service role can create/update orders (via checkout)
CREATE POLICY "Service role can manage orders"
  ON orders FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Order items follow the same pattern as orders
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items."orderId"
      AND orders."userId" = auth.uid()
    )
  );

CREATE POLICY "Service role can manage order items"
  ON order_items FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- 9. RLS POLICIES - PRODUCT VIEWS (Analytics)
-- ============================================

-- Product views are write-only for users, read by service
CREATE POLICY "Users can create product views"
  ON product_views FOR INSERT
  WITH CHECK (auth.uid() = "userId" OR "userId" IS NULL);

CREATE POLICY "Service role can manage product views"
  ON product_views FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- 10. RLS POLICIES - BESPOKE LEADS
-- ============================================

-- Bespoke leads are created by anyone, managed by service
CREATE POLICY "Anyone can create bespoke leads"
  ON bespoke_leads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can manage bespoke leads"
  ON bespoke_leads FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- 11. UPDATED_AT TRIGGER FUNCTION
-- ============================================

-- Create a function to automatically update updatedAt timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updatedAt column
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_profiles_updated_at
    BEFORE UPDATE ON customer_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at
    BEFORE UPDATE ON addresses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at
    BEFORE UPDATE ON cart_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bespoke_leads_updated_at
    BEFORE UPDATE ON bespoke_leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 12. ENABLE PG_TRGM EXTENSION FOR SEARCH
-- ============================================

-- Enable trigram extension for better search capabilities
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create indexes for product search (if needed in future)
-- Example: CREATE INDEX idx_product_name_trgm ON products USING GIN (name gin_trgm_ops);

-- ============================================
-- 13. UTILITY FUNCTIONS
-- ============================================

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    new_number TEXT;
    year_part TEXT;
    counter INT;
BEGIN
    year_part := TO_CHAR(CURRENT_DATE, 'YYYY');

    -- Get the count of orders this year
    SELECT COUNT(*) + 1 INTO counter
    FROM orders
    WHERE "orderNumber" LIKE year_part || '%';

    -- Format: YYYY-NNNNNN (e.g., 2025-000001)
    new_number := year_part || '-' || LPAD(counter::TEXT, 6, '0');

    RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Function to check low stock
CREATE OR REPLACE FUNCTION check_low_stock()
RETURNS TABLE (
    product_slug TEXT,
    variant_key TEXT,
    current_stock INT,
    threshold INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        "productSlug",
        "variantKey",
        "stockLevel",
        "lowStockThreshold"
    FROM inventory
    WHERE "stockLevel" <= "lowStockThreshold"
    ORDER BY "stockLevel" ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to get available stock (total - reserved)
CREATE OR REPLACE FUNCTION get_available_stock(
    p_product_slug TEXT,
    p_variant_key TEXT
)
RETURNS INT AS $$
DECLARE
    available INT;
BEGIN
    SELECT ("stockLevel" - "reservedStock") INTO available
    FROM inventory
    WHERE "productSlug" = p_product_slug
    AND "variantKey" = p_variant_key;

    RETURN COALESCE(available, 0);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 14. COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON TABLE users IS 'User authentication and profile data';
COMMENT ON TABLE accounts IS 'OAuth provider accounts linked to users';
COMMENT ON TABLE sessions IS 'Active user sessions';
COMMENT ON TABLE customer_profiles IS 'Extended customer profile information';
COMMENT ON TABLE addresses IS 'Customer billing and shipping addresses';
COMMENT ON TABLE cart_items IS 'Shopping cart items for logged-in users';
COMMENT ON TABLE orders IS 'Customer orders';
COMMENT ON TABLE order_items IS 'Line items within orders';
COMMENT ON TABLE inventory IS 'Product inventory levels by variant';
COMMENT ON TABLE wishlist_items IS 'Customer wishlist/favorites';
COMMENT ON TABLE product_views IS 'Product view analytics';
COMMENT ON TABLE bespoke_leads IS 'Bespoke jewelry inquiry leads';

-- ============================================
-- 15. INDEXES FOR COMMON QUERIES
-- ============================================

-- Index for searching orders by customer email (guest checkouts)
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders("customerEmail");

-- Index for order creation date queries (recent orders, date ranges)
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders("createdAt" DESC);

-- Index for cart cleanup queries (find old cart items)
CREATE INDEX IF NOT EXISTS idx_cart_items_created_at ON cart_items("createdAt");

-- Index for wishlist queries by product
CREATE INDEX IF NOT EXISTS idx_wishlist_product_slug ON wishlist_items("productSlug");

-- Composite index for product view analytics
CREATE INDEX IF NOT EXISTS idx_product_views_slug_date
  ON product_views("productSlug", "viewedAt" DESC);

-- Index for bespoke lead management
CREATE INDEX IF NOT EXISTS idx_bespoke_leads_status ON bespoke_leads(status);
CREATE INDEX IF NOT EXISTS idx_bespoke_leads_created_at ON bespoke_leads("createdAt" DESC);

-- ============================================
-- NOTES
-- ============================================

-- IMPORTANT: Some RLS policies reference auth.uid() and auth.jwt()
-- These are Supabase-specific functions. If you're not using Supabase Auth,
-- you'll need to modify these policies to work with your authentication system.

-- For NextAuth.js integration without Supabase Auth, you may want to:
-- 1. Use service role for all backend operations
-- 2. Implement authorization at the application level
-- 3. Or create custom security definer functions

-- To apply these changes, you can either:
-- 1. Run this file directly: psql $DATABASE_URL -f database-improvements.sql
-- 2. Copy sections to Supabase SQL Editor
-- 3. Include in a Prisma migration

-- ============================================
-- ROLLBACK COMMANDS (if needed)
-- ============================================

-- To disable RLS on all tables:
-- ALTER TABLE users DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE accounts DISABLE ROW LEVEL SECURITY;
-- ... (repeat for all tables)

-- To drop all policies:
-- DROP POLICY IF EXISTS "policy_name" ON table_name;

-- To drop triggers:
-- DROP TRIGGER IF EXISTS update_users_updated_at ON users;
-- ... (repeat for all triggers)

-- To drop functions:
-- DROP FUNCTION IF EXISTS update_updated_at_column();
-- DROP FUNCTION IF EXISTS generate_order_number();
-- DROP FUNCTION IF EXISTS check_low_stock();
-- DROP FUNCTION IF EXISTS get_available_stock(TEXT, TEXT);
