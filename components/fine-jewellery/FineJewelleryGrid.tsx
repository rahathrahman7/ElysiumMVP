"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import useSWR from "swr";
import LuxuryProductCard from "@/components/ui/LuxuryProductCard";
import { useState } from "react";

const fetcher = (url: string) => fetch(url).then(r => r.json());

interface FineJewelleryGridProps {
  category?: string; // 'earrings' | 'bracelets' | 'necklaces' or undefined for all
  showFilters?: boolean;
}

export default function FineJewelleryGrid({ 
  category, 
  showFilters = true 
}: FineJewelleryGridProps) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Build query - combine with any URL params
  const queryParams = new URLSearchParams(params.toString());
  
  // If a specific category is passed, use it. Otherwise fetch all fine jewellery
  if (category) {
    queryParams.set("category", category);
  } else {
    // For the main landing page, we want earrings + bracelets
    // We'll need to handle this on the API side or make multiple requests
    // For now, let's use a special marker
    queryParams.set("fineJewellery", "true");
  }
  
  if (!queryParams.get("limit")) {
    queryParams.set("limit", "24");
  }

  const query = queryParams.toString();
  const { data, isLoading } = useSWR(`/api/products?${query}`, fetcher);

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value); else next.delete(key);
    if (key !== "page") next.delete("page");
    router.push(`${pathname}?${next.toString()}`);
  }

  const page = Number(params.get("page") || 1);
  const limit = Number(params.get("limit") || 24);
  const total = Number(data?.total || 0);
  const totalPages = total ? Math.max(1, Math.ceil(total / limit)) : 1;
  const products = data?.products ?? [];

  return (
    <div className="relative">
      <div className={`grid grid-cols-1 ${showFilters ? 'xl:grid-cols-[280px_1fr]' : ''} gap-8 xl:gap-12`}>
        {/* Filters Sidebar */}
        {showFilters && (
          <aside className="xl:sticky xl:top-24 h-fit">
            <button 
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="xl:hidden w-full mb-4 px-6 py-4 bg-white/80 backdrop-blur-xl border border-[#6D3D0D]/10 shadow-lg text-[#6D3D0D] font-medium tracking-wide hover:bg-white transition-all duration-300"
            >
              <span className="flex items-center justify-between">
                <span>Refine Selection</span>
                <svg className={`w-5 h-5 transition-transform duration-300 ${filtersOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>

            <div className={`xl:block ${filtersOpen ? 'block' : 'hidden'} space-y-6`}>
              <div className="bg-white/70 backdrop-blur-xl p-6 border border-[#6D3D0D]/10 shadow-xl">
                <h3 className="font-serif text-lg text-[#6D3D0D] mb-6 tracking-wide">Refine</h3>
                
                <div className="space-y-5">
                  <div className="group">
                    <label className="block text-xs font-medium text-[#6D3D0D]/60 mb-2 tracking-wider uppercase">Metal</label>
                    <select 
                      className="w-full bg-white/50 backdrop-blur-sm border border-[#6D3D0D]/10 px-4 py-3 text-[#6D3D0D] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all duration-300 hover:bg-white/70"
                      value={params.get("metal") ?? ""} 
                      onChange={(e) => updateParam("metal", e.target.value)}
                    >
                      <option value="">All Metals</option>
                      <option value="gold">18k Yellow Gold</option>
                      <option value="rose">18k Rose Gold</option>
                      <option value="white">18k White Gold</option>
                      <option value="platinum">Platinum</option>
                    </select>
                  </div>

                  <div className="group">
                    <label className="block text-xs font-medium text-[#6D3D0D]/60 mb-2 tracking-wider uppercase">Price Range</label>
                    <select 
                      className="w-full bg-white/50 backdrop-blur-sm border border-[#6D3D0D]/10 px-4 py-3 text-[#6D3D0D] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all duration-300 hover:bg-white/70"
                      value={params.get("price") ?? ""} 
                      onChange={(e) => updateParam("price", e.target.value)}
                    >
                      <option value="">All Prices</option>
                      <option value="0-100000">Under £1,000</option>
                      <option value="100000-300000">£1,000 — £3,000</option>
                      <option value="300000-9999999">£3,000+</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-[#6D3D0D]/10">
                  <div className="flex items-center text-sm text-[#6D3D0D]/60">
                    <div className="w-2 h-2 rounded-full bg-[#D4AF37] mr-3"></div>
                    <span className="tracking-wide">{total || 0} pieces</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <section className="relative">
          {/* Sort Bar */}
          <div className="mb-8 pb-6 border-b border-[#6D3D0D]/10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center text-[#6D3D0D]/60">
                <div className="w-1 h-6 bg-gradient-to-b from-[#D4AF37] to-[#B76E79] mr-4"></div>
                <span className="text-sm font-light tracking-wider">
                  {isLoading ? 'Loading...' : total ? `Showing ${products.length} of ${total} pieces` : 'No pieces found'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <label htmlFor="sort" className="text-xs text-[#6D3D0D]/60 font-light tracking-wider uppercase">Sort</label>
                <select
                  id="sort"
                  className="bg-white/60 backdrop-blur-sm border border-[#6D3D0D]/10 px-4 py-2 text-sm text-[#6D3D0D] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all duration-300 hover:bg-white/80"
                  value={params.get("sort") ?? "newest"}
                  onChange={(e) => updateParam("sort", e.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-[#6D3D0D]/5 mb-4"></div>
                  <div className="h-4 bg-[#6D3D0D]/5 w-3/4 mb-2"></div>
                  <div className="h-3 bg-[#6D3D0D]/5 w-1/2"></div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {products.map((product: any, index: number) => (
                <div 
                  key={product._id || product.slug}
                  className="stagger-item"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <LuxuryProductCard 
                    product={product} 
                    priority={index < 4}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-6 border border-[#D4AF37]/30 flex items-center justify-center">
                <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="font-serif text-xl text-[#6D3D0D] mb-2">No pieces found</h3>
              <p className="text-[#6D3D0D]/60 text-sm">Try adjusting your filters</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12 pt-8 border-t border-[#6D3D0D]/10">
              {page > 1 && (
                <button
                  onClick={() => updateParam("page", String(page - 1))}
                  className="px-4 py-2 border border-[#6D3D0D]/20 text-[#6D3D0D] text-sm hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors"
                >
                  Previous
                </button>
              )}
              
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .map((p, i, arr) => (
                  <span key={p} className="flex items-center">
                    {i > 0 && arr[i - 1] !== p - 1 && (
                      <span className="px-2 text-[#6D3D0D]/40">...</span>
                    )}
                    <button
                      onClick={() => updateParam("page", String(p))}
                      className={`w-10 h-10 flex items-center justify-center text-sm transition-colors ${
                        p === page
                          ? 'bg-[#6D3D0D] text-white'
                          : 'border border-[#6D3D0D]/20 text-[#6D3D0D] hover:border-[#D4AF37] hover:text-[#D4AF37]'
                      }`}
                    >
                      {p}
                    </button>
                  </span>
                ))
              }
              
              {page < totalPages && (
                <button
                  onClick={() => updateParam("page", String(page + 1))}
                  className="px-4 py-2 border border-[#6D3D0D]/20 text-[#6D3D0D] text-sm hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors"
                >
                  Next
                </button>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
