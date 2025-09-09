"use client";

import Link from "next/link";
import { products } from "@/lib/products";
import { parseQuery } from "@/lib/filterSchema";
import { applyFilters } from "@/lib/applyFilters";
import FiltersDrawer from "@/components/filters/FiltersDrawer";
import FilterHeaderBar from "@/components/filters/FilterHeaderBar";
import FilterSections from "@/components/filters/FilterSections";
import CollectionGrid from "@/components/sections/CollectionGrid";
import { useState } from "react";

export default function CollectionPage({ params, searchParams }:{ params:{handle:string}, searchParams:Record<string,string|undefined> }){
  const fs = parseQuery(new URLSearchParams(searchParams as any));
  const filtered = applyFilters(products, fs);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Filter Header Bar */}
      <FilterHeaderBar 
        total={filtered.length} 
        onOpenFilters={() => setIsFiltersOpen(true)}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-serif text-2xl capitalize">{params.handle.replace(/-/g," ")}</h1>
          <Link 
            href="/wishlist" 
            className="inline-flex items-center gap-2 px-3 py-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors rounded-full border border-neutral-200 hover:border-neutral-300"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            </svg>
            Wishlist
          </Link>
        </div>

        <FilterSections />

        <div className="mt-6">
          <CollectionGrid 
            products={filtered} 
            title={filtered.length > 0 ? undefined : undefined}
          />
        </div>
      </div>

      {/* Filters Drawer with state management */}
      {isFiltersOpen && (
        <FiltersDrawer onClose={() => setIsFiltersOpen(false)} />
      )}
    </div>
  );
}
