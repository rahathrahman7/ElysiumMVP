import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Diamond Education | The 4Cs Explained: Cut, Color, Clarity, Carat — ELYSIUM",
  description: "Master the 4Cs of diamonds: Cut, Color, Clarity, and Carat Weight. Expert guide to diamond clarity charts, color scales, GIA certification, and choosing the perfect stone.",
  keywords: ["4Cs of diamonds", "diamond clarity chart", "diamond color scale", "diamond cut grades", "GIA certification", "diamond shapes", "diamond buying guide"],
};

export default function DiamondEducationPage() {
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
              <span className="text-[#6D3D0D]/50 text-xs uppercase tracking-[0.3em] font-light">The 4Cs Guide</span>
              <h1 className="font-serif text-[#6D3D0D] mt-4 mb-6" style={{fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.02em'}}>
                Diamond <span className="text-[#D4AF37]">Education</span>
              </h1>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-[2px] w-16 bg-[#D4AF37]"></div>
                <div className="h-[2px] w-8 bg-[#D4AF37]/40"></div>
              </div>
              <p className="text-[#6D3D0D]/70 text-lg leading-relaxed mb-8 max-w-lg">
                Understanding the <strong>4Cs</strong> — Cut, Color, Clarity, and Carat — is essential for making 
                an informed diamond purchase. Learn how each factor affects beauty, value, and investment potential.
              </p>
              <div className="flex flex-wrap gap-6 text-sm text-[#6D3D0D]/60">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>GIA Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Conflict-Free</span>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative h-[400px] lg:h-[500px]">
              <Image
                src="/education/diamondscard.png"
                alt="GIA certified round brilliant diamond showing exceptional cut quality"
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
        {/* Quick Overview */}
        <section className="mb-20">
          <div className="bg-white border border-[#6D3D0D]/10 p-8 md:p-10">
            <h2 className="font-serif text-[#6D3D0D] text-xl mb-6 text-center" style={{letterSpacing: '-0.02em'}}>
              The 4Cs at a Glance
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-[#FAF7F2] border-t-2 border-[#D4AF37]">
                <div className="font-serif text-[#D4AF37] text-2xl mb-2">Cut</div>
                <p className="text-[#6D3D0D]/60 text-sm">How well light reflects</p>
              </div>
              <div className="text-center p-4 bg-[#FAF7F2] border-t-2 border-[#D4AF37]">
                <div className="font-serif text-[#D4AF37] text-2xl mb-2">Color</div>
                <p className="text-[#6D3D0D]/60 text-sm">Absence of color (D-Z)</p>
              </div>
              <div className="text-center p-4 bg-[#FAF7F2] border-t-2 border-[#D4AF37]">
                <div className="font-serif text-[#D4AF37] text-2xl mb-2">Clarity</div>
                <p className="text-[#6D3D0D]/60 text-sm">Internal inclusions</p>
              </div>
              <div className="text-center p-4 bg-[#FAF7F2] border-t-2 border-[#D4AF37]">
                <div className="font-serif text-[#D4AF37] text-2xl mb-2">Carat</div>
                <p className="text-[#6D3D0D]/60 text-sm">Weight measurement</p>
              </div>
            </div>
          </div>
        </section>

        {/* The 4Cs Detailed */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <span className="text-[#6D3D0D]/50 text-xs uppercase tracking-[0.3em] font-light">In Depth</span>
            <h2 className="font-serif text-[#6D3D0D] text-2xl md:text-3xl mt-3" style={{letterSpacing: '-0.02em'}}>
              The 4Cs of <span className="text-[#D4AF37]">Diamond Quality</span>
            </h2>
          </div>
          
          <div className="space-y-8">
            {/* Cut */}
            <div className="bg-white border border-[#6D3D0D]/10 p-8 md:p-10">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-14 h-14 border border-[#D4AF37]/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-serif text-[#6D3D0D] text-2xl mb-2">Cut</h3>
                  <p className="text-[#D4AF37] text-sm uppercase tracking-wider mb-4">The Most Important Factor</p>
                  <p className="text-[#6D3D0D]/70 leading-relaxed">
                    Cut determines how well a diamond reflects light, creating its signature brilliance and fire. 
                    A perfectly cut diamond returns the maximum amount of light to the eye, while a poorly cut stone 
                    appears dull regardless of its other qualities.
                  </p>
                </div>
              </div>
              
              <div className="bg-[#FAF7F2] p-6 border-l-2 border-[#D4AF37]">
                <h4 className="font-medium text-[#6D3D0D] text-sm uppercase tracking-wider mb-4">Cut Grade Scale</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#6D3D0D]/10">
                    <span className="font-medium text-[#D4AF37]">Excellent / Ideal</span>
                    <span className="text-sm text-[#6D3D0D]/60">Maximum brilliance and fire — our recommendation</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-[#6D3D0D]/10">
                    <span className="font-medium text-[#6D3D0D]">Very Good</span>
                    <span className="text-sm text-[#6D3D0D]/60">High brilliance, excellent value</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-[#6D3D0D]/10">
                    <span className="font-medium text-[#6D3D0D]">Good</span>
                    <span className="text-sm text-[#6D3D0D]/60">Good brilliance, budget-conscious choice</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-[#6D3D0D]/10">
                    <span className="font-medium text-[#6D3D0D]/50">Fair</span>
                    <span className="text-sm text-[#6D3D0D]/40">Reduced brilliance — not recommended</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#6D3D0D]/50">Poor</span>
                    <span className="text-sm text-[#6D3D0D]/40">Minimal brilliance — avoid</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Color */}
            <div className="bg-white border border-[#6D3D0D]/10 p-8 md:p-10">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-14 h-14 border border-[#D4AF37]/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-serif text-[#6D3D0D] text-2xl mb-2">Color</h3>
                  <p className="text-[#D4AF37] text-sm uppercase tracking-wider mb-4">The D to Z Scale</p>
                  <p className="text-[#6D3D0D]/70 leading-relaxed">
                    Diamond color measures the absence of color. The scale runs from D (completely colorless) to Z 
                    (light yellow or brown). Colorless diamonds allow more light to pass through, creating more sparkle.
                  </p>
                </div>
              </div>
              
              <div className="bg-[#FAF7F2] p-6 border-l-2 border-[#D4AF37]">
                <h4 className="font-medium text-[#6D3D0D] text-sm uppercase tracking-wider mb-4">Color Grade Scale</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-[#6D3D0D]/10">
                      <span className="font-medium text-[#D4AF37]">D - F</span>
                      <span className="text-sm text-[#6D3D0D]/60">Colorless — highest grade</span>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b border-[#6D3D0D]/10">
                      <span className="font-medium text-[#6D3D0D]">G - J</span>
                      <span className="text-sm text-[#6D3D0D]/60">Near colorless — excellent value</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-[#6D3D0D]/10">
                      <span className="font-medium text-[#6D3D0D]/60">K - M</span>
                      <span className="text-sm text-[#6D3D0D]/40">Faint yellow</span>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b border-[#6D3D0D]/10">
                      <span className="font-medium text-[#6D3D0D]/40">N - Z</span>
                      <span className="text-sm text-[#6D3D0D]/40">Light yellow — not recommended</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Clarity */}
            <div className="bg-white border border-[#6D3D0D]/10 p-8 md:p-10">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-14 h-14 border border-[#D4AF37]/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-serif text-[#6D3D0D] text-2xl mb-2">Clarity</h3>
                  <p className="text-[#D4AF37] text-sm uppercase tracking-wider mb-4">Internal Characteristics</p>
                  <p className="text-[#6D3D0D]/70 leading-relaxed">
                    Clarity grades measure internal inclusions and surface blemishes. Most inclusions are microscopic 
                    and invisible to the naked eye. An &quot;eye-clean&quot; diamond offers excellent value.
                  </p>
                </div>
              </div>
              
              <div className="bg-[#FAF7F2] p-6 border-l-2 border-[#D4AF37]">
                <h4 className="font-medium text-[#6D3D0D] text-sm uppercase tracking-wider mb-4">Clarity Grade Scale</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-[#6D3D0D]/10">
                      <span className="font-medium text-[#6D3D0D]">FL / IF</span>
                      <span className="text-sm text-[#6D3D0D]/60">Flawless — extremely rare</span>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b border-[#6D3D0D]/10">
                      <span className="font-medium text-[#6D3D0D]">VVS1 / VVS2</span>
                      <span className="text-sm text-[#6D3D0D]/60">Very, very slightly included</span>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b border-[#D4AF37]/30 bg-[#D4AF37]/5 -mx-2 px-2 py-1">
                      <span className="font-medium text-[#D4AF37]">VS1 / VS2</span>
                      <span className="text-sm text-[#D4AF37]">Best value — eye clean</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-[#6D3D0D]/10">
                      <span className="font-medium text-[#6D3D0D]">SI1 / SI2</span>
                      <span className="text-sm text-[#6D3D0D]/60">Slightly included — good value</span>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b border-[#6D3D0D]/10">
                      <span className="font-medium text-[#6D3D0D]/50">I1 / I2 / I3</span>
                      <span className="text-sm text-[#6D3D0D]/40">Included — not recommended</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Carat Weight */}
            <div className="bg-white border border-[#6D3D0D]/10 p-8 md:p-10">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-14 h-14 border border-[#D4AF37]/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.589-1.202L18.75 4.97zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.589-1.202L5.25 4.97z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-serif text-[#6D3D0D] text-2xl mb-2">Carat Weight</h3>
                  <p className="text-[#D4AF37] text-sm uppercase tracking-wider mb-4">Size Measurement</p>
                  <p className="text-[#6D3D0D]/70 leading-relaxed">
                    Carat measures a diamond&apos;s weight, not its size. One carat equals 200 milligrams. 
                    Larger diamonds are exponentially rarer, so price increases significantly with carat weight.
                  </p>
                </div>
              </div>
              
              <div className="bg-[#FAF7F2] p-6 border-l-2 border-[#D4AF37]">
                <h4 className="font-medium text-[#6D3D0D] text-sm uppercase tracking-wider mb-4">Popular Carat Weights</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 border border-[#6D3D0D]/10 bg-white">
                    <div className="font-serif text-[#D4AF37] text-xl mb-1">0.5ct</div>
                    <p className="text-[#6D3D0D]/60 text-xs">Classic solitaire</p>
                  </div>
                  <div className="text-center p-3 border border-[#6D3D0D]/10 bg-white">
                    <div className="font-serif text-[#D4AF37] text-xl mb-1">1.0ct</div>
                    <p className="text-[#6D3D0D]/60 text-xs">Traditional choice</p>
                  </div>
                  <div className="text-center p-3 border border-[#6D3D0D]/10 bg-white">
                    <div className="font-serif text-[#D4AF37] text-xl mb-1">1.5ct</div>
                    <p className="text-[#6D3D0D]/60 text-xs">Statement piece</p>
                  </div>
                  <div className="text-center p-3 border border-[#6D3D0D]/10 bg-white">
                    <div className="font-serif text-[#D4AF37] text-xl mb-1">2.0ct+</div>
                    <p className="text-[#6D3D0D]/60 text-xs">Luxury investment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Diamond Shapes */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <span className="text-[#6D3D0D]/50 text-xs uppercase tracking-[0.3em] font-light">Shape Guide</span>
            <h2 className="font-serif text-[#6D3D0D] text-2xl md:text-3xl mt-3" style={{letterSpacing: '-0.02em'}}>
              Popular Diamond <span className="text-[#D4AF37]">Shapes</span>
            </h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-[#6D3D0D]/10 p-6 text-center hover:border-[#D4AF37]/30 transition-all duration-300 group">
              <div className="w-16 h-16 mx-auto mb-4 border border-[#D4AF37]/20 flex items-center justify-center group-hover:border-[#D4AF37]/40 transition-colors">
                <div className="w-8 h-8 rounded-full border-2 border-[#D4AF37]"></div>
              </div>
              <h3 className="font-serif text-[#6D3D0D] text-lg mb-2">Round Brilliant</h3>
              <p className="text-[#6D3D0D]/60 text-sm">The most popular choice with 58 facets for maximum brilliance and fire.</p>
            </div>
            
            <div className="bg-white border border-[#6D3D0D]/10 p-6 text-center hover:border-[#D4AF37]/30 transition-all duration-300 group">
              <div className="w-16 h-16 mx-auto mb-4 border border-[#D4AF37]/20 flex items-center justify-center group-hover:border-[#D4AF37]/40 transition-colors">
                <div className="w-8 h-8 border-2 border-[#D4AF37] rotate-45"></div>
              </div>
              <h3 className="font-serif text-[#6D3D0D] text-lg mb-2">Princess Cut</h3>
              <p className="text-[#6D3D0D]/60 text-sm">Modern square shape with excellent fire and brilliance.</p>
            </div>
            
            <div className="bg-white border border-[#6D3D0D]/10 p-6 text-center hover:border-[#D4AF37]/30 transition-all duration-300 group">
              <div className="w-16 h-16 mx-auto mb-4 border border-[#D4AF37]/20 flex items-center justify-center group-hover:border-[#D4AF37]/40 transition-colors">
                <div className="w-10 h-6 rounded-full border-2 border-[#D4AF37]"></div>
              </div>
              <h3 className="font-serif text-[#6D3D0D] text-lg mb-2">Oval</h3>
              <p className="text-[#6D3D0D]/60 text-sm">Elegant and elongating, creates the illusion of longer fingers.</p>
            </div>
            
            <div className="bg-white border border-[#6D3D0D]/10 p-6 text-center hover:border-[#D4AF37]/30 transition-all duration-300 group">
              <div className="w-16 h-16 mx-auto mb-4 border border-[#D4AF37]/20 flex items-center justify-center group-hover:border-[#D4AF37]/40 transition-colors">
                <div className="w-10 h-7 border-2 border-[#D4AF37]"></div>
              </div>
              <h3 className="font-serif text-[#6D3D0D] text-lg mb-2">Emerald Cut</h3>
              <p className="text-[#6D3D0D]/60 text-sm">Step-cut facets create a sophisticated hall-of-mirrors effect.</p>
            </div>
            
            <div className="bg-white border border-[#6D3D0D]/10 p-6 text-center hover:border-[#D4AF37]/30 transition-all duration-300 group">
              <div className="w-16 h-16 mx-auto mb-4 border border-[#D4AF37]/20 flex items-center justify-center group-hover:border-[#D4AF37]/40 transition-colors">
                <div className="w-4 h-8 rounded-full border-2 border-[#D4AF37] rotate-90"></div>
              </div>
              <h3 className="font-serif text-[#6D3D0D] text-lg mb-2">Marquise</h3>
              <p className="text-[#6D3D0D]/60 text-sm">Elongated with pointed ends for a dramatic, regal appearance.</p>
            </div>
            
            <div className="bg-white border border-[#6D3D0D]/10 p-6 text-center hover:border-[#D4AF37]/30 transition-all duration-300 group">
              <div className="w-16 h-16 mx-auto mb-4 border border-[#D4AF37]/20 flex items-center justify-center group-hover:border-[#D4AF37]/40 transition-colors">
                <div className="w-7 h-9 rounded-b-full border-2 border-[#D4AF37]"></div>
              </div>
              <h3 className="font-serif text-[#6D3D0D] text-lg mb-2">Pear</h3>
              <p className="text-[#6D3D0D]/60 text-sm">Unique teardrop shape, versatile and elegant.</p>
            </div>
          </div>
        </section>

        {/* Certification */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <span className="text-[#6D3D0D]/50 text-xs uppercase tracking-[0.3em] font-light">Authenticity</span>
            <h2 className="font-serif text-[#6D3D0D] text-2xl md:text-3xl mt-3" style={{letterSpacing: '-0.02em'}}>
              Diamond <span className="text-[#D4AF37]">Certification</span>
            </h2>
          </div>
          
          <div className="bg-white border border-[#6D3D0D]/10 p-8 md:p-10">
            <p className="text-[#6D3D0D]/70 leading-relaxed mb-8 text-center max-w-2xl mx-auto">
              Always purchase diamonds with certification from reputable laboratories. 
              These independent reports verify the 4Cs and protect your investment.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 border border-[#D4AF37]/30 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <h4 className="font-serif text-[#6D3D0D] text-lg mb-2">GIA</h4>
                <p className="text-[#6D3D0D]/60 text-sm">Gemological Institute of America — the gold standard in diamond grading</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 border border-[#D4AF37]/30 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                  </svg>
                </div>
                <h4 className="font-serif text-[#6D3D0D] text-lg mb-2">IGI</h4>
                <p className="text-[#6D3D0D]/60 text-sm">International Gemological Institute — trusted worldwide certification</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 border border-[#D4AF37]/30 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                  </svg>
                </div>
                <h4 className="font-serif text-[#6D3D0D] text-lg mb-2">HRD</h4>
                <p className="text-[#6D3D0D]/60 text-sm">Hoge Raad voor Diamant — European diamond certification authority</p>
              </div>
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
              <h3 className="font-medium text-[#6D3D0D] mb-2">Which of the 4Cs is most important?</h3>
              <p className="text-[#6D3D0D]/70 text-sm leading-relaxed">
                Cut is the most important factor for a diamond&apos;s beauty. A well-cut diamond will have exceptional 
                brilliance and fire, even if it has slightly lower color or clarity grades.
              </p>
            </div>
            
            <div className="p-6">
              <h3 className="font-medium text-[#6D3D0D] mb-2">What is the best clarity grade for value?</h3>
              <p className="text-[#6D3D0D]/70 text-sm leading-relaxed">
                VS1 or VS2 clarity offers the best value. These grades are &quot;eye-clean&quot; — inclusions are not 
                visible without magnification — but cost significantly less than VVS or Flawless grades.
              </p>
            </div>
            
            <div className="p-6">
              <h3 className="font-medium text-[#6D3D0D] mb-2">Does a larger carat weight mean better quality?</h3>
              <p className="text-[#6D3D0D]/70 text-sm leading-relaxed">
                No, carat measures weight, not quality. A smaller diamond with excellent cut, color, and clarity 
                can be more beautiful (and valuable) than a larger stone with poor grades.
              </p>
            </div>
            
            <div className="p-6">
              <h3 className="font-medium text-[#6D3D0D] mb-2">Why is GIA certification important?</h3>
              <p className="text-[#6D3D0D]/70 text-sm leading-relaxed">
                GIA is the most respected and consistent diamond grading laboratory. Their reports provide unbiased 
                assessments, protecting your purchase and ensuring you know exactly what you&apos;re buying.
              </p>
            </div>
            
            <div className="p-6">
              <h3 className="font-medium text-[#6D3D0D] mb-2">What color grade should I choose?</h3>
              <p className="text-[#6D3D0D]/70 text-sm leading-relaxed">
                G or H color offers excellent value — these are near-colorless and appear white to the naked eye. 
                D-F grades command premium prices but the difference is only visible under laboratory conditions.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-16 border-t border-[#6D3D0D]/10">
          <span className="text-[#6D3D0D]/50 text-xs uppercase tracking-[0.3em] font-light">Personal Guidance</span>
          <h2 className="font-serif text-[#6D3D0D] text-2xl md:text-3xl mt-3 mb-4" style={{letterSpacing: '-0.02em'}}>
            Ready to Choose Your Diamond?
          </h2>
          <p className="text-[#6D3D0D]/60 mb-8 max-w-xl mx-auto">
            Our GIA-certified experts can help you find the perfect diamond for your preferences and budget.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/bespoke" 
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#6D3D0D] text-white font-light tracking-wider uppercase text-sm transition-all duration-300 hover:bg-[#D4AF37]"
            >
              Book Consultation
            </Link>
            <Link 
              href="/education/metals" 
              className="inline-flex items-center gap-3 px-8 py-4 border border-[#6D3D0D]/30 text-[#6D3D0D] font-light tracking-wider uppercase text-sm transition-all duration-300 hover:border-[#6D3D0D]"
            >
              Learn About Metals
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
