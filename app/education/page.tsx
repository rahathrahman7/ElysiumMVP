import Link from "next/link";

export const metadata = {
  title: "Education Hub — ELYSIUM Fine Jewellery",
  description: "Expert guides on diamonds, gold, and platinum. Master the art of fine jewellery selection.",
};

export default function EducationPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="font-serif uppercase tracking-[0.12em] text-5xl md:text-6xl text-charcoal mb-6">
          Education Hub
        </h1>
        <p className="font-sans text-xl text-charcoal/70 max-w-3xl mx-auto leading-relaxed">
          Master the art of fine jewellery selection with our comprehensive guides. 
          From the brilliance of diamonds to the timeless elegance of precious metals.
        </p>
      </div>

      {/* Guide Cards */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {/* Diamond Education */}
        <div className="card p-8 hover:shadow-lg transition-shadow duration-300">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💎</span>
            </div>
            <h2 className="font-serif text-2xl uppercase tracking-[0.08em] text-charcoal mb-3">
              Diamond Education
            </h2>
            <p className="font-sans text-charcoal/70 leading-relaxed">
              Master the 4Cs, understand cut quality, and learn to identify the perfect diamond for your piece.
            </p>
          </div>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center font-sans text-sm text-charcoal/70">
              <span className="w-2 h-2 bg-gold rounded-full mr-3"></span>
              Cut, Color, Clarity & Carat Weight
            </div>
            <div className="flex items-center font-sans text-sm text-charcoal/70">
              <span className="w-2 h-2 bg-gold rounded-full mr-3"></span>
              Diamond Shapes & Proportions
            </div>
            <div className="flex items-center font-sans text-sm text-charcoal/70">
              <span className="w-2 h-2 bg-gold rounded-full mr-3"></span>
              Certification & Quality Standards
            </div>
          </div>
          
          <Link 
            href="/education/diamonds" 
            className="luxury-button w-full justify-center"
          >
            Explore Diamond Guide
          </Link>
        </div>

        {/* Gold & Platinum */}
        <div className="card p-8 hover:shadow-lg transition-shadow duration-300">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🥇</span>
            </div>
            <h2 className="font-serif text-2xl uppercase tracking-[0.08em] text-charcoal mb-3">
              Gold & Platinum
            </h2>
            <p className="font-sans text-charcoal/70 leading-relaxed">
              Discover the properties, purity standards, and care requirements for precious metals.
            </p>
          </div>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center font-sans text-sm text-charcoal/70">
              <span className="w-2 h-2 bg-gold rounded-full mr-3"></span>
              Gold Purity & Karat Systems
            </div>
            <div className="flex items-center font-sans text-sm text-charcoal/70">
              <span className="w-2 h-2 bg-gold rounded-full mr-3"></span>
              Platinum vs White Gold
            </div>
            <div className="flex items-center font-sans text-sm text-charcoal/70">
              <span className="w-2 h-2 bg-gold rounded-full mr-3"></span>
              Maintenance & Care
            </div>
          </div>
          
          <Link 
            href="/education/metals" 
            className="luxury-button secondary w-full justify-center"
          >
            Explore Metals Guide
          </Link>
        </div>
      </div>

      {/* Additional Resources */}
      <div className="text-center">
        <h3 className="font-serif text-2xl uppercase tracking-[0.08em] text-charcoal mb-6">
          Expert Consultation
        </h3>
        <p className="font-sans text-charcoal/70 mb-8 max-w-2xl mx-auto">
          Ready to apply your knowledge? Book a consultation with our jewellery experts 
          to discuss your specific requirements and find the perfect piece.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/bespoke" className="luxury-button">
            Book Consultation
          </Link>
          <Link href="/shop" className="luxury-button secondary">
            Browse Collection
          </Link>
        </div>
      </div>
    </main>
  );
}
