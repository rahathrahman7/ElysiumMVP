import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Ring Setting Styles Guide | Prong, Bezel, Pave, Halo Explained — ELYSIUM",
  description: "Complete guide to engagement ring settings: prong, bezel, pave, halo, channel, and cathedral. Learn how each setting affects diamond security, light performance, and style.",
  keywords: ["ring settings", "prong setting", "bezel setting", "pave setting", "halo setting", "engagement ring styles", "diamond settings", "cathedral setting"],
};

export default function SettingsEducationPage() {
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
              <span className="text-[#6D3D0D]/50 text-xs uppercase tracking-[0.3em] font-light">Setting Styles Guide</span>
              <h1 className="font-serif text-[#6D3D0D] mt-4 mb-6" style={{fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.02em'}}>
                Ring <span className="text-[#D4AF37]">Settings</span>
              </h1>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-[2px] w-16 bg-[#D4AF37]"></div>
                <div className="h-[2px] w-8 bg-[#D4AF37]/40"></div>
              </div>
              <p className="text-[#6D3D0D]/70 text-lg leading-relaxed mb-8 max-w-lg">
                The setting is the foundation of your ring — it holds the diamond securely while showcasing its beauty. 
                Learn how different settings affect security, light performance, and overall style.
              </p>
              <div className="flex flex-wrap gap-6 text-sm text-[#6D3D0D]/60">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Handcrafted Settings</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Lifetime Warranty</span>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative h-[400px] lg:h-[500px]">
              <Image
                src="/education/settingscard.png"
                alt="Platinum prong setting detail showing expert craftsmanship"
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
        {/* Setting Types Overview */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <span className="text-[#6D3D0D]/50 text-xs uppercase tracking-[0.3em] font-light">Popular Styles</span>
            <h2 className="font-serif text-[#6D3D0D] text-2xl md:text-3xl mt-3" style={{letterSpacing: '-0.02em'}}>
              Setting <span className="text-[#D4AF37]">Types</span>
            </h2>
          </div>
          
          <div className="space-y-8">
            {/* Prong Setting */}
            <div className="bg-white border border-[#6D3D0D]/10 p-8 md:p-10">
              <div className="grid md:grid-cols-3 gap-8 items-start">
                <div className="md:col-span-2">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="w-14 h-14 border border-[#D4AF37]/30 flex items-center justify-center flex-shrink-0">
                      <svg className="w-7 h-7 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-serif text-[#6D3D0D] text-2xl mb-2">Prong Setting</h3>
                      <p className="text-[#D4AF37] text-sm uppercase tracking-wider mb-4">The Classic Choice</p>
                      <p className="text-[#6D3D0D]/70 leading-relaxed">
                        Metal claws (typically 4 or 6) grip the diamond at its girdle, elevating it above the band. 
                        This allows maximum light to enter the stone, creating exceptional brilliance and fire.
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-[#FAF7F2] p-4 border-l-2 border-green-500">
                      <h4 className="font-medium text-[#6D3D0D] text-sm mb-2">Advantages</h4>
                      <ul className="text-sm text-[#6D3D0D]/60 space-y-1">
                        <li>Maximum light performance</li>
                        <li>Showcases the diamond beautifully</li>
                        <li>Easy to clean around the stone</li>
                        <li>Timeless, elegant appearance</li>
                      </ul>
                    </div>
                    <div className="bg-[#FAF7F2] p-4 border-l-2 border-amber-500">
                      <h4 className="font-medium text-[#6D3D0D] text-sm mb-2">Considerations</h4>
                      <ul className="text-sm text-[#6D3D0D]/60 space-y-1">
                        <li>Prongs can snag on fabrics</li>
                        <li>Regular prong checks needed</li>
                        <li>Stone more exposed to impact</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FAF7F2] p-6 border border-[#6D3D0D]/10">
                  <h4 className="font-medium text-[#6D3D0D] text-sm uppercase tracking-wider mb-4">Best For</h4>
                  <ul className="text-sm text-[#6D3D0D]/60 space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#D4AF37]"></span>
                      Round brilliant diamonds
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#D4AF37]"></span>
                      Maximum sparkle preference
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#D4AF37]"></span>
                      Classic, timeless style
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#D4AF37]"></span>
                      Office or low-activity lifestyle
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Bezel Setting */}
            <div className="bg-white border border-[#6D3D0D]/10 p-8 md:p-10">
              <div className="grid md:grid-cols-3 gap-8 items-start">
                <div className="md:col-span-2">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="w-14 h-14 border border-[#D4AF37]/30 flex items-center justify-center flex-shrink-0">
                      <svg className="w-7 h-7 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-serif text-[#6D3D0D] text-2xl mb-2">Bezel Setting</h3>
                      <p className="text-[#D4AF37] text-sm uppercase tracking-wider mb-4">Maximum Security</p>
                      <p className="text-[#6D3D0D]/70 leading-relaxed">
                        A thin metal rim completely surrounds the diamond&apos;s circumference, holding it securely in place. 
                        This protective design is ideal for active lifestyles and offers a sleek, modern look.
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-[#FAF7F2] p-4 border-l-2 border-green-500">
                      <h4 className="font-medium text-[#6D3D0D] text-sm mb-2">Advantages</h4>
                      <ul className="text-sm text-[#6D3D0D]/60 space-y-1">
                        <li>Excellent stone protection</li>
                        <li>Smooth profile, no snagging</li>
                        <li>Modern, minimalist aesthetic</li>
                        <li>Low maintenance</li>
                      </ul>
                    </div>
                    <div className="bg-[#FAF7F2] p-4 border-l-2 border-amber-500">
                      <h4 className="font-medium text-[#6D3D0D] text-sm mb-2">Considerations</h4>
                      <ul className="text-sm text-[#6D3D0D]/60 space-y-1">
                        <li>Less light enters the stone</li>
                        <li>Can make diamond appear smaller</li>
                        <li>Harder to clean underneath</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FAF7F2] p-6 border border-[#6D3D0D]/10">
                  <h4 className="font-medium text-[#6D3D0D] text-sm uppercase tracking-wider mb-4">Best For</h4>
                  <ul className="text-sm text-[#6D3D0D]/60 space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#D4AF37]"></span>
                      Active lifestyles
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#D4AF37]"></span>
                      Hands-on professions
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#D4AF37]"></span>
                      Modern, sleek preference
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#D4AF37]"></span>
                      Round or oval diamonds
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Halo Setting */}
            <div className="bg-white border border-[#6D3D0D]/10 p-8 md:p-10">
              <div className="grid md:grid-cols-3 gap-8 items-start">
                <div className="md:col-span-2">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="w-14 h-14 border border-[#D4AF37]/30 flex items-center justify-center flex-shrink-0">
                      <svg className="w-7 h-7 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-serif text-[#6D3D0D] text-2xl mb-2">Halo Setting</h3>
                      <p className="text-[#D4AF37] text-sm uppercase tracking-wider mb-4">Maximum Impact</p>
                      <p className="text-[#6D3D0D]/70 leading-relaxed">
                        A circle of smaller diamonds surrounds the center stone, creating a dazzling frame that makes 
                        the main diamond appear larger and more brilliant. Available in single or double halo designs.
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-[#FAF7F2] p-4 border-l-2 border-green-500">
                      <h4 className="font-medium text-[#6D3D0D] text-sm mb-2">Advantages</h4>
                      <ul className="text-sm text-[#6D3D0D]/60 space-y-1">
                        <li>Makes center stone look larger</li>
                        <li>Exceptional sparkle and presence</li>
                        <li>Adds protection to center stone</li>
                        <li>Vintage or glamorous appeal</li>
                      </ul>
                    </div>
                    <div className="bg-[#FAF7F2] p-4 border-l-2 border-amber-500">
                      <h4 className="font-medium text-[#6D3D0D] text-sm mb-2">Considerations</h4>
                      <ul className="text-sm text-[#6D3D0D]/60 space-y-1">
                        <li>Small stones may loosen over time</li>
                        <li>More intricate cleaning required</li>
                        <li>Higher cost due to additional stones</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FAF7F2] p-6 border border-[#6D3D0D]/10">
                  <h4 className="font-medium text-[#6D3D0D] text-sm uppercase tracking-wider mb-4">Best For</h4>
                  <ul className="text-sm text-[#6D3D0D]/60 space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#D4AF37]"></span>
                      Maximum visual impact
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#D4AF37]"></span>
                      Smaller center stones
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#D4AF37]"></span>
                      Vintage or glamorous style
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#D4AF37]"></span>
                      Any diamond shape
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Pave Setting */}
            <div className="bg-white border border-[#6D3D0D]/10 p-8 md:p-10">
              <div className="grid md:grid-cols-3 gap-8 items-start">
                <div className="md:col-span-2">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="w-14 h-14 border border-[#D4AF37]/30 flex items-center justify-center flex-shrink-0">
                      <svg className="w-7 h-7 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-serif text-[#6D3D0D] text-2xl mb-2">Pave Setting</h3>
                      <p className="text-[#D4AF37] text-sm uppercase tracking-wider mb-4">Continuous Sparkle</p>
                      <p className="text-[#6D3D0D]/70 leading-relaxed">
                        Tiny diamonds are set closely together along the band, held by small beads of metal. 
                        This creates a continuous surface of sparkle that complements the center stone beautifully.
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-[#FAF7F2] p-4 border-l-2 border-green-500">
                      <h4 className="font-medium text-[#6D3D0D] text-sm mb-2">Advantages</h4>
                      <ul className="text-sm text-[#6D3D0D]/60 space-y-1">
                        <li>Adds sparkle to the entire ring</li>
                        <li>Elegant, luxurious appearance</li>
                        <li>Complements any center stone</li>
                        <li>Makes the ring appear more substantial</li>
                      </ul>
                    </div>
                    <div className="bg-[#FAF7F2] p-4 border-l-2 border-amber-500">
                      <h4 className="font-medium text-[#6D3D0D] text-sm mb-2">Considerations</h4>
                      <ul className="text-sm text-[#6D3D0D]/60 space-y-1">
                        <li>Small stones may come loose</li>
                        <li>Difficult to resize</li>
                        <li>Requires careful cleaning</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FAF7F2] p-6 border border-[#6D3D0D]/10">
                  <h4 className="font-medium text-[#6D3D0D] text-sm uppercase tracking-wider mb-4">Best For</h4>
                  <ul className="text-sm text-[#6D3D0D]/60 space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#D4AF37]"></span>
                      Maximum sparkle preference
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#D4AF37]"></span>
                      Adding elegance to band
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#D4AF37]"></span>
                      Pairing with solitaire settings
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#D4AF37]"></span>
                      Romantic, detailed style
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Channel Setting */}
            <div className="bg-white border border-[#6D3D0D]/10 p-8 md:p-10">
              <div className="grid md:grid-cols-3 gap-8 items-start">
                <div className="md:col-span-2">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="w-14 h-14 border border-[#D4AF37]/30 flex items-center justify-center flex-shrink-0">
                      <svg className="w-7 h-7 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-serif text-[#6D3D0D] text-2xl mb-2">Channel Setting</h3>
                      <p className="text-[#D4AF37] text-sm uppercase tracking-wider mb-4">Sleek &amp; Secure</p>
                      <p className="text-[#6D3D0D]/70 leading-relaxed">
                        Diamonds are set between two parallel metal walls, creating a smooth, flush surface. 
                        This secure design protects the stones while offering a clean, contemporary look.
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-[#FAF7F2] p-4 border-l-2 border-green-500">
                      <h4 className="font-medium text-[#6D3D0D] text-sm mb-2">Advantages</h4>
                      <ul className="text-sm text-[#6D3D0D]/60 space-y-1">
                        <li>Very secure stone setting</li>
                        <li>Smooth, snag-free surface</li>
                        <li>Clean, modern appearance</li>
                        <li>Good for active lifestyles</li>
                      </ul>
                    </div>
                    <div className="bg-[#FAF7F2] p-4 border-l-2 border-amber-500">
                      <h4 className="font-medium text-[#6D3D0D] text-sm mb-2">Considerations</h4>
                      <ul className="text-sm text-[#6D3D0D]/60 space-y-1">
                        <li>Harder to clean inside channel</li>
                        <li>Difficult to resize</li>
                        <li>Limited light entry to stones</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FAF7F2] p-6 border border-[#6D3D0D]/10">
                  <h4 className="font-medium text-[#6D3D0D] text-sm uppercase tracking-wider mb-4">Best For</h4>
                  <ul className="text-sm text-[#6D3D0D]/60 space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#D4AF37]"></span>
                      Active lifestyles
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#D4AF37]"></span>
                      Clean, modern aesthetic
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#D4AF37]"></span>
                      Wedding bands
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#D4AF37]"></span>
                      Princess or baguette cuts
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Cathedral Setting */}
            <div className="bg-white border border-[#6D3D0D]/10 p-8 md:p-10">
              <div className="grid md:grid-cols-3 gap-8 items-start">
                <div className="md:col-span-2">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="w-14 h-14 border border-[#D4AF37]/30 flex items-center justify-center flex-shrink-0">
                      <svg className="w-7 h-7 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-serif text-[#6D3D0D] text-2xl mb-2">Cathedral Setting</h3>
                      <p className="text-[#D4AF37] text-sm uppercase tracking-wider mb-4">Elevated Elegance</p>
                      <p className="text-[#6D3D0D]/70 leading-relaxed">
                        Arches of metal rise from the band to support the center stone, similar to the arches of a cathedral. 
                        This elevates the diamond and adds architectural interest to the ring design.
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-[#FAF7F2] p-4 border-l-2 border-green-500">
                      <h4 className="font-medium text-[#6D3D0D] text-sm mb-2">Advantages</h4>
                      <ul className="text-sm text-[#6D3D0D]/60 space-y-1">
                        <li>Adds height and presence</li>
                        <li>Elegant, sophisticated look</li>
                        <li>Good light entry to stone</li>
                        <li>Pairs well with wedding bands</li>
                      </ul>
                    </div>
                    <div className="bg-[#FAF7F2] p-4 border-l-2 border-amber-500">
                      <h4 className="font-medium text-[#6D3D0D] text-sm mb-2">Considerations</h4>
                      <ul className="text-sm text-[#6D3D0D]/60 space-y-1">
                        <li>Higher profile may catch on things</li>
                        <li>More metal used, higher cost</li>
                        <li>Stone more exposed</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#FAF7F2] p-6 border border-[#6D3D0D]/10">
                  <h4 className="font-medium text-[#6D3D0D] text-sm uppercase tracking-wider mb-4">Best For</h4>
                  <ul className="text-sm text-[#6D3D0D]/60 space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#D4AF37]"></span>
                      Statement pieces
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#D4AF37]"></span>
                      Classic, elegant style
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#D4AF37]"></span>
                      Larger center stones
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#D4AF37]"></span>
                      Flush wedding band pairing
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Choosing the Right Setting */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <span className="text-[#6D3D0D]/50 text-xs uppercase tracking-[0.3em] font-light">Guidance</span>
            <h2 className="font-serif text-[#6D3D0D] text-2xl md:text-3xl mt-3" style={{letterSpacing: '-0.02em'}}>
              Choosing the <span className="text-[#D4AF37]">Right Setting</span>
            </h2>
          </div>
          
          <div className="bg-white border border-[#6D3D0D]/10 p-8 md:p-10">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-serif text-[#6D3D0D] text-lg mb-4">Consider Your Lifestyle</h3>
                <ul className="space-y-3 text-sm text-[#6D3D0D]/70">
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-0.5">—</span>
                    <span><strong className="text-[#6D3D0D]">Active lifestyle?</strong> Choose bezel or channel settings for security</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-0.5">—</span>
                    <span><strong className="text-[#6D3D0D]">Work with hands?</strong> Lower profile settings are more practical</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-0.5">—</span>
                    <span><strong className="text-[#6D3D0D]">Office environment?</strong> Prong or halo settings showcase beautifully</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-serif text-[#6D3D0D] text-lg mb-4">Consider Your Style</h3>
                <ul className="space-y-3 text-sm text-[#6D3D0D]/70">
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-0.5">—</span>
                    <span><strong className="text-[#6D3D0D]">Classic &amp; timeless?</strong> Prong or cathedral settings</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-0.5">—</span>
                    <span><strong className="text-[#6D3D0D]">Modern &amp; minimalist?</strong> Bezel or channel settings</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-0.5">—</span>
                    <span><strong className="text-[#6D3D0D]">Glamorous &amp; romantic?</strong> Halo or pave settings</span>
                  </li>
                </ul>
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
              <h3 className="font-medium text-[#6D3D0D] mb-2">Which setting is the most secure?</h3>
              <p className="text-[#6D3D0D]/70 text-sm leading-relaxed">
                Bezel settings offer the highest security as the metal rim completely surrounds the diamond. 
                Channel settings are also very secure. Prong settings require regular maintenance to check for loosening.
              </p>
            </div>
            
            <div className="p-6">
              <h3 className="font-medium text-[#6D3D0D] mb-2">What setting makes a diamond look bigger?</h3>
              <p className="text-[#6D3D0D]/70 text-sm leading-relaxed">
                Halo settings are the best for making a center stone appear larger — the surrounding diamonds create 
                a visual extension. Bezel settings can make diamonds look slightly smaller due to the metal border.
              </p>
            </div>
            
            <div className="p-6">
              <h3 className="font-medium text-[#6D3D0D] mb-2">Is a bezel setting good for an active lifestyle?</h3>
              <p className="text-[#6D3D0D]/70 text-sm leading-relaxed">
                Yes, bezel settings are ideal for active lifestyles. The protective metal rim prevents the diamond 
                from catching on things, and the smooth profile won&apos;t snag on clothing or equipment.
              </p>
            </div>
            
            <div className="p-6">
              <h3 className="font-medium text-[#6D3D0D] mb-2">Can all settings be resized?</h3>
              <p className="text-[#6D3D0D]/70 text-sm leading-relaxed">
                Prong and cathedral settings are the easiest to resize. Pave and channel settings are more difficult 
                because the stones run along the band. Bezel settings fall somewhere in between.
              </p>
            </div>
            
            <div className="p-6">
              <h3 className="font-medium text-[#6D3D0D] mb-2">How often should I check my prong settings?</h3>
              <p className="text-[#6D3D0D]/70 text-sm leading-relaxed">
                We recommend having prong settings professionally inspected every 6-12 months. A jeweller can check 
                for loose or worn prongs and make repairs before any stones are at risk of falling out.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-16 border-t border-[#6D3D0D]/10">
          <span className="text-[#6D3D0D]/50 text-xs uppercase tracking-[0.3em] font-light">Personal Guidance</span>
          <h2 className="font-serif text-[#6D3D0D] text-2xl md:text-3xl mt-3 mb-4" style={{letterSpacing: '-0.02em'}}>
            Ready to Choose Your Setting?
          </h2>
          <p className="text-[#6D3D0D]/60 mb-8 max-w-xl mx-auto">
            Our design experts can help you select the perfect setting for your diamond and lifestyle.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/bespoke" 
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#6D3D0D] text-white font-light tracking-wider uppercase text-sm transition-all duration-300 hover:bg-[#D4AF37]"
            >
              Book Consultation
            </Link>
            <Link 
              href="/education/care" 
              className="inline-flex items-center gap-3 px-8 py-4 border border-[#6D3D0D]/30 text-[#6D3D0D] font-light tracking-wider uppercase text-sm transition-all duration-300 hover:border-[#6D3D0D]"
            >
              Learn About Care
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
