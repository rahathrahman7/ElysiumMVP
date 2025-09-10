import Link from "next/link";
import { Suspense } from "react";
import { ShopGrid } from "@/components/ShopGrid";

export default function ShopPage() {
  return (
    <div className="min-h-screen py-8 bg-elysium-ivory">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-4xl md:text-5xl uppercase tracking-[0.1em] text-elysium-charcoal">Collections</h1>
          <Link 
            href="/wishlist" 
            className="inline-flex items-center gap-2 px-4 py-3 text-sm  border transition-all duration-300 hover:scale-105 luxury-wishlist-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            </svg>
            Wishlist
          </Link>
        </div>
        <Suspense fallback={<div className="text-center py-20 text-elysium-charcoal">Loading luxury collection…</div>}>
          <ShopGrid />
        </Suspense>
      </div>
    </div>
  );
}