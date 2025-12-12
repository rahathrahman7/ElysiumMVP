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
  const [isHovered, setIsHovered] = useState(false);
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
    hex: m.hex
  })), [effective.metals]);

  return (
    <Link 
      href={`/products/${product.slug}`}
      className={clsx(
        "group relative luxury-card transform-gpu transition-all duration-500 ease-out touch-manipulation block",
        "bg-gradient-to-b from-elysium-light/50 to-white",
        "rounded-lg overflow-hidden",
        "hover:scale-[1.03] hover:shadow-2xl hover:shadow-elysium-dark/20",
        "before:absolute before:inset-0 before:rounded-lg before:pointer-events-none",
        "before:bg-gradient-to-b before:from-elysium-dark/5 before:to-transparent",
        "before:opacity-0 before:transition-opacity before:duration-300",
        "hover:before:opacity-100",
        "cursor-pointer",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      prefetch={true}
    >
      {/* Premium Badge */}
      {product.isFeatured && (
        <div className="absolute left-4 top-4 z-20 pointer-events-none">
          <span className="px-2 py-1 bg-white/80 backdrop-blur-sm text-[#45321e] text-[10px] font-light tracking-wide uppercase border border-[#45321e]/30 shadow-sm">
            Signature
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
            "rounded-full backdrop-blur-xl",
            "bg-white/70",
            "hover:bg-white/90",
            "hover:scale-105 transition-all duration-300",
            "text-elysium-dark hover:text-elysium-dark/70 shadow-sm"
          )}
        />
      </div>

      {/* Product Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden">
        {/* Gradient Overlay for Luxury Effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent z-10 pointer-events-none" />
        
        {img ? (
          <>
            {/* Main Image */}
            <Image
              src={resolvePrimary(effective, activeMetal)}
              alt={product.title}
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
              className={clsx(
                "object-cover transition-all duration-700 ease-out",
                isHovered ? "scale-110 brightness-110" : "scale-100"
              )}
              priority={priority}
            />
            
            {/* Shimmer Effect on Hover */}
            <div className={clsx(
              "absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent",
              "transform -skew-x-12 transition-transform duration-1000",
              "pointer-events-none",
              isHovered ? "translate-x-full" : "-translate-x-full"
            )} />
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

        {/* Hover Overlay with Premium CTA */}
        <div className={clsx(
          "absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent",
          "flex items-end justify-center p-6 transition-all duration-300",
          "pointer-events-none",
          isHovered ? "opacity-100" : "opacity-0"
        )}>
          <div className="transform transition-all duration-300 translate-y-4 group-hover:translate-y-0">
            <span className="inline-flex items-center px-6 py-3 text-elysium-dark font-medium text-sm tracking-wide shadow-2xl border border-transparent" style={{ backgroundColor: "var(--elysium-champagne)" }}>
              View Collection
              <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </div>
        </div>
      </div>

      {/* Product Information */}
      <div className="relative p-6 bg-gradient-to-b from-white/50 to-white/80 backdrop-blur-sm" onMouseLeave={() => setActiveMetal(undefined)}>
        <h3 className="text-xl font-light text-elysium-dark mb-2 tracking-wide leading-tight text-center">
          {ringName}
        </h3>
        
        {/* Metal Swatches */}
        {metals.length > 0 && (
          <div className="mt-2 flex items-center justify-center gap-2" aria-label="Available metals" data-no-navigate onClick={(e) => e.stopPropagation()}>
            {metals.map((m) => (
              <button
                key={m.name}
                type="button"
                className={clsx(
                  "w-5 h-5 rounded-full border shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] relative z-10",
                  activeMetal === m.name ? "ring-2 ring-elysium-dark" : "border-gray-200"
                )}
                style={{ backgroundColor: m.hex || undefined }}
                aria-label={`Preview in ${m.name}`}
                onMouseEnter={() => setActiveMetal(m.name)}
                onFocus={() => setActiveMetal(m.name)}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setActiveMetal(m.name);
                }}
              />
            ))}
          </div>
        )}


        {/* Description - show on hover */}
        {isHovered && (
          <div className="mt-4 relative transition-all duration-500 ease-out animate-fade-in-up">
            <div className="px-6 py-3">
              {/* Subtle decorative line above */}
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#45321e]/40 to-transparent mx-auto mb-3" />

              <p className="text-sm text-[#45321e]/90 font-light leading-[1.6] text-center tracking-[0.02em] max-w-xs mx-auto">
                {product.blurb}
              </p>

              {/* Subtle decorative line below */}
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#45321e]/40 to-transparent mx-auto mt-3" />
            </div>
          </div>
        )}
        
        {/* Price Display - always visible */}
        {price && (
          <div className={`text-center transition-all duration-300 ${isHovered ? "mt-4" : "mt-3"}`}>
            <p className="text-lg font-light text-elysium-dark tracking-wide">
              From {price}
            </p>
          </div>
        )}

        {/* Bottom Accent Line */}
        <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-elysium-dark/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Premium Shadow Effect */}
    </Link>
  );
}
