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
// For client-side: will be loaded via fetch
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

// Export the products array (lazy loaded)
export const products: Product[] = new Proxy([] as Product[], {
  get(target, prop) {
    const loaded = loadProductsSync();
    if (prop === 'length') return loaded.length;
    if (prop === Symbol.iterator) return loaded[Symbol.iterator].bind(loaded);
    if (typeof prop === 'string' && !isNaN(Number(prop))) {
      return loaded[Number(prop)];
    }
    if (typeof prop === 'string' && prop in Array.prototype) {
      return (loaded as any)[prop].bind(loaded);
    }
    return (loaded as any)[prop];
  }
});

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
