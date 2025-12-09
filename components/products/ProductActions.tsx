"use client";

import Link from "next/link";
import { Product } from "@/lib/products";

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
  // Client's "Meet in the Middle" business model:
  // Entry-level (Lab, 1ct, F, VS1) = Buy Now
  // Any upgrade OR Natural = Inquire
  const showBuyNow = isEntryLevel && !isNaturalDiamond;
  const showInquire = !isEntryLevel || isNaturalDiamond;

  return (
    <div className="space-y-4">
      {/* Primary CTA - Dynamic based on configuration */}
      {showBuyNow && (
        <button
          onClick={onAddToBag}
          disabled={!canAddToBag}
          className={`w-full py-3 px-6 font-serif uppercase tracking-[0.08em] text-base transition-all duration-300 ${
            canAddToBag
              ? "bg-white text-[#753600] border border-[#753600] hover:bg-[#753600] hover:text-white"
              : "bg-gray-100 text-gray-400 border border-gray-300 cursor-not-allowed"
          }`}
        >
          Add to Bag
        </button>
      )}

      {showInquire && (
        <Link
          href="/contact"
          className="block w-full bg-white text-[#753600] border border-[#753600] py-3 px-6 font-serif uppercase tracking-[0.08em] text-base hover:bg-[#753600] hover:text-white transition-all duration-300 text-center"
        >
          Inquire
        </Link>
      )}

      {/* Secondary Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/contact"
          className="border-2 border-gray-300 hover:border-[#753600] text-gray-900 text-center py-3 px-4 rounded-lg text-sm font-medium transition-colors"
        >
          Book Consultation
        </Link>
        <Link
          href="/education"
          className="border-2 border-gray-300 hover:border-[#753600] text-gray-900 text-center py-3 px-4 rounded-lg text-sm font-medium transition-colors"
        >
          Learn More
        </Link>
      </div>

      {/* Trust Indicators */}
      <div className="pt-6 border-t border-gray-200">
        <div className="flex items-center justify-center gap-6 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#FFD700] rounded-full"></span>
            UK Hallmarked
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#FFD700] rounded-full"></span>
            Lifetime Care
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#FFD700] rounded-full"></span>
            London Atelier
          </div>
        </div>
      </div>
    </div>
  );
}














