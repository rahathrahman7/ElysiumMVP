#!/usr/bin/env tsx
/**
 * Smoke test for checkout inventory logic (run against a seeded database).
 * Usage: DATABASE_URL=... pnpm exec tsx scripts/db/test-checkout-inventory.ts
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { buildVariantKeyFromConfiguration } from '../../lib/inventory/variantKey';
import {
  fulfillOrderInventory,
  releaseCheckoutInventory,
  reserveCheckoutInventory,
  validateCheckoutInventory,
} from '../../lib/services/checkoutInventory';
import { checkAvailability } from '../../lib/services/inventory';
import { createOrder } from '../../lib/services/orders';

const SLUG = 'vow-veil';
const CONFIG = { metal: '18k Yellow Gold', size: 'G 1/2' };

function createPrisma() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL required');
  const pool = new Pool({ connectionString: url, max: 2 });
  return new PrismaClient({ adapter: new PrismaPg(pool) });
}

async function main() {
  console.log('Checkout inventory smoke test\n');

  const variantKey = buildVariantKeyFromConfiguration(CONFIG);
  console.log('1. Variant key:', variantKey);
  if (variantKey !== '18k-yellow-gold-g-1/2') {
    throw new Error(`Unexpected variant key: ${variantKey}`);
  }
  console.log('   ✅ Variant key matches UK size format\n');

  const prisma = createPrisma();
  await prisma.$connect();

  const count = await prisma.inventory.count();
  if (count === 0) {
    console.log('⚠️  Inventory empty — run pnpm db:seed first');
    process.exit(1);
  }
  console.log(`2. Inventory rows: ${count}\n`);

  const item = {
    productSlug: SLUG,
    configuration: CONFIG,
    quantity: 1,
    title: 'Vow & Veil',
  };

  const before = await checkAvailability(SLUG, variantKey!, 1);
  console.log('3. Before reserve:', before);

  await validateCheckoutInventory([item]);
  console.log('   ✅ validateCheckoutInventory passed\n');

  await reserveCheckoutInventory([item]);
  const afterReserve = await checkAvailability(SLUG, variantKey!, 1);
  console.log('4. After reserve:', afterReserve);
  if (afterReserve.stock !== before.stock - 1) {
    throw new Error('Reserved stock did not reduce available count');
  }
  console.log('   ✅ reserveCheckoutInventory passed\n');

  const order = await createOrder({
    customerEmail: 'test@example.com',
    items: [
      {
        productSlug: SLUG,
        configuration: CONFIG,
        quantity: 1,
        unitPriceGbp: 100,
      },
    ],
  });
  console.log('5. Test order created:', order.orderNumber);

  await fulfillOrderInventory(order.id);
  const afterFulfill = await checkAvailability(SLUG, variantKey!, 1);
  console.log('6. After fulfill:', afterFulfill);
  if (afterFulfill.stock !== before.stock - 1) {
    throw new Error('Fulfill should deduct stockLevel by 1');
  }
  console.log('   ✅ fulfillOrderInventory passed\n');

  await prisma.order.delete({ where: { id: order.id } });

  console.log('========================================');
  console.log('ALL CHECKOUT INVENTORY TESTS PASSED');
  console.log('========================================');

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('TEST FAILED:', err);
  process.exit(1);
});
