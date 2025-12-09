-- ============================================
-- ELYSIUM MVP - Safe Database Improvements
-- ============================================
-- This file contains improvements that can be applied safely
-- WITHOUT Row Level Security policies (RLS will be applied separately)
--
-- Includes:
-- - Timestamp update triggers
-- - Utility functions
-- - Performance indexes
-- - Extensions
-- - Table documentation
--
-- Run this with: psql $DATABASE_URL -f database-improvements-safe.sql
-- ============================================

-- ============================================
-- 1. UPDATED_AT TRIGGER FUNCTION
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
-- 2. ENABLE PG_TRGM EXTENSION FOR SEARCH
-- ============================================

-- Enable trigram extension for better search capabilities
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================
-- 3. UTILITY FUNCTIONS
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
-- 4. COMMENTS FOR DOCUMENTATION
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
-- 5. INDEXES FOR COMMON QUERIES
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
-- COMPLETION MESSAGE
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '✅ Database improvements applied successfully!';
    RAISE NOTICE '   - Triggers: 6 created';
    RAISE NOTICE '   - Functions: 4 created';
    RAISE NOTICE '   - Indexes: 7 created';
    RAISE NOTICE '   - Extensions: pg_trgm enabled';
    RAISE NOTICE '   - Table comments: 12 added';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  IMPORTANT: Row Level Security (RLS) policies NOT applied yet.';
    RAISE NOTICE '   Apply RLS policies separately via Supabase dashboard.';
END $$;
