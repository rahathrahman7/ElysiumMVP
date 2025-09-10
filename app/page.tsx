import LuxuryProductCard from '@/components/ui/LuxuryProductCard'
import { getAllProducts } from '@/lib/products'
import RingSizeGuide from '@/components/ui/RingSizeGuide'
import LuxuryHero from '@/components/sections/LuxuryHero'
import { ValueBar } from '@/components/sections/ValueBar'
import { QuickShopChips } from '@/components/sections/QuickShopChips'
import { EditorialTeasers } from '@/components/sections/EditorialTeasers'
import CollectionGrid from '@/components/sections/CollectionGrid'
import Testimonials from '@/components/sections/Testimonials'
import { TrustStrip } from '@/components/sections/TrustStrip'

export default function HomePage(){
  const featuredProducts = getAllProducts().filter(p => p.isFeatured);

  return (
    <main>
      <LuxuryHero />
      <QuickShopChips />
      <EditorialTeasers />
      
      {/* Trust Strip */}
      <TrustStrip />

      {/* Featured Products Section */}
      <section className="py-20" style={{ backgroundColor: 'var(--elysium-ivory)' }}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl uppercase tracking-[0.1em] mb-4 leading-tight" style={{ color: 'var(--elysium-charcoal)' }}>
              Featured Collection
            </h2>
            <p className="font-sans text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--elysium-charcoal)' }}>
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
                  <LuxuryProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center mt-12">
            <a 
              href="/shop" 
              className="inline-block px-8 py-4 rounded-xl uppercase tracking-wide text-sm font-medium transition-all duration-300 leading-tight luxury-button"
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
