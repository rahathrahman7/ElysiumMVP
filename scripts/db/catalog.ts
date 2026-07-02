import fs from 'fs';
import path from 'path';
import {
  buildInventoryRowsForProduct,
  loadCatalogProducts,
  type CatalogProduct,
} from '../../lib/inventory/catalogInventory';
import {
  buildVariantKey,
  metalToVariantSegment,
  sizeToVariantSegment,
} from '../../lib/inventory/variantKey';

export type { CatalogProduct };
export {
  buildVariantKey,
  loadCatalogProducts as loadCatalog,
  metalToVariantSegment,
  sizeToVariantSegment,
};

const DUPLICATE_PATH = path.join(process.cwd(), 'app', 'Public', 'data', 'products.json');

export function getExpectedInventoryVariants(product: CatalogProduct): string[] {
  return buildInventoryRowsForProduct(product).map((row) => row.variantKey);
}

export function isRingLikeProduct(product: CatalogProduct): boolean {
  const slug = product.slug.toLowerCase();
  return (
    slug.includes('ring') ||
    slug.includes('bracelet') ||
    (!slug.includes('earring') && Boolean(product.sizes?.length))
  );
}

export interface CatalogAuditResult {
  productCount: number;
  slugs: Set<string>;
  issues: AuditIssue[];
  warnings: AuditIssue[];
  inventoryExpectations: Map<string, { variantCount: number; sampleVariants: string[] }>;
}

export interface AuditIssue {
  severity: 'error' | 'warning' | 'info';
  category: string;
  message: string;
  details?: string;
}

export function auditCatalog(): CatalogAuditResult {
  const products = loadCatalogProducts();
  const slugs = new Set(products.map((p) => p.slug));
  const issues: AuditIssue[] = [];
  const warnings: AuditIssue[] = [];
  const inventoryExpectations = new Map<string, { variantCount: number; sampleVariants: string[] }>();

  const slugCounts = new Map<string, number>();
  for (const product of products) {
    slugCounts.set(product.slug, (slugCounts.get(product.slug) ?? 0) + 1);
  }
  for (const [slug, count] of slugCounts) {
    if (count > 1) {
      issues.push({
        severity: 'error',
        category: 'catalog',
        message: `Duplicate slug "${slug}" appears ${count} times`,
      });
    }
  }

  for (const product of products) {
    if (!product.slug) {
      issues.push({ severity: 'error', category: 'catalog', message: `Product missing slug: ${(product as { title?: string }).title}` });
      continue;
    }

    if (!product.metals?.length) {
      issues.push({
        severity: 'error',
        category: 'catalog',
        message: `${product.slug}: no metals defined`,
      });
    }

    const isEarring = product.slug.includes('earring');

    if (!isEarring && !product.sizes?.length) {
      warnings.push({
        severity: 'warning',
        category: 'catalog',
        message: `${product.slug}: no ring sizes (earrings/bracelets use one-size variants)`,
      });
    }

    const expectedVariants = getExpectedInventoryVariants(product);
    inventoryExpectations.set(product.slug, {
      variantCount: expectedVariants.length,
      sampleVariants: expectedVariants.slice(0, 3),
    });
  }

  if (fs.existsSync(DUPLICATE_PATH)) {
    const duplicate = JSON.parse(fs.readFileSync(DUPLICATE_PATH, 'utf8')) as CatalogProduct[];
    const duplicateSlugs = new Set(duplicate.map((p) => p.slug));
    const onlyPrimary = [...slugs].filter((s) => !duplicateSlugs.has(s));
    const onlyDuplicate = [...duplicateSlugs].filter((s) => !slugs.has(s));

    if (onlyPrimary.length || onlyDuplicate.length) {
      issues.push({
        severity: 'error',
        category: 'catalog-sync',
        message: 'public/data/products.json and app/Public/data/products.json are out of sync',
        details: [
          onlyPrimary.length ? `Only in public: ${onlyPrimary.join(', ')}` : '',
          onlyDuplicate.length ? `Only in app/Public: ${onlyDuplicate.join(', ')}` : '',
        ]
          .filter(Boolean)
          .join('; '),
      });
    }
  }

  return {
    productCount: products.length,
    slugs,
    issues,
    warnings,
    inventoryExpectations,
  };
}
