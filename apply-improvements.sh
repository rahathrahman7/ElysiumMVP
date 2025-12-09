#!/bin/bash

# ============================================
# ELYSIUM MVP - Database Improvements Script
# ============================================
# This script helps apply database improvements safely
# Usage: ./apply-improvements.sh [step]
# Example: ./apply-improvements.sh all

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Database URL
if [ -z "$DATABASE_URL" ]; then
    if [ -f .env ]; then
        export $(cat .env | grep DATABASE_URL | xargs)
    fi
fi

if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}ERROR: DATABASE_URL not found${NC}"
    echo "Please set DATABASE_URL environment variable or add it to .env file"
    exit 1
fi

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}ELYSIUM MVP - Database Improvements${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# Function to execute SQL file
execute_sql() {
    local file=$1
    local description=$2

    echo -e "${YELLOW}Executing: ${description}${NC}"

    if [ ! -f "$file" ]; then
        echo -e "${RED}ERROR: File not found: ${file}${NC}"
        return 1
    fi

    psql "$DATABASE_URL" -f "$file"

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Success: ${description}${NC}"
        echo ""
        return 0
    else
        echo -e "${RED}✗ Failed: ${description}${NC}"
        echo ""
        return 1
    fi
}

# Function to execute SQL command
execute_sql_command() {
    local sql=$1
    local description=$2

    echo -e "${YELLOW}Executing: ${description}${NC}"

    echo "$sql" | psql "$DATABASE_URL"

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Success: ${description}${NC}"
        echo ""
        return 0
    else
        echo -e "${RED}✗ Failed: ${description}${NC}"
        echo ""
        return 1
    fi
}

# Show menu
show_menu() {
    echo -e "${BLUE}Available steps:${NC}"
    echo "  1. Install pg_trgm extension"
    echo "  2. Install updatedAt triggers"
    echo "  3. Install utility functions"
    echo "  4. Add performance indexes"
    echo "  5. Enable RLS on all tables"
    echo "  6. Create RLS policies"
    echo "  7. Seed inventory data"
    echo "  8. Seed test data (development only)"
    echo "  9. Run audit report"
    echo "  all. Apply all improvements (except test data)"
    echo "  help. Show this menu"
    echo ""
}

# Main execution
STEP=${1:-help}

case "$STEP" in
    1|extension|pg_trgm)
        execute_sql_command "CREATE EXTENSION IF NOT EXISTS pg_trgm;" "Install pg_trgm extension"
        ;;

    2|triggers)
        echo -e "${YELLOW}Installing updatedAt triggers...${NC}"
        cat <<'EOF' | psql "$DATABASE_URL"
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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
EOF
        echo -e "${GREEN}✓ Triggers installed${NC}"
        echo ""
        ;;

    3|functions|utilities)
        echo -e "${YELLOW}Installing utility functions...${NC}"
        cat <<'EOF' | psql "$DATABASE_URL"
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    new_number TEXT;
    year_part TEXT;
    counter INT;
BEGIN
    year_part := TO_CHAR(CURRENT_DATE, 'YYYY');
    SELECT COUNT(*) + 1 INTO counter
    FROM orders
    WHERE "orderNumber" LIKE year_part || '%';
    new_number := year_part || '-' || LPAD(counter::TEXT, 6, '0');
    RETURN new_number;
END;
$$ LANGUAGE plpgsql;

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
EOF
        echo -e "${GREEN}✓ Utility functions installed${NC}"
        echo ""
        ;;

    4|indexes)
        echo -e "${YELLOW}Adding performance indexes...${NC}"
        cat <<'EOF' | psql "$DATABASE_URL"
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders("customerEmail");
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_cart_items_created_at ON cart_items("createdAt");
CREATE INDEX IF NOT EXISTS idx_wishlist_product_slug ON wishlist_items("productSlug");
CREATE INDEX IF NOT EXISTS idx_product_views_slug_date ON product_views("productSlug", "viewedAt" DESC);
CREATE INDEX IF NOT EXISTS idx_bespoke_leads_status ON bespoke_leads(status);
CREATE INDEX IF NOT EXISTS idx_bespoke_leads_created_at ON bespoke_leads("createdAt" DESC);
EOF
        echo -e "${GREEN}✓ Indexes added${NC}"
        echo ""
        ;;

    5|enable-rls)
        echo -e "${YELLOW}Enabling RLS on all tables...${NC}"
        cat <<'EOF' | psql "$DATABASE_URL"
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
EOF
        echo -e "${GREEN}✓ RLS enabled${NC}"
        echo -e "${YELLOW}⚠️  Remember to create RLS policies (step 6) or all access will be blocked${NC}"
        echo ""
        ;;

    6|policies|rls-policies)
        echo -e "${RED}⚠️  WARNING: This will apply RLS policies${NC}"
        echo -e "${YELLOW}RLS policies use Supabase auth functions (auth.uid(), auth.jwt())${NC}"
        echo -e "${YELLOW}If not using Supabase Auth, modify policies in database-improvements.sql first${NC}"
        echo ""
        read -p "Continue? (yes/no): " confirm
        if [ "$confirm" == "yes" ]; then
            # Extract only RLS policy sections from database-improvements.sql
            echo -e "${YELLOW}This step should be done manually via Supabase SQL Editor${NC}"
            echo -e "${YELLOW}Please copy sections 2-10 from database-improvements.sql${NC}"
            echo ""
        else
            echo "Skipped"
        fi
        ;;

    7|seed|inventory)
        echo -e "${YELLOW}Seeding inventory data...${NC}"
        echo -e "${YELLOW}This will add inventory for nova and vow-veil products${NC}"
        echo ""
        read -p "Continue? (yes/no): " confirm
        if [ "$confirm" == "yes" ]; then
            # Extract inventory section from database-seed.sql
            psql "$DATABASE_URL" -c "$(sed -n '/-- Nova - 18K Yellow Gold/,/ON CONFLICT.*DO NOTHING;/p' database-seed.sql)"
            echo -e "${GREEN}✓ Inventory seeded${NC}"
            echo ""
        else
            echo "Skipped"
        fi
        ;;

    8|test-data)
        echo -e "${RED}⚠️  WARNING: This will add test data to your database${NC}"
        echo -e "${YELLOW}Only use this in development/staging environments${NC}"
        echo ""
        read -p "Continue? (yes/no): " confirm
        if [ "$confirm" == "yes" ]; then
            execute_sql "database-seed.sql" "Seed test data"
        else
            echo "Skipped"
        fi
        ;;

    9|audit)
        echo -e "${YELLOW}Running audit report...${NC}"
        npx tsx audit-database.ts
        echo ""
        npx tsx audit-security-performance.ts
        ;;

    all)
        echo -e "${BLUE}Applying all improvements (except test data)...${NC}"
        echo ""

        $0 1  # pg_trgm
        $0 2  # triggers
        $0 3  # functions
        $0 4  # indexes

        echo -e "${GREEN}============================================${NC}"
        echo -e "${GREEN}Basic improvements applied!${NC}"
        echo -e "${GREEN}============================================${NC}"
        echo ""
        echo -e "${YELLOW}Manual steps remaining:${NC}"
        echo -e "  1. Review and apply RLS policies (step 6)"
        echo -e "  2. Seed inventory data (step 7)"
        echo -e "  3. Optionally seed test data (step 8)"
        echo ""
        ;;

    help|*)
        show_menu
        ;;
esac

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}For detailed information, see:${NC}"
echo -e "${BLUE}DATABASE_AUDIT_REPORT.md${NC}"
echo -e "${BLUE}============================================${NC}"
