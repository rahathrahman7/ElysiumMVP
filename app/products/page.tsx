import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";
import RingSizeGuide from "@/components/ui/RingSizeGuide";
import FilterSections from "@/components/filters/FilterSections";
import FiltersDrawer from "@/components/filters/FiltersDrawer";
// reverted to static rendering (no client-only wrappers)

export default async function ProductsPage() {
  // Lazy import to avoid loading large products array during build compilation
  const { products } = await import('@/lib/products');
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero */}
        <div className="text-center mb-20">
          <h1 className="font-serif text-5xl lg:text-6xl uppercase tracking-[0.12em] text-charcoal mb-6 leading-tight">
            Our Collection
          </h1>
          <p className="font-sans text-xl text-charcoal/70 max-w-2xl mx-auto leading-relaxed">
            Discover our signature pieces, each crafted with precision in our London atelier. 
            From classic solitaires to bespoke designs, every ring tells a story.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <RingSizeGuide />
            <Link 
              href="/wishlist" 
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
              View Wishlist
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl text-charcoal mb-4">Optional Configuration</h2>
            <p className="font-sans text-lg text-charcoal/60 max-w-2xl mx-auto">
              Want to customize your search? Click below to configure style, shape, and metal preferences
            </p>
          </div>
          <FilterSections />
        </div>

        {/* Products Grid */}
        <div className="mb-16">
          <h2 className="font-serif text-3xl text-charcoal mb-8 text-center">All Rings</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20">
          <h2 className="font-serif text-3xl uppercase tracking-[0.08em] text-charcoal mb-6">
            Looking for Something Special?
          </h2>
          <p className="font-sans text-lg text-charcoal/70 mb-8 max-w-2xl mx-auto">
            Our bespoke service allows us to create a completely custom piece 
            designed around your vision and requirements.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/bespoke" className="luxury-button">
              Start Bespoke Design
            </Link>
            <Link href="/education" className="luxury-button secondary">
              Learn About Jewellery
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
