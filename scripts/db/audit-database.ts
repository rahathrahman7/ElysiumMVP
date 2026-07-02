#!/usr/bin/env tsx
/**
 * ELYSIUM database + catalog consistency audit.
 * Cross-checks PostgreSQL productSlug references against products.json.
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { buildVariantKey } from '../../lib/inventory/variantKey';
import { auditCatalog, loadCatalog, type AuditIssue } from './catalog';

type Severity = 'error' | 'warning' | 'info' | 'pass';

interface Finding {
  severity: Severity;
  category: string;
  message: string;
  details?: string;
}

const findings: Finding[] = [];

function add(severity: Severity, category: string, message: string, details?: string) {
  findings.push({ severity, category, message, details });
}

function printFindings() {
  const order: Severity[] = ['error', 'warning', 'info', 'pass'];
  for (const severity of order) {
    const group = findings.filter((f) => f.severity === severity);
    if (!group.length) continue;
    const label = severity.toUpperCase();
    console.log(`\n=== ${label} (${group.length}) ===`);
    for (const f of group) {
      console.log(`[${f.category}] ${f.message}`);
      if (f.details) console.log(`  → ${f.details}`);
    }
  }
}

function summarize() {
  const errors = findings.filter((f) => f.severity === 'error').length;
  const warnings = findings.filter((f) => f.severity === 'warning').length;
  console.log('\n========================================');
  console.log(`AUDIT COMPLETE: ${errors} error(s), ${warnings} warning(s)`);
  console.log('========================================');
  return errors;
}

function mapCatalogIssues(issues: AuditIssue[]) {
  for (const issue of issues) {
    add(issue.severity, issue.category, issue.message, issue.details);
  }
}

function createPrismaClient(): PrismaClient | null {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return null;

  const pool = new Pool({ connectionString: databaseUrl, max: 2 });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

async function auditSchema(prisma: PrismaClient) {
  const expectedTables = [
    'users',
    'accounts',
    'sessions',
    'verification_tokens',
    'customer_profiles',
    'addresses',
    'cart_items',
    'orders',
    'order_items',
    'inventory',
    'wishlist_items',
    'product_views',
    'bespoke_leads',
    'inquiry_notes',
  ];

  const tables = await prisma.$queryRaw<{ tablename: string }[]>`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename
  `;
  const tableNames = new Set(tables.map((t) => t.tablename));

  for (const expected of expectedTables) {
    if (tableNames.has(expected)) {
      add('pass', 'schema', `Table "${expected}" exists`);
    } else {
      add('error', 'schema', `Missing table "${expected}"`);
    }
  }

  const extra = [...tableNames].filter((t) => !expectedTables.includes(t));
  for (const t of extra) {
    add('info', 'schema', `Extra table in database: "${t}"`);
  }
}

async function auditRowCounts(prisma: PrismaClient) {
  const counts = await Promise.all([
    prisma.user.count().then((n) => ['users', n] as const),
    prisma.cartItem.count().then((n) => ['cart_items', n] as const),
    prisma.order.count().then((n) => ['orders', n] as const),
    prisma.orderItem.count().then((n) => ['order_items', n] as const),
    prisma.inventory.count().then((n) => ['inventory', n] as const),
    prisma.wishlistItem.count().then((n) => ['wishlist_items', n] as const),
    prisma.productView.count().then((n) => ['product_views', n] as const),
    prisma.bespokeLead.count().then((n) => ['bespoke_leads', n] as const),
  ]);

  console.log('\n--- Row counts ---');
  for (const [table, count] of counts) {
    console.log(`  ${table}: ${count}`);
    if (table === 'inventory' && count === 0) {
      add('warning', 'inventory', 'Inventory table is empty — stock checks will always fail');
    }
  }
}

async function auditOrphanSlugs(prisma: PrismaClient, validSlugs: Set<string>) {
  const sources = [
    { name: 'cart_items', rows: await prisma.cartItem.groupBy({ by: ['productSlug'], _count: true }) },
    { name: 'order_items', rows: await prisma.orderItem.groupBy({ by: ['productSlug'], _count: true }) },
    { name: 'wishlist_items', rows: await prisma.wishlistItem.groupBy({ by: ['productSlug'], _count: true }) },
    { name: 'inventory', rows: await prisma.inventory.groupBy({ by: ['productSlug'], _count: true }) },
    { name: 'product_views', rows: await prisma.productView.groupBy({ by: ['productSlug'], _count: true }) },
  ];

  const dbSlugs = new Set<string>();
  for (const source of sources) {
    for (const row of source.rows) {
      dbSlugs.add(row.productSlug);
      if (!validSlugs.has(row.productSlug)) {
        add(
          'error',
          'orphan-slug',
          `${source.name}: unknown productSlug "${row.productSlug}" (${row._count} row(s))`
        );
      }
    }
  }

  const catalogOnly = [...validSlugs].filter((s) => !dbSlugs.has(s));
  if (catalogOnly.length === validSlugs.size) {
    add('info', 'catalog-coverage', 'No catalog products have any database references yet');
  } else {
    const withInventory = await prisma.inventory.groupBy({ by: ['productSlug'] });
    const inventorySlugs = new Set(withInventory.map((r) => r.productSlug));
    const missingInventory = [...validSlugs].filter((s) => !inventorySlugs.has(s));
    if (missingInventory.length) {
      add(
        'warning',
        'inventory-coverage',
        `${missingInventory.length}/${validSlugs.size} catalog products have no inventory rows`,
        missingInventory.slice(0, 8).join(', ') + (missingInventory.length > 8 ? '…' : '')
      );
    }
  }
}

async function auditInventoryVariants(prisma: PrismaClient, validSlugs: Set<string>) {
  const products = loadCatalog();
  const productBySlug = new Map(products.map((p) => [p.slug, p]));
  const inventory = await prisma.inventory.findMany();

  for (const row of inventory) {
    if (row.stockLevel < 0) {
      add('error', 'inventory', `Negative stockLevel for ${row.productSlug}/${row.variantKey}`);
    }
    if (row.reservedStock < 0) {
      add('error', 'inventory', `Negative reservedStock for ${row.productSlug}/${row.variantKey}`);
    }
    if (row.reservedStock > row.stockLevel) {
      add(
        'error',
        'inventory',
        `reservedStock > stockLevel for ${row.productSlug}/${row.variantKey}`,
        `stock=${row.stockLevel}, reserved=${row.reservedStock}`
      );
    }

    const product = productBySlug.get(row.productSlug);
    if (!product || !validSlugs.has(row.productSlug)) continue;

    const metals = product.metals?.map((m) => m.name) ?? [];
    const sizes = product.sizes ?? [];
    const validKeys = new Set<string>();
    for (const metal of metals) {
      for (const size of sizes.length ? sizes : ['one-size']) {
        validKeys.add(buildVariantKey(metal, size));
      }
    }

    if (!validKeys.has(row.variantKey)) {
      add(
        'warning',
        'variant-key',
        `Inventory variant "${row.variantKey}" does not match catalog metal/size combos for ${row.productSlug}`,
        `Expected pattern like: ${[...validKeys].slice(0, 2).join(', ')}`
      );
    }
  }
}

async function auditItemConfigurations(prisma: PrismaClient, validSlugs: Set<string>) {
  const products = loadCatalog();
  const productBySlug = new Map(products.map((p) => [p.slug, p]));

  const cartItems = await prisma.cartItem.findMany({ select: { productSlug: true, configuration: true, quantity: true } });
  for (const item of cartItems) {
    if (item.quantity <= 0) {
      add('error', 'cart', `Cart item for ${item.productSlug} has invalid quantity ${item.quantity}`);
    }
    validateConfiguration(item.productSlug, item.configuration, productBySlug, 'cart');
  }

  const orderItems = await prisma.orderItem.findMany({
    select: { productSlug: true, configuration: true, quantity: true, unitPriceGbp: true, totalPriceGbp: true },
  });
  for (const item of orderItems) {
    if (item.quantity <= 0) {
      add('error', 'orders', `Order item for ${item.productSlug} has invalid quantity ${item.quantity}`);
    }
    if (Number(item.unitPriceGbp) <= 0) {
      add('error', 'orders', `Order item for ${item.productSlug} has invalid unitPriceGbp`);
    }
    validateConfiguration(item.productSlug, item.configuration, productBySlug, 'orders');
  }
}

function validateConfiguration(
  productSlug: string,
  configuration: unknown,
  productBySlug: Map<string, ReturnType<typeof loadCatalog>[number]>,
  source: string
) {
  if (!productBySlug.has(productSlug)) return;

  const config = configuration as { metal?: string; size?: string } | null;
  if (!config || typeof config !== 'object') {
    add('error', source, `${productSlug}: missing or invalid configuration JSON`);
    return;
  }

  const product = productBySlug.get(productSlug)!;
  const metalNames = product.metals?.map((m) => m.name) ?? [];
  const sizes = product.sizes ?? [];

  if (config.metal && metalNames.length && !metalNames.includes(config.metal)) {
    add(
      'warning',
      source,
      `${productSlug}: configuration metal "${config.metal}" not in catalog`,
      `Valid: ${metalNames.join(', ')}`
    );
  }

  if (config.size && sizes.length && !sizes.includes(config.size)) {
    add(
      'warning',
      source,
      `${productSlug}: configuration size "${config.size}" not in catalog`,
      `Valid sizes include: ${sizes.slice(0, 5).join(', ')}…`
    );
  }
}

async function auditReferentialIntegrity(prisma: PrismaClient) {
  const orphanCart = await prisma.$queryRaw<{ count: bigint }[]>`
    SELECT COUNT(*)::bigint AS count
    FROM cart_items ci
    LEFT JOIN users u ON u.id = ci."userId"
    WHERE u.id IS NULL
  `;
  if (Number(orphanCart[0]?.count ?? 0) > 0) {
    add('error', 'referential', `${orphanCart[0].count} cart_items reference missing users`);
  }

  const ordersWithoutItems = await prisma.$queryRaw<{ id: string; orderNumber: string }[]>`
    SELECT o.id, o."orderNumber"
    FROM orders o
    LEFT JOIN order_items oi ON oi."orderId" = o.id
    WHERE oi.id IS NULL
  `;
  for (const order of ordersWithoutItems) {
    add('warning', 'orders', `Order ${order.orderNumber} has no line items`);
  }
}

async function auditDatabase(prisma: PrismaClient, validSlugs: Set<string>) {
  console.log('\n--- Database audit ---');
  await auditSchema(prisma);
  await auditRowCounts(prisma);
  await auditOrphanSlugs(prisma, validSlugs);
  await auditInventoryVariants(prisma, validSlugs);
  await auditItemConfigurations(prisma, validSlugs);
  await auditReferentialIntegrity(prisma);
}

async function main() {
  console.log('ELYSIUM Database + Catalog Audit');
  console.log(`Date: ${new Date().toISOString()}`);

  const catalog = auditCatalog();
  console.log(`\n--- Catalog audit (${catalog.productCount} products) ---`);
  mapCatalogIssues([...catalog.issues, ...catalog.warnings]);

  const ringProducts = [...catalog.inventoryExpectations.entries()].filter(([slug]) =>
    slug.includes('ring') || slug.includes('bracelet')
  );
  const totalExpectedVariants = [...catalog.inventoryExpectations.values()].reduce(
    (sum, v) => sum + v.variantCount,
    0
  );
  add(
    'info',
    'catalog',
    `Catalog defines ${totalExpectedVariants} potential inventory variants across ${catalog.productCount} products`
  );

  const nova = catalog.inventoryExpectations.get('nova-oval-solitaire-round-marquise');
  const vow = catalog.inventoryExpectations.get('vow-veil');
  if (nova && vow) {
    add(
      'info',
      'inventory-expectation',
      `Featured products: nova-oval-solitaire-round-marquise (${nova.variantCount} variants), vow-veil (${vow.variantCount} variants)`,
      `Sample keys: ${nova.sampleVariants.join(', ')}`
    );
  }

  const prisma = createPrismaClient();
  if (!prisma) {
    add('warning', 'connection', 'DATABASE_URL not set — skipping live database checks');
    printFindings();
    const exitCode = summarize();
    process.exit(exitCode > 0 ? 1 : 0);
  }

  try {
    await prisma.$connect();
    add('pass', 'connection', 'Connected to database');
    await auditDatabase(prisma, catalog.slugs);
  } catch (error) {
    add('error', 'connection', 'Failed to connect to database', String(error));
  } finally {
    await prisma.$disconnect();
  }

  printFindings();
  const exitCode = summarize();
  process.exit(exitCode > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
