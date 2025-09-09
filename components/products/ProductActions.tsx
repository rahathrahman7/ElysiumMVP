"use client";

import Link from "next/link";
import { Product } from "@/lib/products";

interface ProductActionsProps {
  product: Product;
}

export function ProductActions({ product }: ProductActionsProps) {
  return (
    <div className="space-y-4">
      {/* Primary CTA */}
      <button className="w-full bg-charcoal text-white py-4 px-6 rounded-lg font-serif uppercase tracking-[0.08em] text-lg hover:bg-charcoal/90 transition-colors">
        Book Consultation
      </button>

      {/* Secondary Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/bespoke"
          className="btn-outline text-center py-3 px-4"
        >
          Bespoke Design
        </Link>
        <Link
          href="/education"
          className="btn-outline text-center py-3 px-4"
        >
          Learn More
        </Link>
      </div>

      {/* Trust Indicators */}
      <div className="pt-6 border-t border-beige">
        <div className="flex items-center justify-center gap-6 text-xs text-charcoal/60">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-gold rounded-full"></span>
            UK Hallmarked
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-gold rounded-full"></span>
            Lifetime Care
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-gold rounded-full"></span>
            London Atelier
          </div>
        </div>
      </div>
    </div>
  );
}








