"use client";

import Link from "next/link";
import { Product } from "@/lib/productTypes";

interface ProductActionsProps {
  product: Product;
  isEntryLevel: boolean;
  isNaturalDiamond: boolean;
  onAddToBag: () => void;
  canAddToBag: boolean;
}

export function ProductActions({
  product,
  isEntryLevel,
  isNaturalDiamond,
  onAddToBag,
  canAddToBag,
}: ProductActionsProps) {
  // Business logic:
  // - Lab Grown 1ct = Direct purchase (Add to Bag)
  // - Lab Grown >1ct = Enquire
  // - All Natural diamonds = Enquire
  const showBuyNow = isEntryLevel && !isNaturalDiamond;
  const showEnquire = !showBuyNow;

  return (
    <div className="space-y-5">
      {/* Primary CTA - Luxurious Filled Button with Shimmer */}
      {showBuyNow && (
        <button
          onClick={onAddToBag}
          disabled={!canAddToBag}
          className={`group relative w-full py-[18px] px-6 rounded font-serif text-[12px] font-medium uppercase tracking-[0.2em] transition-all duration-300 overflow-hidden ${
            canAddToBag
              ? "bg-[#6D3D0D] text-white hover:bg-[#5A3009] hover:-translate-y-[2px] hover:shadow-[0_4px_16px_rgba(109,61,13,0.2)]"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          <span className="relative z-10">Add to Bag</span>
          {/* Shimmer Effect */}
          {canAddToBag && (
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          )}
        </button>
      )}

      {showEnquire && (
        <Link
          href="/contact"
          className="group relative block w-full py-[18px] px-6 rounded font-serif text-[12px] font-medium uppercase tracking-[0.2em] bg-[#6D3D0D] text-white hover:bg-[#5A3009] hover:-translate-y-[2px] hover:shadow-[0_4px_16px_rgba(109,61,13,0.2)] transition-all duration-300 text-center overflow-hidden"
        >
          <span className="relative z-10">Enquire</span>
          {/* Shimmer Effect */}
          <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        </Link>
      )}

      {/* Secondary Actions - Text Links */}
      <div className="flex items-center justify-center gap-2 pt-1">
        <Link
          href="/contact"
          className="font-serif text-[11px] uppercase tracking-[0.15em] text-[#6D3D0D]/60 hover:text-[#D4AF37] transition-colors duration-200"
        >
          Book Consultation
        </Link>
        <span className="text-[#6D3D0D]/30">·</span>
        <Link
          href="/education"
          className="font-serif text-[11px] uppercase tracking-[0.15em] text-[#6D3D0D]/60 hover:text-[#D4AF37] transition-colors duration-200"
        >
          Learn More
        </Link>
      </div>

      {/* Trust Indicators - Refined */}
      <div className="pt-5">
        <div className="flex items-center justify-center gap-5 flex-wrap">
          <div className="flex items-center gap-1.5 text-[10px] font-serif tracking-[0.1em] text-[#6D3D0D]/50">
            <span className="text-[#D4AF37]/70">◆</span>
            UK Hallmarked
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-serif tracking-[0.1em] text-[#6D3D0D]/50">
            <span className="text-[#D4AF37]/70">◆</span>
            Lifetime Care
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-serif tracking-[0.1em] text-[#6D3D0D]/50">
            <span className="text-[#D4AF37]/70">◆</span>
            London Atelier
          </div>
        </div>
      </div>
    </div>
  );
}














