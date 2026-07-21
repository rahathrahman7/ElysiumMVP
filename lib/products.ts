// Types are now in productTypes.ts - import from there for build optimization
// Re-export for backwards compatibility
export type {
  MetalOption,
  OriginOption,
  CaratOption,
  ColourOption,
  ClarityOption,
  CertOption,
  WidthOption,
  Product,
} from './productTypes';

export { METAL_HEX } from './productTypes';

import type { Product } from './productTypes';

// Products are loaded from JSON at runtime to prevent build-time compilation
// The JSON file is in public/data/products.json
let _products: Product[] | null = null;

// For server-side: load synchronously from filesystem
function loadProductsSync(): Product[] {
  if (_products) return _products;
  
  // Server-side loading
  if (typeof window === 'undefined') {
    try {
      // Use dynamic require to avoid build-time bundling
      const fs = require('fs');
      const path = require('path');
      const jsonPath = path.join(process.cwd(), 'public', 'data', 'products.json');
      
      if (!fs.existsSync(jsonPath)) {
        console.error(`[products.ts] products.json not found at: ${jsonPath}`);
        return [];
      }
      
      const data = fs.readFileSync(jsonPath, 'utf8');
      const parsed = JSON.parse(data) as Product[];
      _products = parsed;
      console.log(`[products.ts] Loaded ${parsed.length} products from ${jsonPath}`);
      return parsed;
    } catch (e) {
      console.error('[products.ts] Failed to load products.json:', e);
      return [];
    }
  }
  
  // Client-side: return empty until async load completes
  return [];
}

// Async loader for client-side
async function loadProductsAsync(): Promise<Product[]> {
  if (_products) return _products;
  
  try {
    const response = await fetch('/data/products.json');
    _products = await response.json();
    return _products!;
  } catch (e) {
    console.error('Failed to fetch products.json:', e);
    return [];
  }
}

export function isProductVisible(product: Product): boolean {
  return !product.isHidden;
}

function visibleProducts(products: Product[]): Product[] {
  return products.filter(isProductVisible);
}

// Export visible products as a getter to load on demand
export const products: Product[] = visibleProducts(loadProductsSync());

export function getAllProducts(): Product[] {
  return visibleProducts(loadProductsSync());
}

export function getAllProductsIncludingHidden(): Product[] {
  return loadProductsSync();
}

export function getProductBySlug(slug: string, options?: { includeHidden?: boolean }): Product | undefined {
  const products = loadProductsSync();
  const product = products.find(p => p.slug === slug);

  if (!product) {
    if (products.length > 0) {
      console.warn(`[products.ts] Product not found: "${slug}". Available slugs:`, products.slice(0, 5).map(p => p.slug));
    }
    return undefined;
  }

  if (!options?.includeHidden && product.isHidden) {
    return undefined;
  }

  return product;
}

// Async versions for client components
export async function getAllProductsAsync(): Promise<Product[]> {
  return visibleProducts(await loadProductsAsync());
}

export async function getProductBySlugAsync(slug: string, options?: { includeHidden?: boolean }): Promise<Product | undefined> {
  const products = await loadProductsAsync();
  const product = products.find(p => p.slug === slug);
  if (!product) return undefined;
  if (!options?.includeHidden && product.isHidden) return undefined;
  return product;
}
