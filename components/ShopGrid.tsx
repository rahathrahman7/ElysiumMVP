"use client";
import { useSearchParams, useRouter } from "next/navigation";
import useSWR from "swr";
import LuxuryProductCard from "@/components/ui/LuxuryProductCard";
import { useState, useMemo } from "react";
import { facets } from "@/lib/filterSchema";

const fetcher = (url: string) => fetch(url).then(r=>r.json());

export function ShopGrid() {
  const params = useSearchParams();
  const router = useRouter();
  
  // Check if any filter is active - if not, we'll show grouped view
  const hasCategory = params.get("category");
  const hasCollection = params.get("collection");
  const hasShape = params.get("shape");
  const isFilteredView = hasCategory || hasCollection || hasShape;
  
  // Build query - use higher limit for grouped (all collections) view to prevent groups splitting across pages
  const queryParams = new URLSearchParams(params.toString());
  if (!isFilteredView && !params.get("limit")) {
    // For "All Collections" view, fetch more products at once to keep groups together
    queryParams.set("limit", "50");
  }
  const query = queryParams.toString();
  
  const { data } = useSWR(`/api/products?${query}`, fetcher);
  const [filtersOpen, setFiltersOpen] = useState(false);

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value); else next.delete(key);
    if (key !== "page") next.delete("page");
    router.push(`/shop?${next.toString()}`);
  }

  const page = Number(params.get("page") || 1);
  // Use the actual limit from the query we sent
  const limit = isFilteredView ? Number(params.get("limit") || 12) : 50;
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
                    <option value="earrings">Earrings</option>
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
        <section className="relative" style={{ backgroundColor: 'var(--elysium-ivory)' }}>
          {/* Active Filter Badges */}
          {hasShape && (
            <div className="mb-6 flex items-center gap-3">
              <span className="text-sm text-elysium-smoke tracking-wide">Filtering by:</span>
              <button
                onClick={() => updateParam("shape", "")}
                className="inline-flex items-center gap-2 px-4 py-2 bg-elysium-gold/10 border border-elysium-gold/30 text-elysium-charcoal text-sm font-medium capitalize hover:bg-elysium-gold/20 transition-all duration-300"
              >
                {hasShape} Diamonds
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
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
                    const products = data?.products ?? [];
                    
                    // If a specific category or collection filter is active, show flat grid without grouping
                    if (isFilteredView) {
                      // Category-specific headers and descriptions
                      const categoryHeaders: Record<string, { title: string; description?: string }> = {
                        bracelets: {
                          title: 'Bracelets',
                          description: 'A refined finishing touch to any ensemble, our tennis bracelets are thoughtfully crafted with an unwavering focus on detail. Perfect for gifting, they offer enduring beauty for every special moment.'
                        },
                        earrings: {
                          title: 'Earrings',
                          description: 'Elegance that frames the face, our earring collection features exquisite designs from refined studs to statement pieces, each crafted with precision and care.'
                        },
                      };
                      
                      const categoryInfo = hasCategory ? categoryHeaders[hasCategory] : null;
                      
                      return (
                        <div className="space-y-8">
                          {/* Category Header - only show when category filter is active */}
                          {categoryInfo && (
                            <div className="text-center mb-8">
                              <h2 className="font-serif text-2xl md:text-3xl text-elysium-charcoal tracking-wide mb-2">
                                {categoryInfo.title}
                              </h2>
                              <div className="w-16 h-px bg-gradient-to-r from-transparent via-elysium-gold to-transparent mx-auto"></div>
                              {categoryInfo.description && (
                                <p className="mt-4 text-sm md:text-base text-elysium-smoke/80 max-w-xl mx-auto font-light leading-relaxed">
                                  {categoryInfo.description}
                                </p>
                              )}
                            </div>
                          )}
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10 xl:gap-12">
                            {products.map((p: any, index: number) => (
                              <div 
                                key={p._id} 
                                className="stagger-item"
                                style={{
                                  animationDelay: `${(index + 1) * 0.1}s`,
                                  isolation: 'isolate',
                                  position: 'relative',
                                  zIndex: 1,
                                  padding: '16px',
                                  margin: '-16px',
                                }}
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
                    }
                    
                    // Group products by collection tags for efficient organization (All Collections view)
                    // Order: Solitaires → Toi et Moi → Trilogy → Men's Bands (Ready To Wear), then Bracelets → Earrings
                    const groups = {
                      solitaires: products.filter((p:any) => 
                        (p.collections?.includes('solitaire') || p.collections?.includes('signature-collection')) &&
                        !p.collections?.includes('mens-rings') &&
                        !p.collections?.includes('bracelets') &&
                        !p.collections?.includes('trilogy') &&
                        !p.collections?.includes('toi-et-moi') &&
                        !p.collections?.includes('earrings')
                      ),
                      'toi-et-moi': products.filter((p:any) => 
                        p.collections?.includes('toi-et-moi') &&
                        !p.collections?.includes('mens-rings')
                      ),
                      trilogy: products.filter((p:any) => 
                        p.collections?.includes('trilogy') &&
                        !p.collections?.includes('mens-rings')
                      ),
                      'mens-rings': products.filter((p:any) => 
                        p.collections?.includes('mens-rings') || 
                        p.collections?.includes('wedding-bands')
                      ),
                      bracelets: products.filter((p:any) => 
                        p.collections?.includes('bracelets') ||
                        p.collections?.includes('tennis-bracelets')
                      ),
                      earrings: products.filter((p:any) => 
                        p.collections?.includes('earrings')
                      ),
                      other: products.filter((p:any) => 
                        !p.collections?.includes('solitaire') &&
                        !p.collections?.includes('signature-collection') &&
                        !p.collections?.includes('toi-et-moi') &&
                        !p.collections?.includes('trilogy') &&
                        !p.collections?.includes('mens-rings') &&
                        !p.collections?.includes('wedding-bands') &&
                        !p.collections?.includes('bracelets') &&
                        !p.collections?.includes('earrings')
                      )
                    };

                    return Object.entries(groups).map(([groupName, groupProducts]) => {
                      if (groupProducts.length === 0) return null;
                      
                      const groupTitles = {
                        'mens-rings': 'Men\'s Wedding Bands',
                        solitaires: 'Solitaire',
                        'toi-et-moi': 'Toi et Moi',
                        trilogy: 'Trilogy',
                        bracelets: 'Bracelets',
                        earrings: 'Earrings',
                        other: 'Other Collections'
                      };

                      // Skip rendering if it's 'other' and we have other signature groups
                      if (groupName === 'other' && (groups.solitaires.length > 0 || groups['toi-et-moi'].length > 0 || groups.trilogy.length > 0 || groups.bracelets.length > 0 || groups.earrings.length > 0)) {
                        return null;
                      }

                      // Check if this is a signature collection group (Ready To Wear)
                      const isSignatureGroup = ['mens-rings', 'solitaires', 'toi-et-moi', 'trilogy'].includes(groupName);

                      return (
                        <div key={groupName} className="space-y-8">
                          {/* Show "READY TO WEAR" as main heading only for first signature group */}
                          {isSignatureGroup && groupName === 'solitaires' && (
                            <div className="text-center mb-8">
                              <h2 className="font-serif text-3xl md:text-4xl text-elysium-charcoal tracking-wide mb-2 uppercase">
                                Ready To Wear
                              </h2>
                              <div className="w-24 h-px bg-gradient-to-r from-transparent via-elysium-gold to-transparent mx-auto"></div>
                            </div>
                          )}
                          
                          <div className="text-center">
                            <h3 className="font-serif text-xl md:text-2xl text-elysium-charcoal tracking-wide mb-2">
                              {isSignatureGroup ? `${groupTitles[groupName as keyof typeof groupTitles]} Collection` : groupTitles[groupName as keyof typeof groupTitles]}
                            </h3>
                            {!isSignatureGroup && (
                              <div className="w-16 h-px bg-gradient-to-r from-transparent via-elysium-gold to-transparent mx-auto"></div>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10 xl:gap-12">
                            {groupProducts.map((p:any, index:number) => (
                              <div 
                                key={p._id} 
                                className="stagger-item"
                                style={{
                                  animationDelay: `${(index + 1) * 0.1}s`,
                                  isolation: 'isolate',
                                  position: 'relative',
                                  zIndex: 1,
                                  padding: '16px',
                                  margin: '-16px',
                                }}
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
