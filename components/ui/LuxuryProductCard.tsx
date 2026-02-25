"use client";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { Product } from '@/lib/productTypes';
import { resolvePrimary } from '@/lib/imageResolver';
import WishHeart from '@/components/common/WishHeart';
import { useMemo, useState, useEffect } from 'react';

// Lazy load product lookup to avoid importing large products array at build time
let getLocalProductBySlug: ((slug: string) => Product | undefined) | null = null;
const loadProductLookup = async () => {
  if (!getLocalProductBySlug) {
    const mod = await import('@/lib/products');
    getLocalProductBySlug = mod.getProductBySlug;
  }
  return getLocalProductBySlug;
};

type Props = {
  product: Product;
  className?: string;
  priority?: boolean;
};

export default function LuxuryProductCard({ product, className = "", priority = false }: Props) {
  const [activeMetal, setActiveMetal] = useState<string | undefined>(undefined);
  const [localProduct, setLocalProduct] = useState<Product | undefined>(undefined);
  
  // Load local product data on mount
  useEffect(() => {
    loadProductLookup().then(lookup => {
      if (lookup) {
        setLocalProduct(lookup(product.slug));
      }
    });
  }, [product.slug]);
  
  const effective = (localProduct ? { ...product, ...localProduct } : product) as Product;
  const img = product.images?.[0];
  
  // Extract ring name from title (e.g. "Celeste — Six-Claw Solitaire" -> "Celeste")
  const ringName = product.title.split('—')[0].trim();
  
  // Format price with luxury styling
  const price = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(product.basePriceGBP);

  const metals = useMemo(() => (effective.metals || []).map(m => ({
    name: m.name,
    hex: m.hex,
    imageUrl: m.imageUrl
  })), [effective.metals]);

  // Check if product is an earring for hover image swap
  const isEarring = product.collections?.includes('earrings');
  
  // Compute hover image URL for earrings (dual if exists, otherwise side)
  const earringHoverImage = useMemo(() => {
    if (!isEarring) return null;
    
    const primaryImage = resolvePrimary(effective, activeMetal);
    const dualImage = primaryImage.replace('-front.', '-dual.');
    const sideImage = primaryImage.replace('-front.', '-side.');
    
    const productName = product.slug.toLowerCase();
    if (productName.includes('legacy')) {
      return dualImage;
    }
    return sideImage;
  }, [isEarring, effective, activeMetal, product.slug]);

  return (
    <Link 
      href={`/products/${product.slug}`}
      className={clsx(
        "group relative luxury-card block",
        "bg-gradient-to-b from-elysium-light/50 to-white",
        "rounded-sm overflow-hidden",
        "cursor-pointer",
        // CSS-only hover transform - optimized for performance
        "transform-gpu transition-transform duration-300 ease-out",
        "hover:-translate-y-2",
        className
      )}
      prefetch={true}
    >
      {/* Subtle shadow - always visible, no animation */}
      <div 
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)', zIndex: -1 }}
      />

      {/* Premium Badges - Hidden Halo only */}
      {(product.styles?.includes('hidden-halo') || product.collections?.includes('hidden-halo')) && (
        <div className="absolute left-4 top-4 z-20 pointer-events-none">
          <span className="inline-block px-2 py-1 text-[#45321e] text-[9px] font-medium tracking-[0.08em] uppercase border border-[#45321e]/20" style={{ backgroundColor: '#E8E2DA' }}>
            Hidden Halo
          </span>
        </div>
      )}

      {/* Wishlist - Premium Styling */}
      <div className="absolute right-4 top-4 z-20" data-no-navigate onClick={(e) => e.stopPropagation()}>
        <WishHeart 
          item={{ 
            slug: product.slug, 
            name: product.title, 
            price: product.basePriceGBP, 
            imageSrc: resolvePrimary(effective) 
          }} 
          size={18}
          className={clsx(
            "inline-flex h-8 w-8 items-center justify-center",
            "rounded-full",
            "bg-white/70",
            "hover:bg-white/90",
            "hover:scale-105 transition-all duration-300",
            "text-elysium-dark hover:text-elysium-dark/70 shadow-sm"
          )}
        />
      </div>

      {/* Product Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm" style={{ backgroundColor: '#E8E2DA' }}>
        {/* Gradient Overlay with Elysium Beige Tint */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#E8E2DA]/40 via-[#E8E2DA]/10 to-transparent z-10 pointer-events-none" />
        
          {img ? (
          <>
            {/* Main Image - CSS hover scale */}
            <Image
              src={resolvePrimary(effective, activeMetal)}
              alt={product.title}
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
              className={clsx(
                "object-cover object-center transform-gpu",
                "transition-transform duration-500 ease-out",
                "scale-100 group-hover:scale-105",
                // For earrings, fade out main image on hover
                isEarring && "transition-[transform,opacity] group-hover:opacity-0"
              )}
              priority={priority}
            />
            
            {/* Earring Hover Image (dual or side view) - CSS hover */}
            {isEarring && earringHoverImage && (
              <Image
                src={earringHoverImage}
                alt={`${product.title} - alternate view`}
                fill
                sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
                className="object-cover object-center transform-gpu transition-[transform,opacity] duration-500 ease-out scale-100 opacity-0 group-hover:scale-105 group-hover:opacity-100"
              />
            )}
          </>
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-elysium-light to-elysium-light/50">
            <div className="text-center text-elysium-dark">
              <div className="w-16 h-16 mx-auto mb-4 rounded-none bg-white/50 flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-sm font-light">Image Coming Soon</span>
            </div>
          </div>
        )}

      </div>

      {/* Product Information */}
      <div className="relative p-6 bg-gradient-to-b from-white/50 to-white/80" onMouseLeave={() => setActiveMetal(undefined)}>
        <h3 className="text-xl font-light text-elysium-dark mb-3 tracking-wide leading-tight text-center">
          {ringName}
        </h3>
        
        {/* Metal Swatches */}
        {metals.length > 0 && (
          <div className="flex items-center justify-center gap-2 mb-3" aria-label="Available metals" data-no-navigate onClick={(e) => e.stopPropagation()}>
            {metals.map((m) => (
              <button
                key={m.name}
                type="button"
                className={clsx(
                  "relative w-5 h-5 rounded-full border overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-elysium-dark transition-all duration-200",
                  activeMetal === m.name 
                    ? "ring-2 ring-elysium-dark ring-offset-1 shadow-lg scale-110" 
                    : "border-gray-300 hover:border-elysium-dark/60 hover:scale-105 shadow-sm"
                )}
                style={{
                  backgroundColor: !m.imageUrl ? (m.hex || undefined) : undefined,
                }}
                aria-label={`Preview in ${m.name}`}
                onMouseEnter={() => setActiveMetal(m.name)}
                onFocus={() => setActiveMetal(m.name)}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setActiveMetal(m.name);
                }}
              >
                {m.imageUrl && (
                  <Image
                    src={m.imageUrl}
                    alt={m.name}
                    width={20}
                    height={20}
                    className="object-cover w-full h-full"
                    quality={100}
                    sizes="20px"
                    unoptimized={true}
                  />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Description - smooth expand using grid (more performant than max-height) */}
        <div className="grid transition-[grid-template-rows,opacity] duration-300 ease-out grid-rows-[0fr] group-hover:grid-rows-[1fr] opacity-0 group-hover:opacity-100">
          <div className="overflow-hidden">
            <p className="text-sm text-[#45321e]/80 font-light leading-relaxed text-center tracking-wide pt-3">
              {product.blurb}
            </p>
          </div>
        </div>
        
        {/* Price Display - always visible */}
        {price && (
          <div className="text-center mt-3">
            <p className="text-lg font-light text-elysium-dark tracking-wide">
              From {price}
            </p>
          </div>
        )}

      </div>
    </Link>
  );
}
