import { Metadata } from "next";
import Link from "next/link";
import CategoryHero from "@/components/fine-jewellery/CategoryHero";

export const metadata: Metadata = {
  title: "Necklaces | Fine Jewellery | Elysium",
  description: "Our necklace collection is coming soon. Sign up to be notified when our new pieces arrive.",
  openGraph: {
    title: "Necklaces | Fine Jewellery | Elysium",
    description: "Our necklace collection is coming soon. Sign up to be notified when our new pieces arrive.",
    type: "website",
  },
};

export default function NecklacesPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      {/* Hero Section */}
      <CategoryHero
        title="Necklaces"
        description="Timeless elegance that adorns the neckline. Our upcoming necklace collection will feature exquisite pendants and chains, each crafted with the same attention to detail as our signature pieces."
        breadcrumbs={[
          { label: "Fine Jewellery", href: "/fine-jewellery" },
        ]}
        compact
      />

      {/* Coming Soon Content */}
      <section className="py-20 md:py-32">
        <div className="max-w-[800px] mx-auto px-6 md:px-12 text-center">
          {/* Clock Icon */}
          <div className="w-24 h-24 mx-auto mb-8 border border-[#D4AF37]/30 flex items-center justify-center">
            <svg className="w-12 h-12 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <span className="text-[#D4AF37] text-xs uppercase tracking-[0.3em] font-medium">
            Coming Soon
          </span>
          
          <h2 className="font-serif text-[#6D3D0D] text-3xl md:text-4xl mt-4 mb-6" style={{ letterSpacing: '-0.02em' }}>
            Our Necklace Collection is <span className="text-[#D4AF37]">On Its Way</span>
          </h2>
          
          <p className="text-[#6D3D0D]/60 text-lg leading-relaxed mb-10 max-w-lg mx-auto">
            We&apos;re carefully curating a collection of exquisite necklaces and pendants. 
            Be the first to know when they arrive.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link
              href="/bespoke"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#6D3D0D] text-white font-light tracking-wider uppercase text-sm transition-all duration-300 hover:bg-[#D4AF37]"
            >
              Create Bespoke Necklace
            </Link>
            <Link
              href="/fine-jewellery"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-[#6D3D0D]/30 text-[#6D3D0D] font-light tracking-wider uppercase text-sm transition-all duration-300 hover:border-[#6D3D0D]"
            >
              Explore Other Collections
            </Link>
          </div>

          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-4">
            <div className="h-[1px] w-16 bg-[#D4AF37]/30" />
            <svg className="w-4 h-4 text-[#D4AF37]/50" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 3.22l-.61-.6a5.5 5.5 0 00-7.78 7.77L10 18.78l8.39-8.4a5.5 5.5 0 00-7.78-7.77l-.61.61z" />
            </svg>
            <div className="h-[1px] w-16 bg-[#D4AF37]/30" />
          </div>
        </div>
      </section>

      {/* Alternative Categories */}
      <section className="py-16 border-t border-[#6D3D0D]/10 bg-white">
        <div className="max-w-[1000px] mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <span className="text-[#6D3D0D]/50 text-xs uppercase tracking-[0.3em] font-light">
              In The Meantime
            </span>
            <h3 className="font-serif text-[#6D3D0D] text-2xl mt-3" style={{ letterSpacing: '-0.02em' }}>
              Explore Our Available <span className="text-[#D4AF37]">Collections</span>
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Link
              href="/fine-jewellery/earrings"
              className="group p-8 border border-[#6D3D0D]/10 hover:border-[#D4AF37]/40 transition-all duration-300 hover:shadow-lg"
            >
              <h4 className="font-serif text-[#6D3D0D] text-xl mb-2 group-hover:text-[#D4AF37] transition-colors">
                Earrings
              </h4>
              <p className="text-[#6D3D0D]/60 text-sm mb-4">
                From refined studs to statement pieces
              </p>
              <span className="text-[#D4AF37] text-sm font-medium tracking-wider uppercase">
                Shop Now →
              </span>
            </Link>

            <Link
              href="/fine-jewellery/bracelets"
              className="group p-8 border border-[#6D3D0D]/10 hover:border-[#D4AF37]/40 transition-all duration-300 hover:shadow-lg"
            >
              <h4 className="font-serif text-[#6D3D0D] text-xl mb-2 group-hover:text-[#D4AF37] transition-colors">
                Bracelets
              </h4>
              <p className="text-[#6D3D0D]/60 text-sm mb-4">
                Timeless tennis bracelets
              </p>
              <span className="text-[#D4AF37] text-sm font-medium tracking-wider uppercase">
                Shop Now →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
