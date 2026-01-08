"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";

export function EditorialTeasers() {
  const firstRef = useRef<HTMLDivElement>(null);
  const secondRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate in on mount
    if (firstRef.current) {
      setTimeout(() => {
        firstRef.current?.setAttribute('style', 'opacity:1;transform:translateY(0);');
      }, 100);
    }
    if (secondRef.current) {
      setTimeout(() => {
        secondRef.current?.setAttribute('style', 'opacity:1;transform:translateY(0);');
      }, 250);
    }
  }, []);

  return (
    <section className="bg-[#FAF7F2] relative overflow-hidden">
      {/* Ready to Wear - Text Left, Image Right */}
      <div 
        ref={firstRef}
        className="relative opacity-0 translate-y-8 transition-all duration-700 ease-out"
        style={{ transitionDelay: '100ms' }}
      >
        <div className="max-w-[1900px] mx-auto px-0">
          <div className="relative grid lg:grid-cols-12 items-center gap-6 lg:gap-10">
            <div className="relative z-20 px-6 md:px-12 lg:px-16 py-16 lg:py-24 lg:col-span-5">
              <div className="relative max-w-2xl">
                <h2 className="font-serif text-[#6D3D0D] uppercase tracking-[0.14em] leading-[1.1] mb-8" style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3rem)' }}>
                  <span className="relative inline-block pr-1">
                    <span className="relative z-10">Ready</span>
                    <span aria-hidden="true" className="absolute left-0 bottom-[0.12em] h-[0.35em] w-full bg-elysium-gold/15 rounded"></span>
                  </span>
                  <span className="relative inline-block ml-2">
                    <span className="relative z-10">to Wear</span>
                    <span aria-hidden="true" className="absolute left-0 -bottom-1 h-[2px] w-full bg-gradient-to-r from-elysium-gold via-elysium-gold/60 to-transparent"></span>
                  </span>
                </h2>
                <p className="text-[#6D3D0D]/75 font-light leading-[1.8] mb-8" style={{ fontSize: 'clamp(1rem, 1.7vw, 1.15rem)' }}>
                  Discover our ready-to-wear designs, crafted with exceptional artistry and timeless elegance.
                </p>
                <Link 
                  href="/shop"
                  className="inline-flex items-center gap-4 px-12 py-5 bg-[#6D3D0D] text-white font-light tracking-[0.2em] uppercase text-sm transition-all duration-500 hover:bg-[#D4AF37] hover:gap-6 hover:shadow-2xl group relative overflow-hidden"
                >
                  <span className="relative z-10">Explore Collection</span>
                  <svg className="w-5 h-5 relative z-10 transition-transform duration-500 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </Link>
              </div>
            </div>
            <div className="relative h-[560px] md:h-[620px] lg:h-[680px] lg:col-span-7">
              <Link href="/shop" className="group block relative h-full overflow-hidden">
                <Image
                  src="/images/NewCollection.png"
                  alt="Ready to wear collection of elegant diamond engagement rings"
                  fill
                  className="object-cover object-center transition-all duration-700 ease-out group-hover:scale-[1.03]"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  quality={75}
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-br from-elysium-gold/0 to-[#6D3D0D]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" aria-hidden="true"></div>
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-elysium-gold via-elysium-gold/60 to-transparent transform origin-left transition-all duration-700 group-hover:scale-x-110" aria-hidden="true"></div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bespoke Design - Image Left, Text Right */}
      <div 
        ref={secondRef}
        className="relative opacity-0 translate-y-8 transition-all duration-700 ease-out"
        style={{ transitionDelay: '250ms' }}
      >
        <div className="max-w-[1900px] mx-auto px-0">
          <div className="relative grid lg:grid-cols-12 items-center gap-6 lg:gap-10">
            <div className="relative h-[560px] md:h-[620px] lg:h-[680px] order-2 lg:order-1 lg:col-span-7">
              <Link href="/bespoke" className="group block relative h-full overflow-hidden">
                <Image
                  src="/images/BespokeDesign.png"
                  alt="Master craftsman handcrafting a ring in our London atelier"
                  fill
                  className="object-cover object-center transition-all duration-700 ease-out group-hover:scale-[1.03]"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  quality={75}
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-br from-elysium-gold/0 to-[#6D3D0D]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" aria-hidden="true"></div>
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-elysium-gold via-elysium-gold/60 to-transparent transform origin-left transition-all duration-700 group-hover:scale-x-110" aria-hidden="true"></div>
              </Link>
            </div>
            <div className="relative z-20 px-6 md:px-12 lg:px-12 xl:px-14 py-16 lg:py-24 order-1 lg:order-2 lg:col-span-5">
              <div className="relative">
                <h2 className="font-serif text-[#6D3D0D] uppercase tracking-[0.14em] leading-[1.1] mb-8" style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3rem)' }}>
                  <span className="relative inline-block pr-1">
                    <span className="relative z-10">Bespoke</span>
                    <span aria-hidden="true" className="absolute left-0 bottom-[0.12em] h-[0.35em] w-full bg-beige/60 rounded"></span>
                  </span>
                  <span className="relative inline-block ml-2">
                    <span className="relative z-10">Design</span>
                    <span aria-hidden="true" className="absolute left-0 -bottom-1 h-[2px] w-full bg-gradient-to-r from-elysium-gold via-elysium-gold/60 to-transparent"></span>
                  </span>
                </h2>
                <p className="text-[#6D3D0D]/75 font-light leading-[1.8] mb-8" style={{ fontSize: 'clamp(1rem, 1.7vw, 1.15rem)' }}>
                  Create a unique piece that reflects your vision with our bespoke design service.
                </p>
                <Link 
                  href="/bespoke"
                  className="inline-flex items-center gap-4 px-12 py-5 bg-[#6D3D0D] text-white font-light tracking-[0.2em] uppercase text-sm transition-all duration-500 hover:bg-[#D4AF37] hover:gap-6 hover:shadow-2xl group relative overflow-hidden"
                >
                  <span className="relative z-10">Start Creating</span>
                  <svg className="w-5 h-5 relative z-10 transition-transform duration-500 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
