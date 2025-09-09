import Link from "next/link";

export const metadata = {
  title: "Diamond Education — ELYSIUM Fine Jewellery",
  description: "Master the 4Cs of diamonds: Cut, Color, Clarity, and Carat Weight. Expert guide to diamond selection and quality.",
};

export default function DiamondEducationPage() {
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
          Diamond Education
        </h1>
        <p className="font-sans text-xl text-charcoal/70 leading-relaxed">
          Understanding the 4Cs is essential for making an informed diamond purchase. 
          Learn how each factor affects beauty, value, and investment potential.
        </p>
      </div>

      {/* The 4Cs Section */}
      <section className="mb-16">
        <h2 className="font-serif text-3xl uppercase tracking-[0.08em] text-charcoal mb-8 text-center">
          The 4Cs of Diamond Quality
        </h2>
        
        <div className="space-y-12">
          {/* Cut */}
          <div className="card p-8">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl">✨</span>
              </div>
              <div>
                <h3 className="font-serif text-2xl uppercase tracking-[0.06em] text-charcoal mb-4">
                  Cut
                </h3>
                <p className="font-sans text-charcoal/80 leading-relaxed mb-4">
                  Cut quality determines how well a diamond reflects light and creates brilliance. 
                  It's the most important factor affecting a diamond's beauty and sparkle.
                </p>
                <div className="bg-beige/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-charcoal mb-2">Cut Grades:</h4>
                  <ul className="space-y-1 font-sans text-sm text-charcoal/80">
                    <li><strong>Excellent:</strong> Maximum brilliance and fire</li>
                    <li><strong>Very Good:</strong> High brilliance, excellent value</li>
                    <li><strong>Good:</strong> Good brilliance, budget-friendly</li>
                    <li><strong>Fair:</strong> Reduced brilliance, not recommended</li>
                    <li><strong>Poor:</strong> Minimal brilliance, avoid</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Color */}
          <div className="card p-8">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl">🎨</span>
              </div>
              <div>
                <h3 className="font-serif text-2xl uppercase tracking-[0.06em] text-charcoal mb-4">
                  Color
                </h3>
                <p className="font-sans text-charcoal/80 leading-relaxed mb-4">
                  Diamond color refers to the absence of color. The less color, the higher the grade. 
                  Most diamonds used in jewellery are near-colorless to slightly tinted.
                </p>
                <div className="bg-beige/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-charcoal mb-2">Color Scale (D-Z):</h4>
                  <ul className="space-y-1 font-sans text-sm text-charcoal/80">
                    <li><strong>D-F:</strong> Colorless (highest grade)</li>
                    <li><strong>G-J:</strong> Near colorless (excellent value)</li>
                    <li><strong>K-M:</strong> Faint yellow (budget option)</li>
                    <li><strong>N-Z:</strong> Very light yellow (not recommended)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Clarity */}
          <div className="card p-8">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl">🔍</span>
              </div>
              <div>
                <h3 className="font-serif text-2xl uppercase tracking-[0.06em] text-charcoal mb-4">
                  Clarity
                </h3>
                <p className="font-sans text-charcoal/80 leading-relaxed mb-4">
                  Clarity measures the presence of internal characteristics (inclusions) and surface blemishes. 
                  Most inclusions are microscopic and don't affect beauty to the naked eye.
                </p>
                <div className="bg-beige/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-charcoal mb-2">Clarity Grades:</h4>
                  <ul className="space-y-1 font-sans text-sm text-charcoal/80">
                    <li><strong>FL-IF:</strong> Flawless/Internally Flawless</li>
                    <li><strong>VVS1-VVS2:</strong> Very, Very Slightly Included</li>
                    <li><strong>VS1-VS2:</strong> Very Slightly Included (excellent value)</li>
                    <li><strong>SI1-SI2:</strong> Slightly Included (good value)</li>
                    <li><strong>I1-I3:</strong> Included (not recommended)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Carat Weight */}
          <div className="card p-8">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl">⚖️</span>
              </div>
              <div>
                <h3 className="font-serif text-2xl uppercase tracking-[0.06em] text-charcoal mb-4">
                  Carat Weight
                </h3>
                <p className="font-sans text-charcoal/80 leading-relaxed mb-4">
                  Carat weight measures a diamond's size, not its quality. One carat equals 200 milligrams. 
                  Larger diamonds are rarer and more valuable, but size isn't everything.
                </p>
                <div className="bg-beige/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-charcoal mb-2">Popular Carat Weights:</h4>
                  <ul className="space-y-1 font-sans text-sm text-charcoal/80">
                    <li><strong>0.5 carat:</strong> Classic solitaire size</li>
                    <li><strong>1.0 carat:</strong> Traditional engagement ring</li>
                    <li><strong>1.5 carat:</strong> Statement piece</li>
                    <li><strong>2.0+ carats:</strong> Luxury investment</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Diamond Shapes */}
      <section className="mb-16">
        <h2 className="font-serif text-3xl uppercase tracking-[0.08em] text-charcoal mb-8 text-center">
          Popular Diamond Shapes
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { name: "Round Brilliant", icon: "💎", desc: "Most popular shape with maximum brilliance" },
            { name: "Princess Cut", icon: "🔷", desc: "Square shape with excellent fire and brilliance" },
            { name: "Oval", icon: "🥚", desc: "Elegant and elongating, great for smaller hands" },
            { name: "Emerald Cut", icon: "📐", desc: "Rectangular with step-cut facets, sophisticated" },
            { name: "Marquise", icon: "🚣", desc: "Elongated with pointed ends, dramatic appearance" },
            { name: "Pear", icon: "🍐", desc: "Tear-drop shape, unique and elegant" }
          ].map((shape) => (
            <div key={shape.name} className="card p-6 text-center">
              <div className="text-3xl mb-3">{shape.icon}</div>
              <h3 className="font-serif text-lg uppercase tracking-[0.06em] text-charcoal mb-2">
                {shape.name}
              </h3>
              <p className="font-sans text-sm text-charcoal/70">{shape.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Certification */}
      <section className="mb-16">
        <h2 className="font-serif text-3xl uppercase tracking-[0.08em] text-charcoal mb-8 text-center">
          Diamond Certification
        </h2>
        
        <div className="card p-8">
          <p className="font-sans text-charcoal/80 leading-relaxed mb-6">
            Always purchase diamonds with certification from reputable laboratories. 
            The most trusted certifications come from:
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-beige/40 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🔬</span>
              </div>
              <h4 className="font-semibold text-charcoal mb-2">GIA</h4>
              <p className="font-sans text-sm text-charcoal/70">Gemological Institute of America</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-beige/40 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📋</span>
              </div>
              <h4 className="font-semibold text-charcoal mb-2">IGI</h4>
              <p className="font-sans text-sm text-charcoal/70">International Gemological Institute</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-beige/40 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🏛️</span>
              </div>
              <h4 className="font-semibold text-charcoal mb-2">HRD</h4>
              <p className="font-sans text-sm text-charcoal/70">Hoge Raad voor Diamant</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <h3 className="font-serif text-2xl uppercase tracking-[0.08em] text-charcoal mb-6">
          Ready to Choose Your Diamond?
        </h3>
        <p className="font-sans text-charcoal/70 mb-8">
          Book a consultation with our diamond experts to discuss your preferences 
          and find the perfect stone for your piece.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/bespoke" className="luxury-button">
            Book Consultation
          </Link>
          <Link href="/education/metals" className="luxury-button secondary">
            Learn About Metals
          </Link>
        </div>
      </section>
    </main>
  );
}
