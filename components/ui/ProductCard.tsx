"use client";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { Product } from '@/lib/products';
import { resolvePrimary } from '@/lib/imageResolver';
import WishHeart from '@/components/common/WishHeart';

type Props = {
  product: Product;
  className?: string;
};

export default function ProductCard({ product, className = "" }: Props) {
  const img = product.images?.[0];
  const price = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(product.basePriceGBP / 100);

  return (
    <div className={clsx(
      "group relative rounded-2xl bg-[var(--card-bg)] ring-1 ring-[var(--line)] shadow-[0_0_0_0_rgba(0,0,0,0)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:ring-2 hover:ring-gold/20 transform-gpu hover:scale-[1.02] transition-all duration-300",
      className
    )}>
      {/* Media */}
      <Link href={`/products/${product.slug}`} aria-label={product.title}>
        <div className="relative overflow-hidden rounded-t-2xl aspect-[4/5] bg-[#f5f3ef] group-hover:bg-gradient-to-br group-hover:from-ivory group-hover:to-beige transition-all duration-300">
          {img ? (
            <Image
              src={resolvePrimary(product)}
              alt={product.title}
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              priority={false}
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-[#f5f3ef] text-[var(--ink-soft)]">
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
            price: product.basePriceGBP / 100, 
            imageSrc: resolvePrimary(product) 
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
      </div>
      
      {/* Bottom Glow Effect */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}
