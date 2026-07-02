import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import {
  buildInventoryRowsFromCatalog,
  loadCatalogProducts,
} from '../lib/inventory/catalogInventory';

function createPrismaClient(): PrismaClient {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required to seed inventory');
  }

  const pool = new Pool({ connectionString: databaseUrl, max: 5 });
  return new PrismaClient({ adapter: new PrismaPg(pool) });
}

async function seedInventory(prisma: PrismaClient) {
  const products = loadCatalogProducts();
  const rows = buildInventoryRowsFromCatalog(products);
  const expectedKeys = new Set(rows.map((row) => `${row.productSlug}::${row.variantKey}`));
  const validSlugs = new Set(products.map((product) => product.slug));

  const existing = await prisma.inventory.findMany({
    select: { id: true, productSlug: true, variantKey: true },
  });

  const orphanIds = existing
    .filter((row) => {
      const key = `${row.productSlug}::${row.variantKey}`;
      return !validSlugs.has(row.productSlug) || !expectedKeys.has(key);
    })
    .map((row) => row.id);

  if (orphanIds.length) {
    await prisma.inventory.deleteMany({ where: { id: { in: orphanIds } } });
    console.log(`Removed ${orphanIds.length} stale inventory row(s) (wrong slug or size variant)`);
  }

  const existingKeys = new Set(existing.map((row) => `${row.productSlug}::${row.variantKey}`));
  const toCreate = rows.filter((row) => !existingKeys.has(`${row.productSlug}::${row.variantKey}`));

  const batchSize = 250;
  for (let i = 0; i < toCreate.length; i += batchSize) {
    const batch = toCreate.slice(i, i + batchSize);
    await prisma.inventory.createMany({ data: batch });
  }

  const ringProducts = products.filter((product) => product.sizes?.length);
  const sample = ringProducts[0];
  const sampleSize = sample?.sizes?.[0];
  const sampleMetal = sample?.metals?.[0]?.name;

  console.log(`Catalog products: ${products.length}`);
  console.log(`Ring/bracelet products with UK sizes: ${ringProducts.length}`);
  console.log(`Inventory variants seeded: ${toCreate.length} new, ${existing.length - orphanIds.length} unchanged`);
  console.log(`Total expected variants: ${rows.length}`);
  if (sample && sampleSize && sampleMetal) {
    console.log(`Sample variant key: ${sample.slug} → ${sampleMetal} + ${sampleSize}`);
  }
}

async function main() {
  const prisma = createPrismaClient();

  try {
    await prisma.$connect();
    await seedInventory(prisma);
    console.log('Inventory seed complete.');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
