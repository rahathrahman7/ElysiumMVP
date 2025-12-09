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
      const data = fs.readFileSync(jsonPath, 'utf8');
      _products = JSON.parse(data);
      return _products!;
    } catch (e) {
      console.error('Failed to load products.json:', e);
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

// Export products as a getter to load on demand
export const products: Product[] = loadProductsSync();

export function getAllProducts(): Product[] {
  return loadProductsSync();
}

export function getProductBySlug(slug: string): Product | undefined {
  return loadProductsSync().find(p => p.slug === slug);
}

// Async versions for client components
export async function getAllProductsAsync(): Promise<Product[]> {
  return loadProductsAsync();
}

export async function getProductBySlugAsync(slug: string): Promise<Product | undefined> {
  const products = await loadProductsAsync();
  return products.find(p => p.slug === slug);
}
