"use client";
import Link from "next/link";
import Image from "next/image";
import useRecentlyViewed from "@/hooks/useRecentlyViewed";
import type { SavedItem } from "@/lib/storage";

export default function RecentlyViewed({ current }: { current: SavedItem }) {
  const items = useRecentlyViewed(current).filter(i => i.slug !== current.slug);
  if (!items.length) return null;
  return (
    <section className="mt-16 pt-12 border-t border-neutral-100">
      <div className="text-center mb-8">
        <h3 className="font-serif text-2xl text-neutral-900 mb-2">Recently Viewed</h3>
        <p className="text-sm text-neutral-600">Continue exploring our collection</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {items.map((p) => (
          <Link key={p.slug} href={`/products/${p.slug}`} className="block hover:scale-[1.02] transition-transform">
            <div className="relative aspect-[4/5] overflow-hidden border border-neutral-200 bg-[rgba(248,244,236,1)] transition-all duration-300">
              {p.imageSrc ? (
                <Image 
                  src={p.imageSrc} 
                  alt={p.name} 
                  fill 
                  className="object-contain p-1 transition-transform duration-300 hover:scale-105" 
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center bg-neutral-50 text-neutral-400">
                  <span className="text-xs">Image</span>
                </div>
              )}
            </div>
            
            <div className="mt-3 text-center">
              <div className="font-medium text-sm text-neutral-900 hover:text-neutral-700 transition-colors">
                {p.name}
              </div>
              {p.price && (
                <div className="text-xs text-neutral-600 mt-1">
                  From {typeof p.price === "number" ? 
                    new Intl.NumberFormat("en-GB", {
                      style: "currency", 
                      currency: "GBP", 
                      maximumFractionDigits: 0
                    }).format(p.price) : 
                    p.price
                  }
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
