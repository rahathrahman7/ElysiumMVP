import { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import CategoryHero from "@/components/fine-jewellery/CategoryHero";
import FineJewelleryGrid from "@/components/fine-jewellery/FineJewelleryGrid";

export const metadata: Metadata = {
  title: "Fine Jewellery | Elysium",
  description: "Explore our fine jewellery collection, featuring timeless tennis bracelets, elegant earrings, and more. Each piece is thoughtfully crafted with an unwavering focus on detail.",
  openGraph: {
    title: "Fine Jewellery | Elysium",
    description: "Explore our fine jewellery collection, featuring timeless tennis bracelets, elegant earrings, and more.",
    type: "website",
  },
};

const categories = [
  {
    name: "Earrings",
    href: "/fine-jewellery/earrings",
    description: "From refined studs to statement pieces",
    image: "/products/Earrings/Pure/pure-gold-front.PNG",
  },
  {
    name: "Bracelets",
    href: "/fine-jewellery/bracelets",
    description: "Timeless tennis bracelets",
    image: "/products/Classic 4 Claw Tennis Bracelet /3ct/classicTB3ct-gold.PNG",
  },
  {
    name: "Necklaces",
    href: "/fine-jewellery/necklaces",
    description: "Coming soon",
    image: null,
    comingSoon: true,
  },
];

export default function FineJewelleryPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      {/* Hero Section */}
      <CategoryHero
        title="Fine Jewellery"
        description="Explore our fine jewellery collection, featuring timeless tennis bracelets, elegant earrings, and more. Each piece is thoughtfully crafted with an unwavering focus on detail, perfect for gifting or treating yourself."
      />

      {/* Category Navigation Tiles */}
      <section className="py-16 border-b border-[#6D3D0D]/10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <span className="text-[#6D3D0D]/50 text-xs uppercase tracking-[0.3em] font-light">
              Browse By Category
            </span>
            <h2 className="font-serif text-[#6D3D0D] text-2xl md:text-3xl mt-3" style={{ letterSpacing: '-0.02em' }}>
              Shop <span className="text-[#D4AF37]">Collections</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group relative overflow-hidden bg-white border border-[#6D3D0D]/10 transition-all duration-500 hover:border-[#D4AF37]/40 hover:shadow-xl"
              >
                {/* Image or Placeholder */}
                <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-[#FAF7F2] to-[#E8E2DA]">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <svg className="w-16 h-16 text-[#D4AF37]/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-[#6D3D0D]/40 text-sm uppercase tracking-widest">Coming Soon</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-[#6D3D0D]/0 group-hover:bg-[#6D3D0D]/20 transition-colors duration-500" />
                </div>

                {/* Content */}
                <div className="p-6 text-center">
                  <h3 className="font-serif text-[#6D3D0D] text-xl mb-2 group-hover:text-[#D4AF37] transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-[#6D3D0D]/60 text-sm">
                    {category.description}
                  </p>
                  
                  {/* Arrow */}
                  <div className="mt-4 flex justify-center">
                    <span className="inline-flex items-center text-[#D4AF37] text-sm font-medium tracking-wider uppercase opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      Explore
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Coming Soon Badge */}
                {category.comingSoon && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs uppercase tracking-wider">
                    Coming Soon
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Products Grid */}
      <section className="py-16">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <span className="text-[#6D3D0D]/50 text-xs uppercase tracking-[0.3em] font-light">
              Our Collection
            </span>
            <h2 className="font-serif text-[#6D3D0D] text-2xl md:text-3xl mt-3" style={{ letterSpacing: '-0.02em' }}>
              All Fine <span className="text-[#D4AF37]">Jewellery</span>
            </h2>
          </div>

          <Suspense fallback={
            <div className="text-center py-20 text-[#6D3D0D]/60">
              Loading collection...
            </div>
          }>
            <FineJewelleryGrid />
          </Suspense>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 border-t border-[#6D3D0D]/10 bg-white">
        <div className="max-w-[800px] mx-auto px-6 md:px-12 text-center">
          <span className="text-[#6D3D0D]/50 text-xs uppercase tracking-[0.3em] font-light">
            Bespoke Service
          </span>
          <h2 className="font-serif text-[#6D3D0D] text-2xl md:text-3xl mt-3 mb-4" style={{ letterSpacing: '-0.02em' }}>
            Looking for Something <span className="text-[#D4AF37]">Unique</span>?
          </h2>
          <p className="text-[#6D3D0D]/60 mb-8 max-w-lg mx-auto">
            Our bespoke service allows you to create a one-of-a-kind piece tailored to your vision. 
            Book a consultation to begin your journey.
          </p>
          <Link
            href="/bespoke"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#6D3D0D] text-white font-light tracking-wider uppercase text-sm transition-all duration-300 hover:bg-[#D4AF37]"
          >
            Book Consultation
          </Link>
        </div>
      </section>
    </main>
  );
}
