-- ============================================
-- ELYSIUM MVP - Database Seed Data
-- ============================================
-- This file contains seed data for development and testing

-- ============================================
-- 1. INVENTORY SEED DATA
-- ============================================

-- Seed inventory for Nova ring (assuming metal types and sizes)
-- Product: nova
-- Metals: 18k-yellow-gold, 18k-white-gold, 18k-rose-gold, platinum
-- Sizes: 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10

-- Nova - 18K Yellow Gold
INSERT INTO inventory ("id", "productSlug", "variantKey", "stockLevel", "reservedStock", "lowStockThreshold", "lastUpdated")
VALUES
  (gen_random_uuid(), 'nova', '18k-yellow-gold-4', 5, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'nova', '18k-yellow-gold-4.5', 5, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'nova', '18k-yellow-gold-5', 8, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'nova', '18k-yellow-gold-5.5', 8, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'nova', '18k-yellow-gold-6', 10, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'nova', '18k-yellow-gold-6.5', 10, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'nova', '18k-yellow-gold-7', 12, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'nova', '18k-yellow-gold-7.5', 10, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'nova', '18k-yellow-gold-8', 8, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'nova', '18k-yellow-gold-8.5', 5, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'nova', '18k-yellow-gold-9', 5, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'nova', '18k-yellow-gold-9.5', 3, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'nova', '18k-yellow-gold-10', 3, 0, 3, CURRENT_TIMESTAMP)
ON CONFLICT ("productSlug", "variantKey") DO NOTHING;

-- Nova - 18K White Gold
INSERT INTO inventory ("id", "productSlug", "variantKey", "stockLevel", "reservedStock", "lowStockThreshold", "lastUpdated")
VALUES
  (gen_random_uuid(), 'nova', '18k-white-gold-4', 5, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'nova', '18k-white-gold-4.5', 5, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'nova', '18k-white-gold-5', 8, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'nova', '18k-white-gold-5.5', 8, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'nova', '18k-white-gold-6', 10, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'nova', '18k-white-gold-6.5', 10, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'nova', '18k-white-gold-7', 12, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'nova', '18k-white-gold-7.5', 10, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'nova', '18k-white-gold-8', 8, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'nova', '18k-white-gold-8.5', 5, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'nova', '18k-white-gold-9', 5, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'nova', '18k-white-gold-9.5', 3, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'nova', '18k-white-gold-10', 3, 0, 3, CURRENT_TIMESTAMP)
ON CONFLICT ("productSlug", "variantKey") DO NOTHING;

-- Nova - 18K Rose Gold
INSERT INTO inventory ("id", "productSlug", "variantKey", "stockLevel", "reservedStock", "lowStockThreshold", "lastUpdated")
VALUES
  (gen_random_uuid(), 'nova', '18k-rose-gold-4', 5, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'nova', '18k-rose-gold-4.5', 5, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'nova', '18k-rose-gold-5', 8, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'nova', '18k-rose-gold-5.5', 8, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'nova', '18k-rose-gold-6', 10, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'nova', '18k-rose-gold-6.5', 10, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'nova', '18k-rose-gold-7', 12, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'nova', '18k-rose-gold-7.5', 10, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'nova', '18k-rose-gold-8', 8, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'nova', '18k-rose-gold-8.5', 5, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'nova', '18k-rose-gold-9', 5, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'nova', '18k-rose-gold-9.5', 3, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'nova', '18k-rose-gold-10', 3, 0, 3, CURRENT_TIMESTAMP)
ON CONFLICT ("productSlug", "variantKey") DO NOTHING;

-- Nova - Platinum
INSERT INTO inventory ("id", "productSlug", "variantKey", "stockLevel", "reservedStock", "lowStockThreshold", "lastUpdated")
VALUES
  (gen_random_uuid(), 'nova', 'platinum-4', 3, 0, 2, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'nova', 'platinum-4.5', 3, 0, 2, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'nova', 'platinum-5', 5, 0, 2, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'nova', 'platinum-5.5', 5, 0, 2, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'nova', 'platinum-6', 8, 0, 2, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'nova', 'platinum-6.5', 8, 0, 2, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'nova', 'platinum-7', 10, 0, 2, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'nova', 'platinum-7.5', 8, 0, 2, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'nova', 'platinum-8', 5, 0, 2, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'nova', 'platinum-8.5', 3, 0, 2, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'nova', 'platinum-9', 3, 0, 2, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'nova', 'platinum-9.5', 2, 0, 2, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'nova', 'platinum-10', 2, 0, 2, CURRENT_TIMESTAMP)
ON CONFLICT ("productSlug", "variantKey") DO NOTHING;

-- Vow and Veil - 18K Yellow Gold
INSERT INTO inventory ("id", "productSlug", "variantKey", "stockLevel", "reservedStock", "lowStockThreshold", "lastUpdated")
VALUES
  (gen_random_uuid(), 'vow-veil', '18k-yellow-gold-4', 4, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'vow-veil', '18k-yellow-gold-4.5', 4, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'vow-veil', '18k-yellow-gold-5', 6, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'vow-veil', '18k-yellow-gold-5.5', 6, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'vow-veil', '18k-yellow-gold-6', 8, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'vow-veil', '18k-yellow-gold-6.5', 8, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'vow-veil', '18k-yellow-gold-7', 10, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'vow-veil', '18k-yellow-gold-7.5', 8, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'vow-veil', '18k-yellow-gold-8', 6, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'vow-veil', '18k-yellow-gold-8.5', 4, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'vow-veil', '18k-yellow-gold-9', 4, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'vow-veil', '18k-yellow-gold-9.5', 2, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'vow-veil', '18k-yellow-gold-10', 2, 0, 3, CURRENT_TIMESTAMP)
ON CONFLICT ("productSlug", "variantKey") DO NOTHING;

-- Vow and Veil - 18K White Gold
INSERT INTO inventory ("id", "productSlug", "variantKey", "stockLevel", "reservedStock", "lowStockThreshold", "lastUpdated")
VALUES
  (gen_random_uuid(), 'vow-veil', '18k-white-gold-4', 4, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'vow-veil', '18k-white-gold-4.5', 4, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'vow-veil', '18k-white-gold-5', 6, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'vow-veil', '18k-white-gold-5.5', 6, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'vow-veil', '18k-white-gold-6', 8, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'vow-veil', '18k-white-gold-6.5', 8, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'vow-veil', '18k-white-gold-7', 10, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'vow-veil', '18k-white-gold-7.5', 8, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'vow-veil', '18k-white-gold-8', 6, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'vow-veil', '18k-white-gold-8.5', 4, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'vow-veil', '18k-white-gold-9', 4, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'vow-veil', '18k-white-gold-9.5', 2, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'vow-veil', '18k-white-gold-10', 2, 0, 3, CURRENT_TIMESTAMP)
ON CONFLICT ("productSlug", "variantKey") DO NOTHING;

-- Vow and Veil - 18K Rose Gold
INSERT INTO inventory ("id", "productSlug", "variantKey", "stockLevel", "reservedStock", "lowStockThreshold", "lastUpdated")
VALUES
  (gen_random_uuid(), 'vow-veil', '18k-rose-gold-4', 4, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'vow-veil', '18k-rose-gold-4.5', 4, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'vow-veil', '18k-rose-gold-5', 6, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'vow-veil', '18k-rose-gold-5.5', 6, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'vow-veil', '18k-rose-gold-6', 8, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'vow-veil', '18k-rose-gold-6.5', 8, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'vow-veil', '18k-rose-gold-7', 10, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'vow-veil', '18k-rose-gold-7.5', 8, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'vow-veil', '18k-rose-gold-8', 6, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'vow-veil', '18k-rose-gold-8.5', 4, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'vow-veil', '18k-rose-gold-9', 4, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'vow-veil', '18k-rose-gold-9.5', 2, 0, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'vow-veil', '18k-rose-gold-10', 2, 0, 3, CURRENT_TIMESTAMP)
ON CONFLICT ("productSlug", "variantKey") DO NOTHING;

-- Vow and Veil - Platinum
INSERT INTO inventory ("id", "productSlug", "variantKey", "stockLevel", "reservedStock", "lowStockThreshold", "lastUpdated")
VALUES
  (gen_random_uuid(), 'vow-veil', 'platinum-4', 2, 0, 2, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'vow-veil', 'platinum-4.5', 2, 0, 2, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'vow-veil', 'platinum-5', 4, 0, 2, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'vow-veil', 'platinum-5.5', 4, 0, 2, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'vow-veil', 'platinum-6', 6, 0, 2, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'vow-veil', 'platinum-6.5', 6, 0, 2, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'vow-veil', 'platinum-7', 8, 0, 2, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'vow-veil', 'platinum-7.5', 6, 0, 2, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'vow-veil', 'platinum-8', 4, 0, 2, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'vow-veil', 'platinum-8.5', 2, 0, 2, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'vow-veil', 'platinum-9', 2, 0, 2, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'vow-veil', 'platinum-9.5', 1, 0, 2, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'vow-veil', 'platinum-10', 1, 0, 2, CURRENT_TIMESTAMP)
ON CONFLICT ("productSlug", "variantKey") DO NOTHING;

-- ============================================
-- 2. TEST USER DATA (Development Only)
-- ============================================

-- Note: This creates test users with hashed passwords
-- Password for all test users: "TestPassword123!"
-- Hash generated with bcrypt (10 rounds)

INSERT INTO users ("id", "email", "emailVerified", "name", "password", "createdAt", "updatedAt")
VALUES
  (
    'test-user-001',
    'customer@example.com',
    CURRENT_TIMESTAMP,
    'Test Customer',
    '$2a$10$rU8kAVlq.EwQXZJBnwTYaeqX1lXNKDXp3xD/fLGGjLxWYxUGYx2LS', -- TestPassword123!
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'test-user-002',
    'admin@elysium.com',
    CURRENT_TIMESTAMP,
    'Admin User',
    '$2a$10$rU8kAVlq.EwQXZJBnwTYaeqX1lXNKDXp3xD/fLGGjLxWYxUGYx2LS', -- TestPassword123!
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  )
ON CONFLICT ("email") DO NOTHING;

-- ============================================
-- 3. SAMPLE CUSTOMER PROFILE
-- ============================================

INSERT INTO customer_profiles ("id", "userId", "phone", "preferences", "createdAt", "updatedAt")
VALUES
  (
    gen_random_uuid(),
    'test-user-001',
    '+44 7700 900000',
    '{"newsletter": true, "smsNotifications": false, "currency": "GBP"}'::jsonb,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  )
ON CONFLICT ("userId") DO NOTHING;

-- ============================================
-- 4. SAMPLE ADDRESSES
-- ============================================

INSERT INTO addresses ("id", "userId", "type", "line1", "line2", "city", "state", "postalCode", "country", "isDefault", "createdAt", "updatedAt")
VALUES
  (
    'test-address-001',
    'test-user-001',
    'BILLING',
    '123 Bond Street',
    'Flat 4B',
    'London',
    'Greater London',
    'W1S 4SB',
    'GB',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'test-address-002',
    'test-user-001',
    'SHIPPING',
    '123 Bond Street',
    'Flat 4B',
    'London',
    'Greater London',
    'W1S 4SB',
    'GB',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  )
ON CONFLICT DO NOTHING;

-- ============================================
-- 5. SAMPLE ORDERS (for testing order management)
-- ============================================

INSERT INTO orders (
  "id",
  "userId",
  "orderNumber",
  "status",
  "totalAmountGbp",
  "currency",
  "stripePaymentIntentId",
  "billingAddressId",
  "shippingAddressId",
  "customerEmail",
  "customerName",
  "notes",
  "createdAt",
  "updatedAt"
)
VALUES
  (
    'test-order-001',
    'test-user-001',
    '2025-000001',
    'PAID',
    2450.00,
    'GBP',
    'pi_test_example123',
    'test-address-001',
    'test-address-002',
    'customer@example.com',
    'Test Customer',
    'Test order - paid and ready to fulfill',
    CURRENT_TIMESTAMP - INTERVAL '2 days',
    CURRENT_TIMESTAMP - INTERVAL '2 days'
  ),
  (
    'test-order-002',
    'test-user-001',
    '2025-000002',
    'PROCESSING',
    3100.00,
    'GBP',
    'pi_test_example456',
    'test-address-001',
    'test-address-002',
    'customer@example.com',
    'Test Customer',
    'Test order - currently being processed',
    CURRENT_TIMESTAMP - INTERVAL '1 day',
    CURRENT_TIMESTAMP - INTERVAL '1 day'
  ),
  (
    'test-order-003',
    NULL, -- Guest checkout
    '2025-000003',
    'PENDING',
    1850.00,
    'GBP',
    NULL,
    NULL,
    NULL,
    'guest@example.com',
    'Guest Customer',
    'Test order - pending payment',
    CURRENT_TIMESTAMP - INTERVAL '3 hours',
    CURRENT_TIMESTAMP - INTERVAL '3 hours'
  )
ON CONFLICT ("orderNumber") DO NOTHING;

-- ============================================
-- 6. SAMPLE ORDER ITEMS
-- ============================================

INSERT INTO order_items (
  "id",
  "orderId",
  "productSlug",
  "configuration",
  "quantity",
  "unitPriceGbp",
  "totalPriceGbp"
)
VALUES
  (
    gen_random_uuid(),
    'test-order-001',
    'nova',
    '{"metal": "18k-yellow-gold", "size": "7", "engraving": "Forever"}'::jsonb,
    1,
    2450.00,
    2450.00
  ),
  (
    gen_random_uuid(),
    'test-order-002',
    'vow-veil',
    '{"metal": "platinum", "size": "6.5"}'::jsonb,
    1,
    3100.00,
    3100.00
  ),
  (
    gen_random_uuid(),
    'test-order-003',
    'nova',
    '{"metal": "18k-rose-gold", "size": "5.5"}'::jsonb,
    1,
    1850.00,
    1850.00
  )
ON CONFLICT DO NOTHING;

-- ============================================
-- 7. SAMPLE BESPOKE LEADS
-- ============================================

INSERT INTO bespoke_leads (
  "id",
  "name",
  "email",
  "phone",
  "budget",
  "notes",
  "status",
  "createdAt",
  "updatedAt"
)
VALUES
  (
    gen_random_uuid(),
    'Sarah Johnson',
    'sarah.j@example.com',
    '+44 7700 900111',
    '£5,000 - £10,000',
    'Looking for a unique engagement ring with sapphires. Prefer vintage style.',
    'NEW',
    CURRENT_TIMESTAMP - INTERVAL '5 days',
    CURRENT_TIMESTAMP - INTERVAL '5 days'
  ),
  (
    gen_random_uuid(),
    'Michael Chen',
    'michael.chen@example.com',
    '+44 7700 900222',
    '£10,000+',
    'Interested in a custom wedding band set. Would like to schedule a consultation.',
    'CONTACTED',
    CURRENT_TIMESTAMP - INTERVAL '10 days',
    CURRENT_TIMESTAMP - INTERVAL '3 days'
  )
ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check inventory counts
SELECT
  "productSlug",
  COUNT(*) as variant_count,
  SUM("stockLevel") as total_stock
FROM inventory
GROUP BY "productSlug";

-- Check test users
SELECT id, email, name, "createdAt"
FROM users
WHERE email LIKE '%example.com%' OR email LIKE '%elysium.com%';

-- Check test orders
SELECT "orderNumber", status, "totalAmountGbp", "customerEmail", "createdAt"
FROM orders
ORDER BY "createdAt" DESC;

-- Check low stock items
SELECT * FROM check_low_stock();
