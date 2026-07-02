import fs from 'fs';
import path from 'path';

export interface CatalogProduct {
  slug: string;
  title: string;
  basePriceGBP: number;
  metals?: { name: string; priceDeltaGBP: number }[];
  sizes?: string[];
  widths?: { label: string; width: number; priceDeltaGBP: number }[];
  images?: string[];
  galleryByMetal?: Record<string, string[]>;
  galleryByCaratAndMetal?: Record<string, Record<string, string[]>>;
  collections?: string[];
}

const PRODUCTS_PATH = path.join(process.cwd(), 'public', 'data', 'products.json');
const DUPLICATE_PATH = path.join(process.cwd(), 'app', 'Public', 'data', 'products.json');

export function loadCatalog(): CatalogProduct[] {
  if (!fs.existsSync(PRODUCTS_PATH)) {
    throw new Error(`Catalog not found at ${PRODUCTS_PATH}`);
  }
  return JSON.parse(fs.readFileSync(PRODUCTS_PATH, 'utf8')) as CatalogProduct[];
}

export function metalToVariantSegment(metal: string): string {
  return metal.trim().toLowerCase().replace(/\s+/g, '-');
}

export function sizeToVariantSegment(size: string): string {
  return size.trim().toLowerCase().replace(/\s+/g, '-');
}

export function buildVariantKey(metal: string, size: string): string {
  return `${metalToVariantSegment(metal)}-${sizeToVariantSegment(size)}`;
}

export function getExpectedInventoryVariants(product: CatalogProduct): string[] {
  if (!product.metals?.length) return [];

  const sizes = product.sizes?.length ? product.sizes : ['one-size'];
  const variants: string[] = [];

  for (const metal of product.metals) {
    for (const size of sizes) {
      variants.push(buildVariantKey(metal.name, size));
    }
  }

  return variants;
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
  const products = loadCatalog();
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
      issues.push({ severity: 'error', category: 'catalog', message: `Product missing slug: ${product.title}` });
      continue;
    }

    if (product.basePriceGBP == null || product.basePriceGBP < 0) {
      issues.push({
        severity: 'error',
        category: 'catalog',
        message: `${product.slug}: invalid or missing basePriceGBP`,
      });
    }

    if (!product.metals?.length) {
      issues.push({
        severity: 'error',
        category: 'catalog',
        message: `${product.slug}: no metals defined`,
      });
    }

    const isEarring = product.slug.includes('earring');
    const isMensRing = product.slug.includes('mens-ring');
    const isBracelet = product.slug.includes('bracelet');

    if (!isEarring && !product.sizes?.length) {
      warnings.push({
        severity: 'warning',
        category: 'catalog',
        message: `${product.slug}: no ring sizes (may be intentional for earrings)`,
      });
    }

    if (isMensRing && !product.widths?.length) {
      warnings.push({
        severity: 'warning',
        category: 'catalog',
        message: `${product.slug}: men's ring without width options`,
      });
    }

    if (!product.images?.length) {
      issues.push({
        severity: 'error',
        category: 'catalog',
        message: `${product.slug}: no hero images`,
      });
    }

    const publicRoot = path.join(process.cwd(), 'public');
    for (const image of product.images ?? []) {
      if (image.startsWith('http')) continue;
      const imagePath = path.join(publicRoot, image.replace(/^\//, ''));
      if (!fs.existsSync(imagePath)) {
        warnings.push({
          severity: 'warning',
          category: 'images',
          message: `${product.slug}: missing hero image ${image}`,
        });
      }
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
    } else if (JSON.stringify(products) !== JSON.stringify(duplicate)) {
      warnings.push({
        severity: 'warning',
        category: 'catalog-sync',
        message: 'Duplicate products.json files have matching slugs but different content',
      });
    }
  }

  const staleDocSlugs = ['nova'];
  for (const stale of staleDocSlugs) {
    if (!slugs.has(stale) && slugs.has('nova-oval-solitaire-round-marquise')) {
      warnings.push({
        severity: 'warning',
        category: 'docs-mismatch',
        message: `Documentation/seed SQL references slug "${stale}" but catalog uses "nova-oval-solitaire-round-marquise"`,
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
