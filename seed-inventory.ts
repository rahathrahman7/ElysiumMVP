#!/usr/bin/env tsx
/**
 * ELYSIUM MVP - Seed Inventory Data
 *
 * Seeds inventory for Nova and Vow & Veil products
 * - 4 metals: 18k Yellow Gold, 18k White Gold, 18k Rose Gold, Platinum
 * - 13 sizes: 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10
 * - Total: 104 variants (52 per product)
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const metals = [
  { key: '18k-yellow-gold', name: '18K Yellow Gold' },
  { key: '18k-white-gold', name: '18K White Gold' },
  { key: '18k-rose-gold', name: '18K Rose Gold' },
  { key: 'platinum', name: 'Platinum' }
];

const sizes = ['4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10'];

// Stock levels by size (more popular sizes have more stock)
const getStockLevel = (size: string, isPlatinum: boolean): number => {
  const baseStock = {
    '4': 5, '4.5': 5, '5': 8, '5.5': 8,
    '6': 10, '6.5': 10, '7': 12, '7.5': 10,
    '8': 8, '8.5': 5, '9': 5, '9.5': 3, '10': 3
  };

  const stock = baseStock[size as keyof typeof baseStock] || 5;
  // Platinum typically has less stock
  return isPlatinum ? Math.max(2, stock - 2) : stock;
};

async function seedInventory() {
  console.log('🌱 Starting inventory seed...\n');

  try {
    // Check if inventory already exists
    const existingCount = await prisma.inventory.count();

    if (existingCount > 0) {
      console.log(`⚠️  Found ${existingCount} existing inventory records`);
      console.log('   Clearing existing inventory...\n');
      await prisma.inventory.deleteMany({});
    }

    let totalCreated = 0;

    // Seed Nova inventory
    console.log('📦 Seeding Nova inventory...');
    for (const metal of metals) {
      for (const size of sizes) {
        const variantKey = `${metal.key}-${size}`;
        const stockLevel = getStockLevel(size, metal.key === 'platinum');
        const lowStockThreshold = metal.key === 'platinum' ? 2 : 3;

        await prisma.inventory.create({
          data: {
            productSlug: 'nova',
            variantKey,
            stockLevel,
            reservedStock: 0,
            lowStockThreshold,
          }
        });

        totalCreated++;
      }
    }
    console.log(`   ✅ Created ${metals.length * sizes.length} Nova variants\n`);

    // Seed Vow & Veil inventory
    console.log('📦 Seeding Vow & Veil inventory...');
    for (const metal of metals) {
      for (const size of sizes) {
        const variantKey = `${metal.key}-${size}`;
        // Vow & Veil has slightly less stock
        const stockLevel = Math.max(2, getStockLevel(size, metal.key === 'platinum') - 2);
        const lowStockThreshold = metal.key === 'platinum' ? 2 : 3;

        await prisma.inventory.create({
          data: {
            productSlug: 'vow-veil',
            variantKey,
            stockLevel,
            reservedStock: 0,
            lowStockThreshold,
          }
        });

        totalCreated++;
      }
    }
    console.log(`   ✅ Created ${metals.length * sizes.length} Vow & Veil variants\n`);

    // Summary
    console.log('=' .repeat(80));
    console.log('✨ INVENTORY SEED COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(80));
    console.log(`\n📊 Summary:`);
    console.log(`   Total variants created: ${totalCreated}`);
    console.log(`   Nova variants: ${metals.length * sizes.length}`);
    console.log(`   Vow & Veil variants: ${metals.length * sizes.length}`);
    console.log(`\n💎 Breakdown:`);
    console.log(`   Metals: ${metals.length} (18k Yellow, 18k White, 18k Rose, Platinum)`);
    console.log(`   Sizes: ${sizes.length} (${sizes[0]} to ${sizes[sizes.length - 1]})`);
    console.log(`\n📈 Stock Levels:`);
    console.log(`   Most popular sizes (6-7.5): 8-12 units`);
    console.log(`   Standard sizes: 5-8 units`);
    console.log(`   Less common sizes: 2-5 units`);
    console.log(`   Platinum variants: 2-10 units`);
    console.log(`\n⚠️  Low Stock Threshold:`);
    console.log(`   Gold variants: 3 units`);
    console.log(`   Platinum variants: 2 units`);
    console.log(`\n🎯 Next Steps:`);
    console.log(`   1. Verify: pnpm db:studio`);
    console.log(`   2. Test adding products to cart in your app`);
    console.log(`   3. Monitor inventory with: SELECT * FROM check_low_stock();`);
    console.log('');

    // Show some sample data
    console.log('📝 Sample Inventory (first 5 records):');
    const samples = await prisma.inventory.findMany({
      take: 5,
      orderBy: { productSlug: 'asc' }
    });

    console.table(samples.map(s => ({
      Product: s.productSlug,
      Variant: s.variantKey,
      Stock: s.stockLevel,
      Reserved: s.reservedStock,
      Threshold: s.lowStockThreshold
    })));

  } catch (error: any) {
    console.error('\n❌ Error seeding inventory:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed
console.log('🚀 ELYSIUM Inventory Seeder\n');
seedInventory();
