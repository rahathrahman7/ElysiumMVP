import type { Product } from "@/lib/products";

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

export function resolveGallery(p: Product, metalLabel?: string): string[] {
  const normalized = metalLabel ? NORMALIZE_METAL[metalLabel] ?? metalLabel : undefined;
  const fromGallery = normalized && p.galleryByMetal?.[normalized];
  const fromImages  = p.images && p.images.length ? p.images : undefined;

  // final fallback to a safe placeholder
  const fallback = ["/products/placeholder.svg"];

  return fromGallery && fromGallery.length
    ? fromGallery
    : fromImages && fromImages.length
      ? fromImages
      : fallback;
}

export function resolvePrimary(p: Product, metalLabel?: string): string {
  return resolveGallery(p, metalLabel)[0] ?? "/products/placeholder.svg";
}








