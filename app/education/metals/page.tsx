import Link from "next/link";

export const metadata = {
  title: "Gold & Platinum Guide — ELYSIUM Fine Jewellery",
  description: "Master precious metals: gold purity, platinum properties, and care requirements. Expert guide to metal selection.",
};

export default function MetalsEducationPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 py-16">
      {/* Navigation */}
      <nav className="mb-8">
        <Link 
          href="/education" 
          className="text-gold hover:text-gold/80 font-medium link-underline"
        >
          ← Back to Education Hub
        </Link>
      </nav>

      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="font-serif uppercase tracking-[0.12em] text-4xl md:text-5xl text-charcoal mb-6">
          Gold & Platinum Guide
        </h1>
        <p className="font-sans text-xl text-charcoal/70 leading-relaxed">
          As a luxury house, Elysium works exclusively with <strong>18k gold</strong> and <strong>platinum</strong>.
          These are the world's most prestigious standards — chosen for their colour, durability, and timeless beauty.
        </p>
      </div>

      {/* Key Facts Section */}
      <section className="mb-16">
        <div className="card p-8">
          <h2 className="font-serif text-2xl uppercase tracking-[0.08em] text-charcoal mb-6 text-center">
            Our Metal Standards
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-3 h-3 bg-gold rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-charcoal mb-1">Standard</h3>
                  <p className="font-sans text-sm text-charcoal/70">We work exclusively with 18k gold and platinum — no 9k/14k</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-3 h-3 bg-gold rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-charcoal mb-1">18k Gold</h3>
                  <p className="font-sans text-sm text-charcoal/70">~75% pure gold; rich colour with excellent durability</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-3 h-3 bg-gold rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-charcoal mb-1">Platinum</h3>
                  <p className="font-sans text-sm text-charcoal/70">Naturally white, dense, hypoallergenic (typically 950)</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-3 h-3 bg-gold rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-charcoal mb-1">UK Hallmarks</h3>
                  <p className="font-sans text-sm text-charcoal/70">Assay Office marks guarantee fineness (750 for 18k, 950 for platinum)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metal Palette Section */}
      <section className="mb-16">
        <div className="card p-8">
          <h2 className="font-serif text-2xl uppercase tracking-[0.08em] text-charcoal mb-6 text-center">
            Our Metal Palette
          </h2>
          <p className="text-center text-charcoal/70 mb-6">Representative colour swatches (approximate):</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full mx-auto border border-gray-200" style={{ background:"#FFD700" }}></div>
              <p className="mt-3 font-sans text-sm text-charcoal">18k Yellow Gold</p>
              <p className="text-xs text-charcoal/60">#FFD700</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full mx-auto border border-gray-200" style={{ background:"#B76E79" }}></div>
              <p className="mt-3 font-sans text-sm text-charcoal">18k Rose Gold</p>
              <p className="text-xs text-charcoal/60">#B76E79</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full mx-auto border border-gray-200" style={{ background:"#FAF9F6" }}></div>
              <p className="mt-3 font-sans text-sm text-charcoal">18k White Gold</p>
              <p className="text-xs text-charcoal/60">#FAF9F6</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full mx-auto border border-gray-200" style={{ background:"#E5E4E2" }}></div>
              <p className="mt-3 font-sans text-sm text-charcoal">Platinum</p>
              <p className="text-xs text-charcoal/60">#E5E4E2</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gold Section */}
      <section className="mb-16">
        <h2 className="font-serif text-3xl uppercase tracking-[0.08em] text-charcoal mb-8 text-center">
          Understanding Gold
        </h2>
        
        <div className="card p-8 mb-8">
          <div className="flex items-start gap-6 mb-6">
            <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xl">🥇</span>
            </div>
            <div>
              <h3 className="font-serif text-2xl uppercase tracking-[0.06em] text-charcoal mb-4">
                Gold Properties
              </h3>
              <p className="font-sans text-charcoal/80 leading-relaxed">
                Pure 24k gold is soft and intensely coloured. <strong>18k</strong> (~75% gold) balances richness and durability.
                White gold's bright surface is achieved with pale alloys plus rhodium finishing; yellow and rose gold are created by balancing copper and silver content.
              </p>
            </div>
          </div>
          
          <div className="bg-beige/30 p-6 rounded-lg">
            <h4 className="font-semibold text-charcoal mb-4">Karat System & Purity:</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-charcoal mb-2">24K Gold</h5>
                <p className="font-sans text-sm text-charcoal/70 mb-3">99.9% pure gold - too soft for jewellery</p>
                <h5 className="font-medium text-charcoal mb-2">22K Gold</h5>
                <p className="font-sans text-sm text-charcoal/70 mb-3">91.7% pure gold - used in some traditional pieces</p>
                <h5 className="font-medium text-charcoal mb-2">18K Gold</h5>
                <p className="font-sans text-sm text-charcoal/70 mb-3">75% pure gold - premium jewellery standard</p>
              </div>
              <div>
                <h5 className="font-medium text-charcoal mb-2">14K Gold</h5>
                <p className="font-sans text-sm text-charcoal/70 mb-3">58.3% pure gold - most popular for durability</p>
                <h5 className="font-medium text-charcoal mb-2">10K Gold</h5>
                <p className="font-sans text-sm text-charcoal/70 mb-3">41.7% pure gold - budget-friendly option</p>
                <h5 className="font-medium text-charcoal mb-2">9K Gold</h5>
                <p className="font-sans text-sm text-charcoal/70 mb-3">37.5% pure gold - UK standard minimum</p>
              </div>
            </div>
          </div>
        </div>

        {/* Gold Colors */}
        <div className="card p-8">
          <h3 className="font-serif text-2xl uppercase tracking-[0.06em] text-charcoal mb-6 text-center">
            Gold Colors
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gold rounded-full mx-auto mb-3"></div>
              <h4 className="font-semibold text-charcoal mb-2">Yellow Gold</h4>
              <p className="font-sans text-sm text-charcoal/70">Classic, warm appearance. Alloyed with copper and silver.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-beige rounded-full mx-auto mb-3"></div>
              <h4 className="font-semibold text-charcoal mb-2">White Gold</h4>
              <p className="font-sans text-sm text-charcoal/70">Modern, silvery appearance. Rhodium plated for shine.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gold/60 rounded-full mx-auto mb-3"></div>
              <h4 className="font-semibold text-charcoal mb-2">Rose Gold</h4>
              <p className="font-sans text-sm text-charcoal/70">Romantic, pinkish hue. Higher copper content.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Platinum Section */}
      <section className="mb-16">
        <h2 className="font-serif text-3xl uppercase tracking-[0.08em] text-charcoal mb-8 text-center">
          Understanding Platinum
        </h2>
        
        <div className="card p-8">
          <div className="flex items-start gap-6 mb-6">
            <div className="w-12 h-12 bg-beige/40 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xl">⚪</span>
            </div>
            <div>
              <h3 className="font-serif text-2xl uppercase tracking-[0.06em] text-charcoal mb-4">
                Platinum Properties
              </h3>
              <p className="font-sans text-charcoal/80 leading-relaxed">
                <strong>Platinum</strong> (usually 950) is naturally white, dense, and hypoallergenic; prongs hold stones securely and develop a soft patina with wear.
                <strong>18k Gold</strong> is lighter and offered in white/yellow/rose tones; white gold may need periodic rhodium re-plating to maintain brightness.
              </p>
            </div>
          </div>
          
          <div className="bg-beige/30 p-6 rounded-lg">
            <h4 className="font-semibold text-charcoal mb-4">Platinum Purity Standards:</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-charcoal mb-2">950 Platinum</h5>
                <p className="font-sans text-sm text-charcoal/70 mb-3">95% pure platinum - most common standard</p>
                <h5 className="font-medium text-charcoal mb-2">900 Platinum</h5>
                <p className="font-sans text-sm text-charcoal/70 mb-3">90% pure platinum - European standard</p>
              </div>
              <div>
                <h5 className="font-medium text-charcoal mb-2">850 Platinum</h5>
                <p className="font-sans text-sm text-charcoal/70 mb-3">85% pure platinum - vintage pieces</p>
                <h5 className="font-medium text-charcoal mb-2">800 Platinum</h5>
                <p className="font-sans text-sm text-charcoal/70 mb-3">80% pure platinum - rare, older pieces</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* UK Hallmarks Section */}
      <section className="mb-16">
        <h2 className="font-serif text-3xl uppercase tracking-[0.08em] text-charcoal mb-8 text-center">
          UK Hallmarks
        </h2>
        
        <div className="card p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-beige/40 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🏛️</span>
            </div>
            <p className="font-sans text-charcoal/80 leading-relaxed mb-6">
              UK hallmarking confirms metal fineness: <strong>750</strong> (18k) and <strong>950</strong> (platinum), alongside the Assay Office and maker's marks.
            </p>
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="text-center p-4 bg-beige/20 rounded-lg">
                <h4 className="font-semibold text-charcoal mb-2">18k Gold</h4>
                <p className="font-sans text-sm text-charcoal/70">Fineness 750</p>
              </div>
              <div className="text-center p-4 bg-beige/20 rounded-lg">
                <h4 className="font-semibold text-charcoal mb-2">Platinum</h4>
                <p className="font-sans text-sm text-charcoal/70">Fineness 950</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Care & Maintenance */}
      <section className="mb-16">
        <h2 className="font-serif text-3xl uppercase tracking-[0.08em] text-charcoal mb-8 text-center">
          Care & Maintenance
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="card p-6">
            <h3 className="font-serif text-xl uppercase tracking-[0.06em] text-charcoal mb-4">
              Daily Care
            </h3>
            <ul className="space-y-2 font-sans text-sm text-charcoal/80">
              <li>• Remove jewellery before swimming or exercising</li>
              <li>• Avoid contact with chemicals and perfumes</li>
              <li>• Clean gently with warm soapy water</li>
              <li>• Store in soft cloth or jewellery box</li>
              <li>• Regular professional cleaning (annually)</li>
            </ul>
          </div>
          
          <div className="card p-6">
            <h3 className="font-serif text-xl uppercase tracking-[0.06em] text-charcoal mb-4">
              Professional Services
            </h3>
            <ul className="space-y-2 font-sans text-sm text-charcoal/80">
              <li>• Deep cleaning and polishing</li>
              <li>• Rhodium re-plating (white gold)</li>
              <li>• Stone tightening and inspection</li>
              <li>• Sizing and adjustments</li>
              <li>• Appraisal and certification</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="mb-16">
        <h2 className="font-serif text-3xl uppercase tracking-[0.08em] text-charcoal mb-8 text-center">
          Frequently Asked Questions
        </h2>
        
        <div className="card p-8 divide-y divide-neutral-200">
          <div className="py-4">
            <h3 className="font-serif uppercase tracking-wide text-lg text-charcoal mb-3">Why only 18k and platinum?</h3>
            <p className="font-sans text-charcoal/80 leading-relaxed">
              They are luxury standards that deliver the best balance of beauty, longevity, and value for fine jewellery.
            </p>
          </div>
          
          <div className="py-4">
            <h3 className="font-serif uppercase tracking-wide text-lg text-charcoal mb-3">Is platinum better than white gold?</h3>
            <p className="font-sans text-charcoal/80 leading-relaxed">
              Platinum is heavier, naturally white and great for prongs; white gold is lighter and often more affordable. The choice is aesthetic and practical.
            </p>
          </div>
          
          <div className="py-4">
            <h3 className="font-serif uppercase tracking-wide text-lg text-charcoal mb-3">Does white gold turn yellow?</h3>
            <p className="font-sans text-charcoal/80 leading-relaxed">
              The rhodium finish can fade with wear; a quick re-plating restores brightness.
            </p>
          </div>
          
          <div className="py-4">
            <h3 className="font-serif uppercase tracking-wide text-lg text-charcoal mb-3">What hallmark indicates 18k gold?</h3>
            <p className="font-sans text-charcoal/80 leading-relaxed">
              Look for fineness <strong>750</strong> with an Assay Office and maker's mark.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <h3 className="font-serif text-2xl uppercase tracking-[0.08em] text-charcoal mb-6">
          Ready to Choose Your Metal?
        </h3>
        <p className="font-sans text-charcoal/70 mb-8">
          Consult with our metal experts to discuss your preferences, lifestyle, and budget. 
          We'll help you select the perfect metal for your piece.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/bespoke" className="luxury-button">
            Book Consultation
          </Link>
          <Link href="/education/diamonds" className="luxury-button secondary">
            Learn About Diamonds
          </Link>
        </div>
      </section>
    </main>
  );
}
