"use client";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { useMemo, useState, useEffect } from "react";
import { Product } from '@/lib/productTypes';
import { resolvePrimary } from '@/lib/imageResolver';
import WishHeart from '@/components/common/WishHeart';

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
};

export default function ProductCard({ product, className = "" }: Props) {
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
  const price = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(product.basePriceGBP);

  // Distinct metals by label with optional color swatches
  const metals = useMemo(() => (effective.metals || []).map(m => ({
    name: m.name,
    hex: m.hex,
    imageUrl: m.imageUrl
  })), [effective.metals]);

  return (
    <div className={clsx(
      "group relative rounded-2xl bg-[var(--card-bg)] ring-1 ring-[var(--line)] shadow-[0_0_0_0_rgba(0,0,0,0)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:ring-2 hover:ring-gold/20 transform-gpu hover:scale-[1.02] transition-all duration-300",
      className
    )}>
      {/* Media */}
      <Link href={`/products/${product.slug}`} aria-label={product.title}
        onMouseLeave={() => setActiveMetal(undefined)}
      >
        <div className="relative overflow-hidden rounded-t-2xl aspect-[4/5] transition-all duration-300" style={{ backgroundColor: '#E8E2DA' }}>
          {img ? (
            <Image
              src={resolvePrimary(effective, activeMetal)}
              alt={product.title}
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              priority={false}
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-[var(--ink-soft)]" style={{ backgroundColor: '#E8E2DA' }}>
              <span className="text-xs">Image coming soon</span>
            </div>
          )}
          
          {/* Overlay CTA */}
          <div className="pointer-events-none absolute inset-0 flex items-end justify-end p-3 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
            <span className="sans text-[12px] tracking-wide px-3 py-1 rounded-full bg-white/90 backdrop-blur border border-gold/20 text-charcoal animate-slide-in-right">
              View details →
            </span>
          </div>
          
          {/* Shimmer Effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shimmer" />
          </div>
          
          {/* Badge */}
          {product.isFeatured ? (
            <span className="absolute left-3 top-3 rounded-full border border-gold/30 bg-white/90 px-3 py-1 text-[11px] tracking-wide text-gold font-medium animate-bounce-gentle">
              FEATURED
            </span>
          ) : null}
        </div>
      </Link>

      {/* Wishlist */}
      <div className="absolute right-2 top-2">
        <WishHeart 
          item={{ 
            slug: product.slug, 
            name: product.title, 
            price: product.basePriceGBP, 
            imageSrc: resolvePrimary(effective) 
          }} 
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/85 backdrop-blur ring-1 ring-[var(--line)] hover:ring-[var(--ring)] transition text-[var(--ink-soft)]" 
        />
      </div>

      {/* Content */}
      <div className="px-3 pt-3 pb-4">
        <Link href={`/products/${product.slug}`} className="block group-hover:text-gold transition-colors duration-200">
          <h3 className="eb-serif text-[17px] leading-tight tracking-wide text-[var(--ink)] group-hover:text-charcoal">
            {product.title}
          </h3>
        </Link>
        <div className="mt-1 flex items-center justify-between">
          <p className="sans text-[13px] text-[var(--ink-soft)] group-hover:text-gray-700 transition-colors duration-200">
            Ring size guide · 18k & platinum
          </p>
          {price && (
            <p className="sans text-[13px] font-medium text-[var(--ink-soft)] group-hover:text-gold transition-colors duration-200">{price}</p>
          )}
        </div>

        {/* Metal Swatches */}
        {metals.length > 0 && (
          <div className="mt-3 flex items-center gap-2" aria-label="Available metals">
            {metals.map((m) => (
              <button
                key={m.name}
                type="button"
                className={clsx(
                  "relative w-5 h-5 rounded-full border shadow-sm overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
                  activeMetal === m.name ? "ring-2 ring-gold" : "border-gray-200"
                )}
                style={!m.imageUrl ? { backgroundColor: m.hex || undefined } : undefined}
                aria-label={`Preview in ${m.name}`}
                onMouseEnter={() => setActiveMetal(m.name)}
                onFocus={() => setActiveMetal(m.name)}
                onClick={(e) => { e.preventDefault(); setActiveMetal(m.name);} }
              >
                {m.imageUrl && (
                  <Image
                    src={m.imageUrl}
                    alt={m.name}
                    width={20}
                    height={20}
                    className="w-full h-full object-cover"
                    quality={90}
                  />
                )}
              </button>)
            )}
          </div>
        )}
      </div>
      
      {/* Bottom Glow Effect */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}
