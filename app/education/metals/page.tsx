import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "18k Gold vs Platinum Guide | Gold Purity & Metal Comparison — ELYSIUM",
  description: "Complete guide to precious metals for fine jewelry: 18k gold purity, platinum properties, rose gold vs white gold comparison, and metal care. Expert advice for engagement rings.",
  keywords: ["18k gold", "platinum jewelry", "gold purity", "rose gold", "white gold", "platinum vs gold", "gold hallmarks", "jewelry metals"],
};

export default function MetalsEducationPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      {/* Navigation */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-8">
        <nav className="mb-8">
          <Link 
            href="/education" 
            className="text-[#D4AF37] hover:text-[#D4AF37]/80 font-medium inline-flex items-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Education Hub
          </Link>
        </nav>
      </div>

      {/* Hero Section */}
      <header className="relative mb-16">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="py-8 lg:py-16">
              <span className="text-[#6D3D0D]/50 text-xs uppercase tracking-[0.3em] font-light">Precious Metals Guide</span>
              <h1 className="font-serif text-[#6D3D0D] mt-4 mb-6" style={{fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.02em'}}>
                18k Gold &amp; <span className="text-[#D4AF37]">Platinum</span>
              </h1>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-[2px] w-16 bg-[#D4AF37]"></div>
                <div className="h-[2px] w-8 bg-[#D4AF37]/40"></div>
              </div>
              <p className="text-[#6D3D0D]/70 text-lg leading-relaxed mb-8 max-w-lg">
                As a luxury house, Elysium works exclusively with <strong>18k gold</strong> and <strong>platinum</strong> — 
                the world&apos;s most prestigious standards, chosen for their rich colour, durability, and timeless beauty.
              </p>
              <div className="flex flex-wrap gap-6 text-sm text-[#6D3D0D]/60">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>UK Hallmarked</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Hypoallergenic Options</span>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative h-[400px] lg:h-[500px]">
              <Image
                src="/education/metalscard.png"
                alt="18k gold and platinum precious metals for fine jewelry"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] via-[#D4AF37]/60 to-transparent"></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1000px] mx-auto px-6 md:px-12">
        {/* Metal Palette Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <span className="text-[#6D3D0D]/50 text-xs uppercase tracking-[0.3em] font-light">Our Selection</span>
            <h2 className="font-serif text-[#6D3D0D] text-2xl md:text-3xl mt-3" style={{letterSpacing: '-0.02em'}}>
              The Metal <span className="text-[#D4AF37]">Palette</span>
            </h2>
          </div>
          
          <div className="bg-white border border-[#6D3D0D]/10 p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              <div className="text-center group">
                <div className="relative w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border border-[#6D3D0D]/10 transition-all duration-300 group-hover:border-[#D4AF37]/40 group-hover:shadow-lg">
                  <Image
                    src="/icons/swatches/goldswatch.png"
                    alt="18k Yellow Gold swatch"
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <h3 className="font-serif text-[#6D3D0D] text-sm mb-1">Yellow Gold</h3>
                <p className="text-[#6D3D0D]/50 text-xs">18k / 750</p>
              </div>
              
              <div className="text-center group">
                <div className="relative w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border border-[#6D3D0D]/10 transition-all duration-300 group-hover:border-[#D4AF37]/40 group-hover:shadow-lg">
                  <Image
                    src="/icons/swatches/rosegoldswatch.png"
                    alt="18k Rose Gold swatch"
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <h3 className="font-serif text-[#6D3D0D] text-sm mb-1">Rose Gold</h3>
                <p className="text-[#6D3D0D]/50 text-xs">18k / 750</p>
              </div>
              
              <div className="text-center group">
                <div className="relative w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border border-[#6D3D0D]/10 transition-all duration-300 group-hover:border-[#D4AF37]/40 group-hover:shadow-lg">
                  <Image
                    src="/icons/swatches/whitegoldswatch.png"
                    alt="18k White Gold swatch"
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <h3 className="font-serif text-[#6D3D0D] text-sm mb-1">White Gold</h3>
                <p className="text-[#6D3D0D]/50 text-xs">18k / 750</p>
              </div>
              
              <div className="text-center group">
                <div className="relative w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border border-[#6D3D0D]/10 transition-all duration-300 group-hover:border-[#D4AF37]/40 group-hover:shadow-lg">
                  <Image
                    src="/icons/swatches/platinumswatch.png"
                    alt="Platinum swatch"
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <h3 className="font-serif text-[#6D3D0D] text-sm mb-1">Platinum</h3>
                <p className="text-[#6D3D0D]/50 text-xs">950</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why We Use Only 18k & Platinum */}
        <section className="mb-20">
          <div className="bg-white border border-[#6D3D0D]/10 p-8 md:p-10">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 border border-[#D4AF37]/30 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <div>
                <h2 className="font-serif text-[#6D3D0D] text-xl mb-4" style={{letterSpacing: '-0.02em'}}>
                  Our Metal Standards
                </h2>
                <p className="text-[#6D3D0D]/70 leading-relaxed mb-6">
                  We work exclusively with 18k gold and platinum — never 9k or 14k. These premium metals offer the perfect balance of 
                  rich colour, durability, and prestige that fine jewellery deserves.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-[#FAF7F2] p-4 border-l-2 border-[#D4AF37]">
                    <h4 className="font-medium text-[#6D3D0D] text-sm mb-1">18k Gold</h4>
                    <p className="text-[#6D3D0D]/60 text-sm">75% pure gold with excellent durability and rich colour</p>
                  </div>
                  <div className="bg-[#FAF7F2] p-4 border-l-2 border-[#D4AF37]">
                    <h4 className="font-medium text-[#6D3D0D] text-sm mb-1">Platinum 950</h4>
                    <p className="text-[#6D3D0D]/60 text-sm">95% pure, naturally white, dense and hypoallergenic</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Understanding Gold */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <span className="text-[#6D3D0D]/50 text-xs uppercase tracking-[0.3em] font-light">Gold Education</span>
            <h2 className="font-serif text-[#6D3D0D] text-2xl md:text-3xl mt-3" style={{letterSpacing: '-0.02em'}}>
              Understanding <span className="text-[#D4AF37]">Gold</span>
            </h2>
          </div>
          
          {/* Gold Properties */}
          <div className="bg-white border border-[#6D3D0D]/10 p-8 md:p-10 mb-6">
            <div className="flex items-start gap-6 mb-8">
              <div className="w-12 h-12 border border-[#D4AF37]/30 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-serif text-[#6D3D0D] text-xl mb-4">Gold Properties</h3>
                <p className="text-[#6D3D0D]/70 leading-relaxed">
                  Pure 24k gold is soft and intensely coloured. <strong>18k gold</strong> (~75% pure) balances richness and durability perfectly.
                  Different alloy combinations create yellow, white, and rose gold variations.
                </p>
              </div>
            </div>
            
            <div className="bg-[#FAF7F2] p-6 border-l-2 border-[#D4AF37]">
              <h4 className="font-medium text-[#6D3D0D] text-sm uppercase tracking-wider mb-4">Karat System &amp; Purity</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-[#6D3D0D]/10">
                    <span className="font-medium text-[#6D3D0D]">24K Gold</span>
                    <span className="text-sm text-[#6D3D0D]/60">99.9% pure — too soft</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-[#6D3D0D]/10">
                    <span className="font-medium text-[#6D3D0D]">22K Gold</span>
                    <span className="text-sm text-[#6D3D0D]/60">91.7% pure — traditional</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-[#D4AF37]/30 bg-[#D4AF37]/5 -mx-2 px-2 py-1">
                    <span className="font-medium text-[#D4AF37]">18K Gold</span>
                    <span className="text-sm text-[#D4AF37]">75% pure — our standard</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-[#6D3D0D]/10">
                    <span className="font-medium text-[#6D3D0D]">14K Gold</span>
                    <span className="text-sm text-[#6D3D0D]/60">58.3% pure</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-[#6D3D0D]/10">
                    <span className="font-medium text-[#6D3D0D]">10K Gold</span>
                    <span className="text-sm text-[#6D3D0D]/60">41.7% pure</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-[#6D3D0D]/10">
                    <span className="font-medium text-[#6D3D0D]">9K Gold</span>
                    <span className="text-sm text-[#6D3D0D]/60">37.5% pure — UK minimum</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gold Colors with Images */}
          <div className="bg-white border border-[#6D3D0D]/10 p-8 md:p-10">
            <h3 className="font-serif text-[#6D3D0D] text-xl mb-8 text-center" style={{letterSpacing: '-0.02em'}}>
              Gold Colour Variations
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-4 overflow-hidden border border-[#6D3D0D]/10">
                  <Image
                    src="/icons/swatches/goldswatch.png"
                    alt="18k Yellow Gold"
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <h4 className="font-serif text-[#6D3D0D] mb-2">Yellow Gold</h4>
                <p className="text-sm text-[#6D3D0D]/60 leading-relaxed">
                  Classic, warm appearance. Alloyed with copper and silver for the traditional gold colour.
                </p>
              </div>
              
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-4 overflow-hidden border border-[#6D3D0D]/10">
                  <Image
                    src="/icons/swatches/whitegoldswatch.png"
                    alt="18k White Gold"
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <h4 className="font-serif text-[#6D3D0D] mb-2">White Gold</h4>
                <p className="text-sm text-[#6D3D0D]/60 leading-relaxed">
                  Modern, silvery appearance. Rhodium plated for a bright, reflective finish.
                </p>
              </div>
              
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-4 overflow-hidden border border-[#6D3D0D]/10">
                  <Image
                    src="/icons/swatches/rosegoldswatch.png"
                    alt="18k Rose Gold"
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <h4 className="font-serif text-[#6D3D0D] mb-2">Rose Gold</h4>
                <p className="text-sm text-[#6D3D0D]/60 leading-relaxed">
                  Romantic, pinkish hue. Higher copper content creates the warm blush tone.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Understanding Platinum */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <span className="text-[#6D3D0D]/50 text-xs uppercase tracking-[0.3em] font-light">Platinum Education</span>
            <h2 className="font-serif text-[#6D3D0D] text-2xl md:text-3xl mt-3" style={{letterSpacing: '-0.02em'}}>
              Understanding <span className="text-[#D4AF37]">Platinum</span>
            </h2>
          </div>
          
          <div className="bg-white border border-[#6D3D0D]/10 p-8 md:p-10">
            <div className="grid md:grid-cols-5 gap-8 items-start">
              <div className="md:col-span-3">
                <div className="flex items-start gap-6 mb-8">
                  <div className="w-12 h-12 border border-[#D4AF37]/30 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-serif text-[#6D3D0D] text-xl mb-4">Platinum Properties</h3>
                    <p className="text-[#6D3D0D]/70 leading-relaxed">
                      <strong>Platinum</strong> is naturally white, incredibly dense, and completely hypoallergenic. 
                      It&apos;s 30 times rarer than gold and develops a beautiful soft patina with wear.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#D4AF37] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-[#6D3D0D]/70 text-sm"><strong className="text-[#6D3D0D]">Naturally white</strong> — never needs rhodium plating</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#D4AF37] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-[#6D3D0D]/70 text-sm"><strong className="text-[#6D3D0D]">Hypoallergenic</strong> — ideal for sensitive skin</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#D4AF37] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-[#6D3D0D]/70 text-sm"><strong className="text-[#6D3D0D]">Dense and secure</strong> — excellent for holding stones</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#D4AF37] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-[#6D3D0D]/70 text-sm"><strong className="text-[#6D3D0D]">95% pure</strong> — the highest purity of any jewelry metal</p>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <div className="relative w-full aspect-square max-w-[200px] mx-auto overflow-hidden border border-[#6D3D0D]/10">
                  <Image
                    src="/icons/swatches/platinumswatch.png"
                    alt="Platinum 950"
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>
                <p className="text-center text-[#6D3D0D]/50 text-xs mt-4 uppercase tracking-wider">Platinum 950</p>
              </div>
            </div>
          </div>
        </section>

        {/* Gold vs Platinum Comparison */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <span className="text-[#6D3D0D]/50 text-xs uppercase tracking-[0.3em] font-light">Comparison</span>
            <h2 className="font-serif text-[#6D3D0D] text-2xl md:text-3xl mt-3" style={{letterSpacing: '-0.02em'}}>
              Gold vs <span className="text-[#D4AF37]">Platinum</span>
            </h2>
          </div>
          
          <div className="bg-white border border-[#6D3D0D]/10 overflow-hidden">
            <div className="grid grid-cols-3 bg-[#FAF7F2] border-b border-[#6D3D0D]/10">
              <div className="p-4 text-center font-medium text-[#6D3D0D] text-sm">Feature</div>
              <div className="p-4 text-center font-medium text-[#6D3D0D] text-sm border-x border-[#6D3D0D]/10">18k Gold</div>
              <div className="p-4 text-center font-medium text-[#6D3D0D] text-sm">Platinum</div>
            </div>
            
            <div className="divide-y divide-[#6D3D0D]/10">
              <div className="grid grid-cols-3">
                <div className="p-4 text-[#6D3D0D]/70 text-sm">Purity</div>
                <div className="p-4 text-[#6D3D0D] text-sm text-center border-x border-[#6D3D0D]/10">75%</div>
                <div className="p-4 text-[#6D3D0D] text-sm text-center">95%</div>
              </div>
              <div className="grid grid-cols-3">
                <div className="p-4 text-[#6D3D0D]/70 text-sm">Colour Options</div>
                <div className="p-4 text-[#6D3D0D] text-sm text-center border-x border-[#6D3D0D]/10">Yellow, White, Rose</div>
                <div className="p-4 text-[#6D3D0D] text-sm text-center">Natural White</div>
              </div>
              <div className="grid grid-cols-3">
                <div className="p-4 text-[#6D3D0D]/70 text-sm">Weight</div>
                <div className="p-4 text-[#6D3D0D] text-sm text-center border-x border-[#6D3D0D]/10">Lighter</div>
                <div className="p-4 text-[#6D3D0D] text-sm text-center">Heavier (60% more)</div>
              </div>
              <div className="grid grid-cols-3">
                <div className="p-4 text-[#6D3D0D]/70 text-sm">Hypoallergenic</div>
                <div className="p-4 text-[#6D3D0D] text-sm text-center border-x border-[#6D3D0D]/10">Varies by alloy</div>
                <div className="p-4 text-[#6D3D0D] text-sm text-center">Yes, always</div>
              </div>
              <div className="grid grid-cols-3">
                <div className="p-4 text-[#6D3D0D]/70 text-sm">Maintenance</div>
                <div className="p-4 text-[#6D3D0D] text-sm text-center border-x border-[#6D3D0D]/10">White needs re-plating</div>
                <div className="p-4 text-[#6D3D0D] text-sm text-center">Develops patina</div>
              </div>
              <div className="grid grid-cols-3">
                <div className="p-4 text-[#6D3D0D]/70 text-sm">UK Hallmark</div>
                <div className="p-4 text-[#6D3D0D] text-sm text-center border-x border-[#6D3D0D]/10">750</div>
                <div className="p-4 text-[#6D3D0D] text-sm text-center">950</div>
              </div>
            </div>
          </div>
        </section>

        {/* UK Hallmarks */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <span className="text-[#6D3D0D]/50 text-xs uppercase tracking-[0.3em] font-light">Authenticity</span>
            <h2 className="font-serif text-[#6D3D0D] text-2xl md:text-3xl mt-3" style={{letterSpacing: '-0.02em'}}>
              UK <span className="text-[#D4AF37]">Hallmarks</span>
            </h2>
          </div>
          
          <div className="bg-white border border-[#6D3D0D]/10 p-8 md:p-10">
            <div className="text-center mb-8">
              <div className="w-14 h-14 border border-[#D4AF37]/30 flex items-center justify-center mx-auto mb-6">
                <svg className="w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                </svg>
              </div>
              <p className="text-[#6D3D0D]/70 leading-relaxed max-w-2xl mx-auto">
                All our pieces carry official UK hallmarks from the Assay Office, guaranteeing metal fineness, 
                origin, and maker. This is your assurance of authenticity and quality.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6 max-w-lg mx-auto">
              <div className="text-center p-6 bg-[#FAF7F2] border border-[#6D3D0D]/10">
                <div className="font-serif text-[#D4AF37] text-3xl mb-2">750</div>
                <h4 className="font-medium text-[#6D3D0D] mb-1">18k Gold</h4>
                <p className="text-sm text-[#6D3D0D]/60">75% pure gold</p>
              </div>
              <div className="text-center p-6 bg-[#FAF7F2] border border-[#6D3D0D]/10">
                <div className="font-serif text-[#D4AF37] text-3xl mb-2">950</div>
                <h4 className="font-medium text-[#6D3D0D] mb-1">Platinum</h4>
                <p className="text-sm text-[#6D3D0D]/60">95% pure platinum</p>
              </div>
            </div>
          </div>
        </section>

        {/* Care & Maintenance */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <span className="text-[#6D3D0D]/50 text-xs uppercase tracking-[0.3em] font-light">Maintenance</span>
            <h2 className="font-serif text-[#6D3D0D] text-2xl md:text-3xl mt-3" style={{letterSpacing: '-0.02em'}}>
              Care &amp; <span className="text-[#D4AF37]">Maintenance</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-[#6D3D0D]/10 p-8">
              <h3 className="font-serif text-[#6D3D0D] text-lg mb-6">Daily Care</h3>
              <ul className="space-y-3 text-sm text-[#6D3D0D]/70">
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-0.5">—</span>
                  Remove jewelry before swimming or exercising
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-0.5">—</span>
                  Avoid contact with chemicals and perfumes
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-0.5">—</span>
                  Clean gently with warm soapy water
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-0.5">—</span>
                  Store in soft cloth or jewelry box
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-0.5">—</span>
                  Schedule annual professional cleaning
                </li>
              </ul>
            </div>
            
            <div className="bg-white border border-[#6D3D0D]/10 p-8">
              <h3 className="font-serif text-[#6D3D0D] text-lg mb-6">Professional Services</h3>
              <ul className="space-y-3 text-sm text-[#6D3D0D]/70">
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-0.5">—</span>
                  Deep cleaning and polishing
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-0.5">—</span>
                  Rhodium re-plating (white gold)
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-0.5">—</span>
                  Stone tightening and inspection
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-0.5">—</span>
                  Sizing and adjustments
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-0.5">—</span>
                  Valuation and certification
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <span className="text-[#6D3D0D]/50 text-xs uppercase tracking-[0.3em] font-light">Common Questions</span>
            <h2 className="font-serif text-[#6D3D0D] text-2xl md:text-3xl mt-3" style={{letterSpacing: '-0.02em'}}>
              Frequently Asked <span className="text-[#D4AF37]">Questions</span>
            </h2>
          </div>
          
          <div className="bg-white border border-[#6D3D0D]/10 divide-y divide-[#6D3D0D]/10">
            <div className="p-6">
              <h3 className="font-medium text-[#6D3D0D] mb-2">Why do you only use 18k gold and platinum?</h3>
              <p className="text-[#6D3D0D]/70 text-sm leading-relaxed">
                These are luxury standards that deliver the best balance of beauty, longevity, and value. 
                18k gold has richer colour than lower karats, and platinum offers unmatched durability and prestige.
              </p>
            </div>
            
            <div className="p-6">
              <h3 className="font-medium text-[#6D3D0D] mb-2">Is platinum better than white gold?</h3>
              <p className="text-[#6D3D0D]/70 text-sm leading-relaxed">
                Both are excellent choices. Platinum is naturally white, hypoallergenic, and heavier — ideal for those who want minimal maintenance. 
                White gold is lighter, more affordable, and equally beautiful with periodic rhodium re-plating.
              </p>
            </div>
            
            <div className="p-6">
              <h3 className="font-medium text-[#6D3D0D] mb-2">Does white gold turn yellow over time?</h3>
              <p className="text-[#6D3D0D]/70 text-sm leading-relaxed">
                The rhodium finish on white gold can wear over time, revealing the natural pale gold colour underneath. 
                A quick professional re-plating (every 1-2 years) restores its bright white appearance.
              </p>
            </div>
            
            <div className="p-6">
              <h3 className="font-medium text-[#6D3D0D] mb-2">What does the 750 hallmark mean?</h3>
              <p className="text-[#6D3D0D]/70 text-sm leading-relaxed">
                The 750 hallmark indicates 18k gold (75% pure gold). This official UK Assay Office mark guarantees 
                the metal&apos;s authenticity and purity. Platinum pieces carry a 950 hallmark (95% pure).
              </p>
            </div>
            
            <div className="p-6">
              <h3 className="font-medium text-[#6D3D0D] mb-2">Can I be allergic to gold?</h3>
              <p className="text-[#6D3D0D]/70 text-sm leading-relaxed">
                Pure gold is hypoallergenic, but some people react to the alloys (nickel in particular). 
                If you have sensitive skin, platinum or nickel-free gold alloys are the safest choice.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-16 border-t border-[#6D3D0D]/10">
          <span className="text-[#6D3D0D]/50 text-xs uppercase tracking-[0.3em] font-light">Personal Guidance</span>
          <h2 className="font-serif text-[#6D3D0D] text-2xl md:text-3xl mt-3 mb-4" style={{letterSpacing: '-0.02em'}}>
            Ready to Choose Your Metal?
          </h2>
          <p className="text-[#6D3D0D]/60 mb-8 max-w-xl mx-auto">
            Our experts can help you select the perfect metal for your lifestyle, preferences, and budget.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/bespoke" 
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#6D3D0D] text-white font-light tracking-wider uppercase text-sm transition-all duration-300 hover:bg-[#D4AF37]"
            >
              Book Consultation
            </Link>
            <Link 
              href="/education/diamonds" 
              className="inline-flex items-center gap-3 px-8 py-4 border border-[#6D3D0D]/30 text-[#6D3D0D] font-light tracking-wider uppercase text-sm transition-all duration-300 hover:border-[#6D3D0D]"
            >
              Learn About Diamonds
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
