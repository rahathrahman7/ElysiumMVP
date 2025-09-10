"use client";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { Product } from '@/lib/products';
import { resolvePrimary } from '@/lib/imageResolver';
import WishHeart from '@/components/common/WishHeart';
import { useState } from 'react';

type Props = {
  product: Product;
  className?: string;
  priority?: boolean;
};

export default function LuxuryProductCard({ product, className = "", priority = false }: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const img = product.images?.[0];
  
  // Extract ring name from title (e.g. "Celeste — Six-Claw Solitaire" -> "Celeste")
  const ringName = product.title.split('—')[0].trim();
  
  // Format price with luxury styling
  const price = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(product.basePriceGBP / 100);

  return (
    <div 
      className={clsx(
        "group relative luxury-card transform-gpu transition-all duration-500 ease-out",
        "bg-gradient-to-b from-elysium-ivory to-elysium-pearl",
        " overflow-hidden",
        "hover:scale-[1.03] hover:shadow-2xl hover:shadow-elysium-gold/10",
        "before:absolute before:inset-0 before:",
        "before:bg-gradient-to-b before:from-elysium-shimmer before:to-transparent",
        "before:opacity-0 before:transition-opacity before:duration-300",
        "hover:before:opacity-100",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Premium Badge */}
      {product.isFeatured && (
        <div className="absolute left-4 top-4 z-20">
          <div className="relative">
            <div className="absolute inset-0 bg-elysium-gold rounded-sm blur opacity-60" />
            <span className="relative block px-3 py-1.5 bg-gradient-to-r from-elysium-gold to-amber-500 text-black text-xs font-medium tracking-[0.1em] uppercase rounded-sm shadow-lg">
              Signature
            </span>
          </div>
        </div>
      )}

      {/* Wishlist - Premium Styling */}
      <div className="absolute right-4 top-4 z-20">
        <WishHeart 
          item={{ 
            slug: product.slug, 
            name: product.title, 
            price: product.basePriceGBP / 100, 
            imageSrc: resolvePrimary(product) 
          }} 
          size={18}
          className={clsx(
            "inline-flex h-8 w-8 items-center justify-center",
            "rounded-full backdrop-blur-xl",
            "bg-white/70",
            "hover:bg-white/90",
            "hover:scale-105 transition-all duration-300",
            "text-elysium-smoke hover:text-elysium-gold shadow-sm"
          )}
        />
      </div>

      {/* Product Image Container */}
      <Link href={`/products/${product.slug}`} aria-label={product.title}>
        <div className="relative aspect-[4/5] overflow-hidden">
          {/* Gradient Overlay for Luxury Effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent z-10" />
          
          {img ? (
            <>
              {/* Main Image */}
              <Image
                src={resolvePrimary(product)}
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
                "absolute inset-0 bg-gradient-to-r from-transparent via-elysium-shimmer to-transparent",
                "transform -skew-x-12 transition-transform duration-1000",
                isHovered ? "translate-x-full" : "-translate-x-full"
              )} />
            </>
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-elysium-pearl to-elysium-champagne">
              <div className="text-center text-elysium-smoke">
                <div className="w-16 h-16 mx-auto mb-4 rounded-none bg-elysium-whisper flex items-center justify-center">
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
            isHovered ? "opacity-100" : "opacity-0"
          )}>
            <div className="transform transition-all duration-300 translate-y-4 group-hover:translate-y-0">
              <span className="inline-flex items-center px-6 py-3 bg-white/95 backdrop-blur-xl  text-elysium-obsidian font-medium text-sm tracking-wide shadow-2xl border border-white/50">
                View Collection
                <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Product Information */}
      <div className="relative p-6 bg-gradient-to-b from-white/50 to-white/80 backdrop-blur-sm">
        <Link href={`/products/${product.slug}`} className="block group-hover:text-elysium-gold transition-colors duration-300">
          <h3 className="text-xl font-light text-elysium-obsidian mb-2 tracking-wide leading-tight text-center">
            {ringName}
          </h3>
        </Link>
        
{/* Show description on hover - positioned below title */}
        <div className={clsx(
          "transition-all duration-300 mt-2",
          isHovered ? "opacity-100 max-h-20" : "opacity-0 max-h-0 overflow-hidden"
        )}>
          <p className="text-sm text-elysium-charcoal font-light tracking-wide leading-relaxed text-center px-2">
            {product.blurb}
          </p>
        </div>
        
        {/* Price Display - always visible */}
        {price && (
          <div className={clsx("text-center transition-all duration-300", isHovered ? "mt-4" : "mt-2")}>
            <p className="text-lg font-light text-elysium-charcoal tracking-wide">
              From {price}
            </p>
          </div>
        )}

        {/* Bottom Accent Line */}
        <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-elysium-gold/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Premium Shadow Effect */}
    </div>
  );
}