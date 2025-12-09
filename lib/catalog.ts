// Removed top-level import to prevent build-time compilation of large products.ts file

export async function getFeatured() {
  const { products } = await import('@/lib/products');
  return products.filter(p => p.isFeatured);
}

export async function getProductsByCollection(handle: string) {
  const { products } = await import('@/lib/products');
  const h = handle.toLowerCase();
  return products.filter(p => 
    (p.collections || []).map(c => c.toLowerCase()).includes(h)
  );
}














