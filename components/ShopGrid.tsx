"use client";
import { useSearchParams, useRouter } from "next/navigation";
import useSWR from "swr";
import LuxuryProductCard from "@/components/ui/LuxuryProductCard";
import { useState } from "react";
import { facets } from "@/lib/filterSchema";

const fetcher = (url: string) => fetch(url).then(r=>r.json());

export function ShopGrid() {
  const params = useSearchParams();
  const router = useRouter();
  const query = params.toString();
  const { data } = useSWR(`/api/products?${query}`, fetcher);
  const [filtersOpen, setFiltersOpen] = useState(false);

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value); else next.delete(key);
    if (key !== "page") next.delete("page");
    router.push(`/shop?${next.toString()}`);
  }

  const page = Number(params.get("page") || 1);
  const limit = Number(params.get("limit") || 12);
  const total = Number(data?.total || 0);
  const totalPages = total ? Math.max(1, Math.ceil(total / limit)) : 1;

  return (
    <div className="relative">
      <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-8 xl:gap-12">
        {/* Filters Sidebar */}
        <aside className="xl:sticky xl:top-24 h-fit">
          <button 
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="xl:hidden w-full mb-4 px-6 py-4 bg-white/80 backdrop-blur-xl border border-elysium-whisper shadow-lg text-elysium-obsidian font-medium tracking-wide hover:bg-white transition-all duration-300"
          >
            <span className="flex items-center justify-between">
              <span>Refine Collection</span>
              <svg className={`w-5 h-5 transition-transform duration-300 ${filtersOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>

          <div className={`xl:block ${filtersOpen ? 'block' : 'hidden'} space-y-6`}>
            <div className="bg-white/70 backdrop-blur-xl p-8 border border-elysium-whisper shadow-2xl">
              <h3 className="font-serif text-xl text-elysium-obsidian mb-6 tracking-wide">Curate Your Selection</h3>
              
              <div className="space-y-5">
                <div className="group">
                  <label className="block text-sm font-medium text-elysium-smoke mb-2 tracking-wider uppercase">Category</label>
                  <select 
                    className="w-full bg-white/50 backdrop-blur-sm border border-elysium-whisper  px-4 py-3 text-elysium-obsidian placeholder-elysium-smoke focus:outline-none focus:ring-2 focus:ring-elysium-gold focus:border-transparent transition-all duration-300 hover:bg-white/70"
                    value={params.get("category") ?? ""} 
                    onChange={(e)=>updateParam("category", e.target.value)}
                  >
                    <option value="">All Collections</option>
                    <option value="ring">Engagement Rings</option>
                    <option value="mens-rings">Men's Wedding Bands</option>
                    <option value="necklace">Necklaces</option>
                    <option value="earring">Earrings</option>
                  </select>
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-elysium-smoke mb-2 tracking-wider uppercase">Shape</label>
                  <select
                    className="w-full bg-white/50 backdrop-blur-sm border border-elysium-whisper  px-4 py-3 text-elysium-obsidian placeholder-elysium-smoke focus:outline-none focus:ring-2 focus:ring-elysium-gold focus:border-transparent transition-all duration-300 hover:bg-white/70"
                    value={params.get("shape") ?? ""}
                    onChange={(e)=>updateParam("shape", e.target.value)}
                  >
                    <option value="">All Shapes</option>
                    {facets.shape.map((shape)=> (
                      <option key={shape.id} value={shape.id}>{shape.label}</option>
                    ))}
                  </select>
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-elysium-smoke mb-2 tracking-wider uppercase">Collection</label>
                  <select
                    className="w-full bg-white/50 backdrop-blur-sm border border-elysium-whisper  px-4 py-3 text-elysium-obsidian placeholder-elysium-smoke focus:outline-none focus:ring-2 focus:ring-elysium-gold focus:border-transparent transition-all duration-300 hover:bg-white/70"
                    value={params.get("collection") ?? ""}
                    onChange={(e)=>updateParam("collection", e.target.value)}
                  >
                    <option value="">All Collections</option>
                    {facets.collection.map((col)=> (
                      <option key={col.id} value={col.id}>{col.label}</option>
                    ))}
                  </select>
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-elysium-smoke mb-2 tracking-wider uppercase">Metal</label>
                  <select 
                    className="w-full bg-white/50 backdrop-blur-sm border border-elysium-whisper  px-4 py-3 text-elysium-obsidian placeholder-elysium-smoke focus:outline-none focus:ring-2 focus:ring-elysium-gold focus:border-transparent transition-all duration-300 hover:bg-white/70"
                    value={params.get("metal") ?? ""} 
                    onChange={(e)=>updateParam("metal", e.target.value)}
                  >
                    <option value="">Any Precious Metal</option>
                    <option value="gold">18k Gold</option>
                    <option value="platinum">Platinum</option>
                  </select>
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-elysium-smoke mb-2 tracking-wider uppercase">Price</label>
                  <select 
                    className="w-full bg-white/50 backdrop-blur-sm border border-elysium-whisper  px-4 py-3 text-elysium-obsidian placeholder-elysium-smoke focus:outline-none focus:ring-2 focus:ring-elysium-gold focus:border-transparent transition-all duration-300 hover:bg-white/70"
                    value={params.get("price") ?? ""} 
                    onChange={(e)=>updateParam("price", e.target.value)}
                  >
                    <option value="">Any Investment</option>
                    <option value="0-200000">Under £2,000</option>
                    <option value="200000-500000">£2,000 — £5,000</option>
                    <option value="500000-9999999">£5,000+</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-elysium-whisper">
                <div className="flex items-center text-sm text-elysium-smoke">
                  <div className="w-2 h-2 rounded-full bg-elysium-gold mr-3"></div>
                  <span className="tracking-wide">{total || 0} pieces in collection</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <section className="relative">
          <div className="mb-8 pb-6 border-b border-elysium-whisper">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center text-elysium-smoke">
                  <div className="w-1 h-6 bg-gradient-to-b from-elysium-gold to-elysium-rose-gold mr-4"></div>
                  <span className="text-sm font-light tracking-wider">
                    {total ? `${Math.min(total, (page-1)*limit + 1)}–${Math.min(total, page*limit)} of ${total}` : `Curating collection...`}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label htmlFor="sort" className="text-sm text-elysium-smoke font-light tracking-wider uppercase">Arrange By</label>
                <select
                  id="sort"
                  className="bg-white/60 backdrop-blur-sm border border-elysium-whisper  px-4 py-2 text-sm text-elysium-obsidian focus:outline-none focus:ring-2 focus:ring-elysium-gold focus:border-transparent transition-all duration-300 hover:bg-white/80"
                  value={params.get("sort") ?? "newest"}
                  onChange={(e)=>updateParam("sort", e.target.value)}
                >
                  <option value="newest">Latest Arrivals</option>
                  <option value="oldest">Heritage Collection</option>
                  <option value="price_asc">Investment: Accessible</option>
                  <option value="price_desc">Investment: Premium</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="relative">
            <div className="relative">
              {(data?.products ?? []).length > 0 ? (
                <div className="space-y-16">
                  {(() => {
                    // Group products by type
                    const products = data?.products ?? [];
                    const groups = {
                      'mens-rings': products.filter((p:any) => 
                        p.collections?.includes('mens-rings') ||
                        p.title.toLowerCase().includes('men\'s wedding band')
                      ),
                      solitaires: products.filter((p:any) => 
                        p.title.toLowerCase().includes('solitaire') && 
                        !p.title.toLowerCase().includes('toi et moi') &&
                        !p.title.toLowerCase().includes('trilogy') &&
                        !p.collections?.includes('mens-rings')
                      ),
                      'toi-et-moi': products.filter((p:any) => 
                        p.title.toLowerCase().includes('toi et moi') &&
                        !p.collections?.includes('mens-rings')
                      ),
                      trilogy: products.filter((p:any) => 
                        p.title.toLowerCase().includes('trilogy') &&
                        !p.collections?.includes('mens-rings')
                      ),
                      other: products.filter((p:any) => 
                        !p.title.toLowerCase().includes('solitaire') &&
                        !p.title.toLowerCase().includes('toi et moi') &&
                        !p.title.toLowerCase().includes('trilogy') &&
                        !p.collections?.includes('mens-rings') &&
                        !p.title.toLowerCase().includes('men\'s wedding band')
                      )
                    };

                    return Object.entries(groups).map(([groupName, groupProducts]) => {
                      if (groupProducts.length === 0) return null;
                      
                      const groupTitles = {
                        'mens-rings': 'Men\'s Wedding Bands',
                        solitaires: 'Solitaire Collection',
                        'toi-et-moi': 'Toi et Moi Collection',
                        trilogy: 'Trilogy Collection',
                        other: 'Signature Collection'
                      };

                      return (
                        <div key={groupName} className="space-y-8">
                          <div className="text-center">
                            <h3 className="font-serif text-2xl md:text-3xl text-elysium-charcoal tracking-wide mb-2">
                              {groupTitles[groupName as keyof typeof groupTitles]}
                            </h3>
                            <div className="w-16 h-px bg-gradient-to-r from-transparent via-elysium-gold to-transparent mx-auto"></div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
                            {groupProducts.map((p:any, index:number) => (
                              <div 
                                key={p._id} 
                                className="transform transition-all duration-700 hover:scale-[1.02]"
                              >
                                <LuxuryProductCard 
                                  product={p} 
                                  priority={index < 4}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }).filter(Boolean);
                  })()}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="inline-flex flex-col items-center gap-4 p-8 bg-white/60 backdrop-blur-xl  border border-elysium-whisper shadow-lg">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-elysium-gold to-elysium-rose-gold flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-serif text-elysium-obsidian mb-2">Refining Your Selection</h3>
                      <p className="text-sm text-elysium-smoke tracking-wide">Adjust your preferences to discover the perfect piece</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-16 flex items-center justify-center">
              <div className="inline-flex items-center gap-4 bg-white/60 backdrop-blur-xl  p-2 border border-elysium-whisper shadow-lg">
                <button
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-elysium-obsidian  transition-all duration-300 hover:bg-elysium-gold hover:text-white disabled:opacity-40"
                  onClick={()=>updateParam("page", String(Math.max(1, page-1)))}
                  disabled={page <= 1}
                  aria-label="Previous page"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="hidden sm:inline">Previous</span>
                </button>
                
                <div className="flex items-center gap-2 px-4">
                  <span className="text-sm text-elysium-smoke font-light tracking-wider">
                    Page <span className="font-medium text-elysium-obsidian">{page}</span> of <span className="font-medium text-elysium-obsidian">{totalPages}</span>
                  </span>
                </div>
                
                <button
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-elysium-obsidian  transition-all duration-300 hover:bg-elysium-gold hover:text-white disabled:opacity-40"
                  onClick={()=>updateParam("page", String(Math.min(totalPages, page+1)))}
                  disabled={page >= totalPages}
                  aria-label="Next page"
                >
                  <span className="hidden sm:inline">Next</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
