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

function isMetalPackshot(src: string): boolean {
  return (
    /\/metal-(yellow|rose|white)\./i.test(src) ||
    /\/(yellow|rose|white)\.(jpg|jpeg|png)$/i.test(src) ||
    /\/01\.(jpg|jpeg|png)$/i.test(src) ||
    /Top_.*_(Yellow|White|Rose)_/i.test(src) ||
    /Front_.*_(Yellow|White|Rose)_/i.test(src)
  );
}

/** Lifestyle / editorial shots shared across metal variants (not packshots). */
function sharedLifestyleImages(p: ProductLike): string[] {
  return normalizeImages(p).filter((src) => src && !isMetalPackshot(src));
}

function resolveMetalGalleryKey(p: ProductLike, normalized?: string): string | undefined {
  if (!normalized || !('galleryByMetal' in p) || !p.galleryByMetal) return undefined;

  if (p.galleryByMetal[normalized]?.length) return normalized;

  // Two-tone fallbacks: use the closest solid-metal render we have
  if (normalized.includes('Two-Tone')) {
    if (/rose/i.test(normalized) && p.galleryByMetal['18k Rose Gold']?.length) {
      return '18k Rose Gold';
    }
    if (/yellow/i.test(normalized) && p.galleryByMetal['18k Yellow Gold']?.length) {
      return '18k Yellow Gold';
    }
    if (/platinum|white/i.test(normalized) && p.galleryByMetal['18k White Gold']?.length) {
      return '18k White Gold';
    }
  }

  return undefined;
}

function buildMetalGallery(p: ProductLike, metalImages: string[]): string[] {
  // Full per-metal set (e.g. Celeste front/side/back) — use as-is
  if (metalImages.length > 1) return metalImages;

  // Single metal hero (e.g. TMC imports): hero changes with metal, lifestyle shots shared
  const lifestyle = sharedLifestyleImages(p);
  const merged = [...metalImages, ...lifestyle.filter((src) => !metalImages.includes(src))];
  return merged.length ? merged : metalImages;
}

export function resolveGallery(p: ProductLike, metalLabel?: string, caratLabel?: string): string[] {
  const normalized = metalLabel ? NORMALIZE_METAL[metalLabel] ?? metalLabel : undefined;
  
  // First, try carat-specific gallery if both carat and metal are provided
  const fromCaratGallery = caratLabel && normalized && 'galleryByCaratAndMetal' in p 
    ? p.galleryByCaratAndMetal?.[caratLabel]?.[normalized]
    : undefined;
  
  // Fall back to metal-specific gallery
  const galleryKey = resolveMetalGalleryKey(p, normalized);
  const fromGallery = galleryKey && 'galleryByMetal' in p
    ? p.galleryByMetal?.[galleryKey]
    : undefined;
  
  // Fall back to base images
  const images = normalizeImages(p);
  const fromImages = images && images.length ? images : undefined;

  // final fallback to a safe placeholder
  const fallback = ["/products/placeholder.svg"];

  if (fromCaratGallery && fromCaratGallery.length) return fromCaratGallery;

  if (fromGallery && fromGallery.length) {
    return buildMetalGallery(p, fromGallery);
  }

  return fromImages && fromImages.length ? fromImages : fallback;
}

export function resolvePrimary(p: ProductLike, metalLabel?: string, caratLabel?: string): string {
  return resolveGallery(p, metalLabel, caratLabel)[0] ?? "/products/placeholder.svg";
}














