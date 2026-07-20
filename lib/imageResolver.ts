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
    /(yellow|rose|white)-front\.(jpg|jpeg|png)$/i.test(src) ||
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

/** True for rings whose galleries come from TMC renders (imported or swapped in). */
export function isTmcGalleryProduct(p: ProductLike): boolean {
  const srcs: string[] = [
    ...normalizeImages(p),
    ...('galleryByMetal' in p && p.galleryByMetal
      ? Object.values(p.galleryByMetal).flat()
      : []),
  ];
  return srcs.some(
    (s) => typeof s === 'string' && (s.includes('/tmc-import/') || /-tmc-/.test(s))
  );
}

// Fixed metal order so the combined thumbnail strip is stable across swatch clicks.
const METAL_DISPLAY_ORDER = ['18k Yellow Gold', '18k White Gold', '18k Rose Gold', 'Platinum'];

/**
 * Combined gallery containing every metal's packshots (all colours) followed by
 * any shared lifestyle shots. Order is fixed (not dependent on the selected
 * metal) so the thumbnail strip stays put while the hero switches. Dedupes so
 * metals that reuse the same render (e.g. Platinum -> White) don't repeat.
 */
export function resolveAllMetalGallery(p: ProductLike): string[] {
  if (!('galleryByMetal' in p) || !p.galleryByMetal) {
    return resolveGallery(p);
  }

  const seen = new Set<string>();
  const ordered: string[] = [];
  const push = (arr?: string[]) => {
    for (const s of arr || []) {
      if (s && s.trim() !== '' && !seen.has(s)) {
        seen.add(s);
        ordered.push(s);
      }
    }
  };

  for (const key of METAL_DISPLAY_ORDER) push(p.galleryByMetal[key]);
  // Any metals outside the canonical order (two-tone, etc.)
  for (const [key, arr] of Object.entries(p.galleryByMetal)) {
    if (!METAL_DISPLAY_ORDER.includes(key)) push(arr);
  }
  // Shared editorial / lifestyle shots last
  push(sharedLifestyleImages(p));

  return ordered.length ? ordered : resolveGallery(p);
}

/** First packshot for a metal, used to point the hero at the selected swatch. */
export function firstImageForMetal(p: ProductLike, metalLabel?: string): string | undefined {
  const normalized = metalLabel ? NORMALIZE_METAL[metalLabel] ?? metalLabel : undefined;
  const key = resolveMetalGalleryKey(p, normalized);
  if (key && 'galleryByMetal' in p) return p.galleryByMetal?.[key]?.[0];
  return undefined;
}














