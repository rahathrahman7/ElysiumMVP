"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LuxuryHero() {
  const [ready, setReady] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const heroSlides = [
    {
      image: "/images/herov3.png",
      title: "Modern Luxury",
      subtitle: "Redefined",
      description: "Where timeless craftsmanship meets contemporary innovation",
    },
    // Add more slides as needed
  ];

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Auto-slide for luxury feel
  useEffect(() => {
    if (heroSlides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [heroSlides.length]);

  const currentHero = heroSlides[currentSlide];

  return (
    <section className="relative overflow-hidden min-h-screen flex items-start justify-center pt-32 md:pt-40">
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0">
        <Image
          src={currentHero.image}
          alt="ELYSIUM Luxury Collection"
          fill
          priority
          sizes="100vw"
          quality={100}
          className="object-cover md:object-center object-[center_55%] scale-105 transition-transform duration-[8s] ease-out hover:scale-110"
        />
        
        {/* Luxury Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-elysium-gold/5 via-transparent to-elysium-gold/5" />
      </div>

      {/* Premium Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 text-center">
        {/* Luxury Logo Animation */}
        <div
          className={`mb-8 transition-all duration-1000 ease-out ${
            ready ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
          }`}
        >
          <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl font-bold text-white tracking-[0.15em] drop-shadow-2xl hover:drop-shadow-[0_0_40px_rgba(212,175,55,0.3)] transition-all duration-500 hover:scale-105">
            ELYSIUM
          </h1>
          <p className="font-light text-white/80 text-lg md:text-xl tracking-[0.3em] mt-4">
            LONDON
          </p>
        </div>

        {/* Premium CTA Section */}
        <div
          className={`space-y-6 mb-12 transition-all duration-1000 delay-300 ease-out ${
            ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Primary CTA */}
            <Link
              href="/shop"
              className="group px-10 py-4 text-white text-opacity-95 font-semibold tracking-[0.2em] uppercase text-sm transition-all duration-300 hover:text-white"
            >
              <span className="relative z-10 drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
                Explore Collection
              </span>
            </Link>

            {/* Secondary CTA */}
            <Link
              href="/bespoke"
              className="group px-10 py-4 text-[var(--color-gold,#D4AF37)] font-semibold tracking-[0.2em] uppercase text-sm transition-all duration-300 flex items-center gap-2"
            >
              <span className="drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">Bespoke Design</span>
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center space-x-8 text-white/70 text-sm font-light tracking-wide">
            <span>Ethically Sourced</span>
            <span className="w-px h-4 bg-white/30" />
            <span>Lifetime Service</span>
            <span className="w-px h-4 bg-white/30" />
            <span>Handcrafted in London</span>
          </div>
        </div>

      </div>

      {/* Hero Typography - Larger and Higher */}
      <div
        className={`absolute bottom-24 left-1/2 -translate-x-1/2 text-center transition-all duration-1000 delay-600 ease-out ${
          ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-light text-white tracking-[0.02em] leading-[0.9] mb-6">
          <span className="block">{currentHero.title}</span>
          <span className="block font-normal text-[var(--color-gold,#D4AF37)]">{currentHero.subtitle}</span>
        </h2>
        
        <p className="text-lg md:text-xl text-white/90 font-light tracking-wide max-w-2xl mx-auto leading-relaxed">
          {currentHero.description}
        </p>
      </div>

      {/* Scroll Indicator - Premium Style */}
      <button
        aria-label="Explore more"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 group transition-all duration-1000 delay-700 ${
          ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="flex flex-col items-center space-y-2 text-white/80 hover:text-white transition-colors">
          <span className="text-xs tracking-[0.2em] uppercase font-light">Discover</span>
          <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center group-hover:border-white transition-colors">
            <div className="w-1 h-3 bg-white/80 rounded-full mt-2 animate-bounce group-hover:bg-white transition-colors" />
          </div>
        </div>
      </button>

      {/* Slide Indicators */}
      {heroSlides.length > 1 && (
        <div className="absolute bottom-8 right-8 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-elysium-gold scale-125' 
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Premium Ambient Lighting Effect */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-elysium-gold/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-elysium-gold/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
    </section>
  );
}
