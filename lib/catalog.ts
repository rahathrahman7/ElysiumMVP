import { products } from "@/lib/products";

export function getFeatured() {
  return products.filter(p => p.isFeatured);
}

export function getProductsByCollection(handle: string) {
  const h = handle.toLowerCase();
  return products.filter(p => 
    (p.collections || []).map(c => c.toLowerCase()).includes(h)
  );
}














