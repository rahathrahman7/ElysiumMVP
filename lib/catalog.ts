// Removed top-level import to prevent build-time compilation of large products.ts file

export async function getFeatured() {
  const { getAllProducts } = await import('@/lib/products');
  return getAllProducts().filter(p => p.isFeatured);
}

export async function getProductsByCollection(handle: string) {
  const { getAllProducts } = await import('@/lib/products');
  const h = handle.toLowerCase();
  return getAllProducts().filter(p =>
    (p.collections || []).map(c => c.toLowerCase()).includes(h)
  );
}














