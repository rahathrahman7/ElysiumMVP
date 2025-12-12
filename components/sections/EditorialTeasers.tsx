"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";

export function EditorialTeasers() {
  const firstRef = useRef<HTMLAnchorElement>(null);
  const secondRef = useRef<HTMLAnchorElement>(null);

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
    <section className="relative w-full overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 h-[650px] md:h-[750px] lg:h-[800px]">
        {/* New Collection */}
        <Link
          ref={firstRef}
          href="/shop"
          className="group relative overflow-hidden"
          style={{ opacity: 0, transform: 'translateY(30px)', transition: 'opacity 600ms cubic-bezier(0.4, 0, 0.2, 1), transform 600ms cubic-bezier(0.4, 0, 0.2, 1)', transitionDelay: '100ms' }}
        >
          <div className="absolute inset-0">
            <Image
              src="/images/new-collection-rings.png"
              alt="New collection of elegant diamond engagement rings"
              fill
              className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-[800ms] ease-out"
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={75}
              priority
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.65) 100%)' }} />
            <div className="absolute inset-0 opacity-50" style={{ background: 'radial-gradient(ellipse 80% 100% at center, transparent 0%, rgba(0,0,0,0.25) 100%)' }} />
            <div className="absolute inset-0 bg-gradient-to-br from-elysium-gold/8 via-transparent to-transparent" />
          </div>
          
          <div className="relative z-10 h-full flex flex-col justify-between p-12 md:p-20 lg:p-24">
            <div className="text-left">
              <h3 className="font-serif text-white font-light drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]" style={{ fontSize: 'clamp(32px, 4.5vw, 42px)', letterSpacing: '0.06em', lineHeight: '1.15', marginBottom: 0 }}>
                New Collection
              </h3>
            </div>
            <div className="text-left space-y-10 max-w-lg">
              <p className="text-[#EAE6DF] font-light drop-shadow-[0_1px_6px_rgba(0,0,0,0.4)]" style={{ fontSize: 'clamp(17px, 2.2vw, 20px)', lineHeight: '1.6', letterSpacing: '0.015em', fontWeight: 300 }}>
                Discover our latest designs, crafted with exceptional artistry and timeless elegance
              </p>
              <div className="inline-flex items-center gap-3 px-10 py-4 rounded-full border border-white/35 text-white font-light tracking-[0.12em] uppercase text-xs transition-all duration-500 group-hover:bg-white/10 group-hover:border-white/50 group-hover:scale-[1.02] backdrop-blur-[2px]">
                Explore Now
                <svg className="w-3.5 h-3.5 transition-transform duration-500 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>
        </Link>

        {/* Bespoke Design */}
        <Link
          ref={secondRef}
          href="/bespoke"
          className="group relative overflow-hidden"
          style={{ opacity: 0, transform: 'translateY(30px)', transition: 'opacity 600ms cubic-bezier(0.4, 0, 0.2, 1), transform 600ms cubic-bezier(0.4, 0, 0.2, 1)', transitionDelay: '250ms' }}
        >
          <div className="absolute inset-0">
            <Image
              src="/images/craftsman-building-ring.png"
              alt="Master craftsman handcrafting a ring in our London atelier"
              fill
              className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-[800ms] ease-out"
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={75}
              priority
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.65) 100%)' }} />
            <div className="absolute inset-0 opacity-50" style={{ background: 'radial-gradient(ellipse 80% 100% at center, transparent 0%, rgba(0,0,0,0.25) 100%)' }} />
            <div className="absolute inset-0 bg-gradient-to-bl from-elysium-gold/8 via-transparent to-transparent" />
          </div>
          
          <div className="relative z-10 h-full flex flex-col justify-between p-12 md:p-20 lg:p-24">
            <div className="text-left">
              <h3 className="font-serif text-white font-light drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]" style={{ fontSize: 'clamp(32px, 4.5vw, 42px)', letterSpacing: '0.06em', lineHeight: '1.15', marginBottom: 0 }}>
                Bespoke Design
              </h3>
            </div>
            <div className="text-left space-y-10 max-w-lg">
              <p className="text-[#EAE6DF] font-light drop-shadow-[0_1px_6px_rgba(0,0,0,0.4)]" style={{ fontSize: 'clamp(17px, 2.2vw, 20px)', lineHeight: '1.6', letterSpacing: '0.015em', fontWeight: 300 }}>
                Create a unique piece that reflects your vision with our bespoke design service
              </p>
              <div className="inline-flex items-center gap-3 px-10 py-4 rounded-full border border-white/35 text-white font-light tracking-[0.12em] uppercase text-xs transition-all duration-500 group-hover:bg-white/10 group-hover:border-white/50 group-hover:scale-[1.02] backdrop-blur-[2px]">
                Start Creating
                <svg className="w-3.5 h-3.5 transition-transform duration-500 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
