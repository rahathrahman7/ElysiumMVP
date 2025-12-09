-- ============================================
-- ELYSIUM MVP - Complete Inventory Seed
-- ============================================
-- Inventory for ALL products on the website
-- Products: 11 total
-- Metals: 18k-yellow-gold, 18k-white-gold, 18k-rose-gold, platinum
-- Sizes: 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10
-- Total variants: 11 products × 4 metals × 13 sizes = 572 variants

-- Clear existing inventory first
DELETE FROM inventory;

-- Product slugs (based on your data/products folder):
-- 1. nova
-- 2. clarion-engagement-ring
-- 3. orabella-toi-et-moi
-- 4. aveline-radiant-solitaire
-- 5. elara-trilogy
-- 6. seraphina-signature-six-claw
-- 7. luna-low-set-solitaire
-- 8. celeste-six-claw-solitaire
-- 9. vow-veil
-- 10. eterna
-- 11. ovalis

-- Function to generate inventory for all metals and sizes for a product
DO $$
DECLARE
    product_slug TEXT;
    metal TEXT;
    size_val TEXT;
    stock_level INT;
    low_threshold INT;
BEGIN
    -- Loop through all products
    FOREACH product_slug IN ARRAY ARRAY[
        'nova',
        'clarion-engagement-ring',
        'orabella-toi-et-moi',
        'aveline-radiant-solitaire',
        'elara-trilogy',
        'seraphina-signature-six-claw',
        'luna-low-set-solitaire',
        'celeste-six-claw-solitaire',
        'vow-veil',
        'eterna',
        'ovalis'
    ]
    LOOP
        -- Loop through all metals
        FOREACH metal IN ARRAY ARRAY['18k-yellow-gold', '18k-white-gold', '18k-rose-gold', 'platinum']
        LOOP
            -- Loop through all sizes
            FOREACH size_val IN ARRAY ARRAY['4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10']
            LOOP
                -- Calculate stock level based on size popularity
                stock_level := CASE
                    WHEN size_val IN ('6', '6.5', '7', '7.5') THEN
                        CASE WHEN metal = 'platinum' THEN 8 ELSE 10 END
                    WHEN size_val IN ('5', '5.5', '8') THEN
                        CASE WHEN metal = 'platinum' THEN 5 ELSE 8 END
                    WHEN size_val IN ('4.5', '8.5', '9') THEN
                        CASE WHEN metal = 'platinum' THEN 3 ELSE 5 END
                    ELSE
                        CASE WHEN metal = 'platinum' THEN 2 ELSE 3 END
                END;

                -- Low stock threshold
                low_threshold := CASE WHEN metal = 'platinum' THEN 2 ELSE 3 END;

                -- Insert the inventory record
                INSERT INTO inventory (
                    "id",
                    "productSlug",
                    "variantKey",
                    "stockLevel",
                    "reservedStock",
                    "lowStockThreshold",
                    "lastUpdated"
                )
                VALUES (
                    gen_random_uuid(),
                    product_slug,
                    metal || '-' || size_val,
                    stock_level,
                    0,
                    low_threshold,
                    CURRENT_TIMESTAMP
                );
            END LOOP;
        END LOOP;
    END LOOP;

    RAISE NOTICE '✅ Inventory seeded successfully!';
    RAISE NOTICE '   Products: 11';
    RAISE NOTICE '   Metals: 4 per product';
    RAISE NOTICE '   Sizes: 13 per metal';
    RAISE NOTICE '   Total variants: 572';
END $$;

-- Verify the results
SELECT
    "productSlug",
    COUNT(*) as variant_count,
    SUM("stockLevel") as total_stock
FROM inventory
GROUP BY "productSlug"
ORDER BY "productSlug";

-- Show total
SELECT
    COUNT(*) as total_variants,
    SUM("stockLevel") as total_stock_across_all_products
FROM inventory;
