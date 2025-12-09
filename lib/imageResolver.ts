import type { Product } from "@/lib/productTypes";
import type { ProductListItem } from "@/types/product";

// Union type to handle both local and API product formats
type ProductLike = Product | ProductListItem;

// maps common variants to the keys used in galleryByMetal
const NORMALIZE_METAL: Record<string,string> = {
  "18k Yellow": "18k Yellow Gold",
  "18k Yellow Gold": "18k Yellow Gold",
  "Yellow Gold": "18k Yellow Gold",
  "18k White": "18k White Gold",
  "18k White Gold": "18k White Gold",
  "White Gold": "18k White Gold",
  "18k Rose": "18k Rose Gold",
  "18k Rose Gold": "18k Rose Gold",
  "Rose Gold": "18k Rose Gold",
  "Platinum": "Platinum",
  "Pt": "Platinum"
};

// Helper to normalize images to string array
function normalizeImages(product: ProductLike): string[] {
  if (!product.images) return [];
  
  // Check if it's the API format (array of objects with url property)
  if (product.images.length > 0 && typeof product.images[0] === 'object' && 'url' in product.images[0]) {
    return (product.images as Array<{url: string}>).map(img => img.url);
  }
  
  // It's the local format (array of strings)
  return product.images as string[];
}

export function resolveGallery(p: ProductLike, metalLabel?: string): string[] {
  const normalized = metalLabel ? NORMALIZE_METAL[metalLabel] ?? metalLabel : undefined;
  const fromGallery = normalized && 'galleryByMetal' in p && p.galleryByMetal?.[normalized];
  const images = normalizeImages(p);
  const fromImages = images && images.length ? images : undefined;

  // final fallback to a safe placeholder
  const fallback = ["/products/placeholder.svg"];

  return fromGallery && fromGallery.length
    ? fromGallery
    : fromImages && fromImages.length
      ? fromImages
      : fallback;
}

export function resolvePrimary(p: ProductLike, metalLabel?: string): string {
  return resolveGallery(p, metalLabel)[0] ?? "/products/placeholder.svg";
}














