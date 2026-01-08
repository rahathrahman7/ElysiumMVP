import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Jewelry Care Guide | How to Clean Diamond Rings at Home — ELYSIUM",
  description: "Expert tips on cleaning diamond jewelry at home, storing precious pieces safely, and maintaining gold and platinum. Protect your investment for generations.",
  keywords: ["how to clean diamond ring", "jewelry care tips", "gold jewelry maintenance", "platinum care", "jewelry cleaning", "diamond ring care", "jewelry storage"],
};

export default function CareEducationPage() {
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
              <span className="text-[#6D3D0D]/50 text-xs uppercase tracking-[0.3em] font-light">Maintenance Guide</span>
              <h1 className="font-serif text-[#6D3D0D] mt-4 mb-6" style={{fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.02em'}}>
                Jewelry <span className="text-[#D4AF37]">Care</span>
              </h1>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-[2px] w-16 bg-[#D4AF37]"></div>
                <div className="h-[2px] w-8 bg-[#D4AF37]/40"></div>
              </div>
              <p className="text-[#6D3D0D]/70 text-lg leading-relaxed mb-8 max-w-lg">
                Proper care ensures your precious pieces maintain their beauty and value for generations. 
                Learn how to clean, store, and protect your fine jewelry at home.
              </p>
              <div className="flex flex-wrap gap-6 text-sm text-[#6D3D0D]/60">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Free Lifetime Cleaning</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Expert Service Team</span>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative h-[400px] lg:h-[500px]">
              <Image
                src="/education/carecard.png"
                alt="Professional jewelry care tools and cleaning supplies"
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
        {/* Daily Care Tips */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <span className="text-[#6D3D0D]/50 text-xs uppercase tracking-[0.3em] font-light">Everyday Habits</span>
            <h2 className="font-serif text-[#6D3D0D] text-2xl md:text-3xl mt-3" style={{letterSpacing: '-0.02em'}}>
              Daily <span className="text-[#D4AF37]">Care Tips</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-[#6D3D0D]/10 p-8">
              <div className="w-12 h-12 border border-[#D4AF37]/30 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-serif text-[#6D3D0D] text-lg mb-4">Do</h3>
              <ul className="space-y-3 text-sm text-[#6D3D0D]/70">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 mt-0.5">+</span>
                  Put your jewelry on last, after makeup and perfume
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 mt-0.5">+</span>
                  Remove before washing hands or showering
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 mt-0.5">+</span>
                  Store pieces separately to prevent scratching
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 mt-0.5">+</span>
                  Wipe with a soft cloth after each wear
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 mt-0.5">+</span>
                  Have settings inspected every 6-12 months
                </li>
              </ul>
            </div>
            
            <div className="bg-white border border-[#6D3D0D]/10 p-8">
              <div className="w-12 h-12 border border-[#D4AF37]/30 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
              <h3 className="font-serif text-[#6D3D0D] text-lg mb-4">Avoid</h3>
              <ul className="space-y-3 text-sm text-[#6D3D0D]/70">
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-0.5">-</span>
                  Swimming pools and hot tubs (chlorine damage)
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-0.5">-</span>
                  Household chemicals and cleaning products
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-0.5">-</span>
                  Exercising or heavy lifting while wearing rings
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-0.5">-</span>
                  Sleeping in your jewelry (tangles and pressure)
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-0.5">-</span>
                  Direct contact with perfumes and lotions
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Home Cleaning Guide */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <span className="text-[#6D3D0D]/50 text-xs uppercase tracking-[0.3em] font-light">Step-by-Step</span>
            <h2 className="font-serif text-[#6D3D0D] text-2xl md:text-3xl mt-3" style={{letterSpacing: '-0.02em'}}>
              Home <span className="text-[#D4AF37]">Cleaning Guide</span>
            </h2>
          </div>
          
          <div className="bg-white border border-[#6D3D0D]/10 p-8 md:p-10">
            <div className="flex items-start gap-6 mb-8">
              <div className="w-14 h-14 border border-[#D4AF37]/30 flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <div>
                <h3 className="font-serif text-[#6D3D0D] text-xl mb-2">Cleaning Diamond Jewelry at Home</h3>
                <p className="text-[#D4AF37] text-sm uppercase tracking-wider mb-4">Safe for All Diamond Settings</p>
                <p className="text-[#6D3D0D]/70 leading-relaxed">
                  Regular cleaning keeps your diamonds sparkling and allows you to inspect settings for any loosening. 
                  This gentle method is safe for all metal types and most gemstones.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex gap-6 items-start">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center flex-shrink-0 text-white font-serif">1</div>
                <div className="flex-1">
                  <h4 className="font-medium text-[#6D3D0D] mb-2">Prepare the Solution</h4>
                  <p className="text-sm text-[#6D3D0D]/70">
                    Fill a small bowl with warm (not hot) water and add a few drops of mild dish soap. 
                    Avoid harsh chemicals, bleach, or abrasive cleaners.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-6 items-start">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center flex-shrink-0 text-white font-serif">2</div>
                <div className="flex-1">
                  <h4 className="font-medium text-[#6D3D0D] mb-2">Soak the Jewelry</h4>
                  <p className="text-sm text-[#6D3D0D]/70">
                    Place your jewelry in the solution and let it soak for 20-30 minutes. 
                    This loosens oils, lotions, and everyday buildup.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-6 items-start">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center flex-shrink-0 text-white font-serif">3</div>
                <div className="flex-1">
                  <h4 className="font-medium text-[#6D3D0D] mb-2">Gentle Brushing</h4>
                  <p className="text-sm text-[#6D3D0D]/70">
                    Use a soft toothbrush (baby toothbrushes work perfectly) to gently clean around stones and settings. 
                    Pay special attention to the back of the diamond where oils collect.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-6 items-start">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center flex-shrink-0 text-white font-serif">4</div>
                <div className="flex-1">
                  <h4 className="font-medium text-[#6D3D0D] mb-2">Rinse Thoroughly</h4>
                  <p className="text-sm text-[#6D3D0D]/70">
                    Rinse under warm running water. Always close the drain or work over a bowl to prevent accidents. 
                    Ensure all soap residue is removed.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-6 items-start">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center flex-shrink-0 text-white font-serif">5</div>
                <div className="flex-1">
                  <h4 className="font-medium text-[#6D3D0D] mb-2">Dry and Polish</h4>
                  <p className="text-sm text-[#6D3D0D]/70">
                    Pat dry with a lint-free cloth or let air dry on a soft towel. 
                    Finish with a gentle polish using a jewelry cloth for extra shine.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-amber-50 border border-amber-200 text-sm text-amber-800">
              <strong>Note:</strong> Clean your jewelry every 1-2 weeks for optimal sparkle. More frequent cleaning may be needed 
              if you wear your pieces daily or use lotions and perfumes regularly.
            </div>
          </div>
        </section>

        {/* Metal-Specific Care */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <span className="text-[#6D3D0D]/50 text-xs uppercase tracking-[0.3em] font-light">By Metal Type</span>
            <h2 className="font-serif text-[#6D3D0D] text-2xl md:text-3xl mt-3" style={{letterSpacing: '-0.02em'}}>
              Metal-Specific <span className="text-[#D4AF37]">Care</span>
            </h2>
          </div>
          
          <div className="space-y-6">
            {/* Gold Care */}
            <div className="bg-white border border-[#6D3D0D]/10 p-8">
              <h3 className="font-serif text-[#6D3D0D] text-xl mb-4">Gold Care</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-[#FAF7F2] p-4 border-l-2 border-[#FFD700]">
                  <h4 className="font-medium text-[#6D3D0D] text-sm mb-2">Yellow Gold</h4>
                  <p className="text-sm text-[#6D3D0D]/60">
                    The most durable gold colour. Clean with warm soapy water. Polish with a soft cloth to maintain shine.
                  </p>
                </div>
                <div className="bg-[#FAF7F2] p-4 border-l-2 border-gray-300">
                  <h4 className="font-medium text-[#6D3D0D] text-sm mb-2">White Gold</h4>
                  <p className="text-sm text-[#6D3D0D]/60">
                    Rhodium plating may wear over time. Professional re-plating every 1-2 years restores the bright white finish.
                  </p>
                </div>
                <div className="bg-[#FAF7F2] p-4 border-l-2 border-[#B76E79]">
                  <h4 className="font-medium text-[#6D3D0D] text-sm mb-2">Rose Gold</h4>
                  <p className="text-sm text-[#6D3D0D]/60">
                    Higher copper content can darken over time. Polish gently to restore colour. Avoid harsh chemicals.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Platinum Care */}
            <div className="bg-white border border-[#6D3D0D]/10 p-8">
              <h3 className="font-serif text-[#6D3D0D] text-xl mb-4">Platinum Care</h3>
              <p className="text-[#6D3D0D]/70 mb-6 leading-relaxed">
                Platinum is extremely durable but will develop a natural patina over time. Many people love this soft, 
                lived-in look. If you prefer a polished finish, professional buffing can restore the original shine.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 text-sm text-[#6D3D0D]/70">
                  <svg className="w-5 h-5 text-[#D4AF37] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Clean the same way as gold (warm soapy water)</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-[#6D3D0D]/70">
                  <svg className="w-5 h-5 text-[#D4AF37] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>No re-plating needed — naturally white forever</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-[#6D3D0D]/70">
                  <svg className="w-5 h-5 text-[#D4AF37] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Scratches can be polished out professionally</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-[#6D3D0D]/70">
                  <svg className="w-5 h-5 text-[#D4AF37] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Hypoallergenic — safe for sensitive skin</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Storage Guide */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <span className="text-[#6D3D0D]/50 text-xs uppercase tracking-[0.3em] font-light">Protection</span>
            <h2 className="font-serif text-[#6D3D0D] text-2xl md:text-3xl mt-3" style={{letterSpacing: '-0.02em'}}>
              Storage <span className="text-[#D4AF37]">Guide</span>
            </h2>
          </div>
          
          <div className="bg-white border border-[#6D3D0D]/10 p-8 md:p-10">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-serif text-[#6D3D0D] text-lg mb-6">Proper Storage</h3>
                <ul className="space-y-4 text-sm text-[#6D3D0D]/70">
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-0.5">—</span>
                    <span><strong className="text-[#6D3D0D]">Separate compartments:</strong> Store each piece individually to prevent scratching</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-0.5">—</span>
                    <span><strong className="text-[#6D3D0D]">Soft pouches:</strong> Use fabric-lined boxes or soft pouches for protection</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-0.5">—</span>
                    <span><strong className="text-[#6D3D0D]">Cool, dry place:</strong> Avoid humidity and extreme temperatures</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-0.5">—</span>
                    <span><strong className="text-[#6D3D0D]">Secure location:</strong> Consider a home safe for valuable pieces</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-serif text-[#6D3D0D] text-lg mb-6">Traveling with Jewelry</h3>
                <ul className="space-y-4 text-sm text-[#6D3D0D]/70">
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-0.5">—</span>
                    <span><strong className="text-[#6D3D0D]">Carry-on only:</strong> Never pack fine jewelry in checked luggage</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-0.5">—</span>
                    <span><strong className="text-[#6D3D0D]">Travel case:</strong> Use a padded travel case with individual compartments</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-0.5">—</span>
                    <span><strong className="text-[#6D3D0D]">Insurance:</strong> Ensure your jewelry insurance covers travel</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-0.5">—</span>
                    <span><strong className="text-[#6D3D0D]">Hotel safe:</strong> Use the room safe when not wearing pieces</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Professional Services */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <span className="text-[#6D3D0D]/50 text-xs uppercase tracking-[0.3em] font-light">Expert Care</span>
            <h2 className="font-serif text-[#6D3D0D] text-2xl md:text-3xl mt-3" style={{letterSpacing: '-0.02em'}}>
              Professional <span className="text-[#D4AF37]">Services</span>
            </h2>
          </div>
          
          <div className="bg-white border border-[#6D3D0D]/10 p-8 md:p-10">
            <p className="text-[#6D3D0D]/70 text-center mb-8 max-w-2xl mx-auto">
              Some maintenance requires professional expertise. Our complimentary lifetime service includes:
            </p>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-[#FAF7F2] border border-[#6D3D0D]/10">
                <div className="w-12 h-12 border border-[#D4AF37]/30 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <h4 className="font-medium text-[#6D3D0D] mb-2">Deep Cleaning</h4>
                <p className="text-sm text-[#6D3D0D]/60">Professional ultrasonic and steam cleaning</p>
              </div>
              
              <div className="text-center p-6 bg-[#FAF7F2] border border-[#6D3D0D]/10">
                <div className="w-12 h-12 border border-[#D4AF37]/30 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <h4 className="font-medium text-[#6D3D0D] mb-2">Stone Inspection</h4>
                <p className="text-sm text-[#6D3D0D]/60">Check settings and prongs for security</p>
              </div>
              
              <div className="text-center p-6 bg-[#FAF7F2] border border-[#6D3D0D]/10">
                <div className="w-12 h-12 border border-[#D4AF37]/30 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197" />
                  </svg>
                </div>
                <h4 className="font-medium text-[#6D3D0D] mb-2">Rhodium Plating</h4>
                <p className="text-sm text-[#6D3D0D]/60">Restore white gold brightness</p>
              </div>
              
              <div className="text-center p-6 bg-[#FAF7F2] border border-[#6D3D0D]/10">
                <div className="w-12 h-12 border border-[#D4AF37]/30 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                  </svg>
                </div>
                <h4 className="font-medium text-[#6D3D0D] mb-2">Polishing</h4>
                <p className="text-sm text-[#6D3D0D]/60">Remove scratches and restore shine</p>
              </div>
              
              <div className="text-center p-6 bg-[#FAF7F2] border border-[#6D3D0D]/10">
                <div className="w-12 h-12 border border-[#D4AF37]/30 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                  </svg>
                </div>
                <h4 className="font-medium text-[#6D3D0D] mb-2">Resizing</h4>
                <p className="text-sm text-[#6D3D0D]/60">Adjust ring size as needed</p>
              </div>
              
              <div className="text-center p-6 bg-[#FAF7F2] border border-[#6D3D0D]/10">
                <div className="w-12 h-12 border border-[#D4AF37]/30 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                  </svg>
                </div>
                <h4 className="font-medium text-[#6D3D0D] mb-2">Valuation</h4>
                <p className="text-sm text-[#6D3D0D]/60">Insurance and appraisal documents</p>
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
              <h3 className="font-medium text-[#6D3D0D] mb-2">How often should I clean my diamond ring?</h3>
              <p className="text-[#6D3D0D]/70 text-sm leading-relaxed">
                For daily wear, clean your diamond ring at home every 1-2 weeks. Have it professionally cleaned 
                every 6 months, or more frequently if you notice buildup or reduced sparkle.
              </p>
            </div>
            
            <div className="p-6">
              <h3 className="font-medium text-[#6D3D0D] mb-2">Can I use ultrasonic cleaners at home?</h3>
              <p className="text-[#6D3D0D]/70 text-sm leading-relaxed">
                We recommend professional ultrasonic cleaning only. Home ultrasonic machines can loosen stones in 
                some settings. The gentle soap-and-brush method is safer for regular home cleaning.
              </p>
            </div>
            
            <div className="p-6">
              <h3 className="font-medium text-[#6D3D0D] mb-2">Why does my white gold look yellow?</h3>
              <p className="text-[#6D3D0D]/70 text-sm leading-relaxed">
                White gold is naturally pale yellow — the bright white colour comes from rhodium plating. As this 
                plating wears (typically every 1-2 years), the natural colour shows through. A quick re-plating 
                restores the white finish.
              </p>
            </div>
            
            <div className="p-6">
              <h3 className="font-medium text-[#6D3D0D] mb-2">Is it safe to shower with my engagement ring?</h3>
              <p className="text-[#6D3D0D]/70 text-sm leading-relaxed">
                We recommend removing your ring before showering. Soap can build up behind stones, reducing sparkle, 
                and some shampoos/conditioners contain chemicals that can dull metal over time.
              </p>
            </div>
            
            <div className="p-6">
              <h3 className="font-medium text-[#6D3D0D] mb-2">How do I know if my stones are loose?</h3>
              <p className="text-[#6D3D0D]/70 text-sm leading-relaxed">
                Hold your ring close to your ear and gently tap it. A loose stone may produce a rattling sound. 
                You can also try to wiggle the stone gently with a toothpick — it shouldn&apos;t move. When in doubt, 
                bring it in for a professional inspection.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-16 border-t border-[#6D3D0D]/10">
          <span className="text-[#6D3D0D]/50 text-xs uppercase tracking-[0.3em] font-light">Professional Care</span>
          <h2 className="font-serif text-[#6D3D0D] text-2xl md:text-3xl mt-3 mb-4" style={{letterSpacing: '-0.02em'}}>
            Need Professional Cleaning?
          </h2>
          <p className="text-[#6D3D0D]/60 mb-8 max-w-xl mx-auto">
            Book a complimentary cleaning and inspection with our service team. We&apos;ll have your pieces sparkling like new.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/bespoke" 
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#6D3D0D] text-white font-light tracking-wider uppercase text-sm transition-all duration-300 hover:bg-[#D4AF37]"
            >
              Book Service
            </Link>
            <Link 
              href="/education/settings" 
              className="inline-flex items-center gap-3 px-8 py-4 border border-[#6D3D0D]/30 text-[#6D3D0D] font-light tracking-wider uppercase text-sm transition-all duration-300 hover:border-[#6D3D0D]"
            >
              Learn About Settings
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
