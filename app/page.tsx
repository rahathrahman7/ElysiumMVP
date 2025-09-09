import ProductCard from '@/components/ui/ProductCard'
import { getAllProducts } from '@/lib/products'
import RingSizeGuide from '@/components/ui/RingSizeGuide'
import Hero from '@/components/sections/Hero'
import { ValueBar } from '@/components/sections/ValueBar'
import { QuickShopChips } from '@/components/sections/QuickShopChips'
import { EditorialTeasers } from '@/components/sections/EditorialTeasers'
import CollectionGrid from '@/components/sections/CollectionGrid'
import Testimonials from '@/components/sections/Testimonials'

export default function HomePage(){
  const featuredProducts = getAllProducts().filter(p => p.isFeatured);

  return (
    <main>
      <Hero />
      <ValueBar />
      <QuickShopChips />
      <EditorialTeasers />
      
      {/* Trust Strip */}
      <section className="bg-gray-100 border-y border-gray-200">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center">
                <span className="text-2xl">🏛️</span>
              </div>
              <div>
                <h2 className="font-heading text-lg uppercase tracking-wide text-black mb-1 leading-tight">Hallmarked in London</h2>
                <p className="text-sm text-gray-600 leading-normal">Assay Office certified</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center">
                <span className="text-2xl">📦</span>
              </div>
              <div>
                <h2 className="font-heading text-lg uppercase tracking-wide text-black mb-1 leading-tight">Free 30-day Returns</h2>
                <p className="text-sm text-gray-600 leading-normal">No questions asked</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center">
                <span className="text-2xl">🔧</span>
              </div>
              <div>
                <h2 className="font-heading text-lg uppercase tracking-wide text-black mb-1 leading-tight">Complimentary Resizing</h2>
                <p className="text-sm text-gray-600 leading-normal">Lifetime service</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-ivory">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl uppercase tracking-[0.1em] text-gray-900 mb-4 leading-tight">
              Featured Collection
            </h2>
            <p className="font-sans text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
              Discover our most sought-after pieces, crafted with precision in our London atelier
            </p>
            <div className="mt-6">
              <RingSizeGuide />
            </div>
          </div>
          
          {/* Luxury grid with consistent spacing */}
          <div className="mx-auto max-w-[1320px] px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-7 xl:gap-8">
              {featuredProducts.map((product, index) => (
                <div key={product.slug} className="stagger-item" style={{ animationDelay: `${(index + 1) * 0.1}s` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center mt-12">
            <a 
              href="/products" 
              className="inline-block px-6 py-3 border-2 border-gray-900 text-gray-900 uppercase tracking-wide text-sm font-medium hover:bg-gray-900 hover:text-white transition-all duration-300 leading-tight"
            >
              View Full Collection
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />
    </main>
  )
}
