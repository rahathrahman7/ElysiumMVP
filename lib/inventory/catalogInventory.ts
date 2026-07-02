import fs from 'fs';
import path from 'path';
import { buildVariantKey } from './variantKey';

export interface CatalogProduct {
  slug: string;
  title: string;
  metals?: { name: string }[];
  sizes?: string[];
}

const PRODUCTS_PATH = path.join(process.cwd(), 'public', 'data', 'products.json');

export function loadCatalogProducts(): CatalogProduct[] {
  if (!fs.existsSync(PRODUCTS_PATH)) {
    throw new Error(`Catalog not found at ${PRODUCTS_PATH}`);
  }
  return JSON.parse(fs.readFileSync(PRODUCTS_PATH, 'utf8')) as CatalogProduct[];
}

export interface InventorySeedRow {
  productSlug: string;
  variantKey: string;
  stockLevel: number;
  reservedStock: number;
  lowStockThreshold: number;
}

function stockLevelForVariant(productSlug: string, variantKey: string): number {
  let hash = 0;
  const key = `${productSlug}:${variantKey}`;
  for (let i = 0; i < key.length; i++) {
    hash = (hash + key.charCodeAt(i) * (i + 1)) % 10;
  }
  return 3 + hash;
}

export function buildInventoryRowsForProduct(product: CatalogProduct): InventorySeedRow[] {
  if (!product.metals?.length) return [];

  const sizes = product.sizes?.length ? product.sizes : ['one-size'];
  const rows: InventorySeedRow[] = [];

  for (const metal of product.metals) {
    for (const size of sizes) {
      const variantKey = buildVariantKey(metal.name, size);
      rows.push({
        productSlug: product.slug,
        variantKey,
        stockLevel: stockLevelForVariant(product.slug, variantKey),
        reservedStock: 0,
        lowStockThreshold: metal.name.toLowerCase().includes('platinum') ? 2 : 3,
      });
    }
  }

  return rows;
}

export function buildInventoryRowsFromCatalog(products: CatalogProduct[] = loadCatalogProducts()): InventorySeedRow[] {
  return products.flatMap(buildInventoryRowsForProduct);
}

export function getExpectedVariantKeys(product: CatalogProduct): string[] {
  return buildInventoryRowsForProduct(product).map((row) => row.variantKey);
}
