"use client";

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { HallmarkIcon, ReturnsIcon, ServiceIcon } from '@/components/icons/LuxuryIcons';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function TrustStrip() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container || reduced || typeof window === 'undefined') return;
    const items = container.querySelectorAll('.trust-strip-item');
    if (items.length === 0) return;

    let ctx: { revert: () => void } | null = null;
    let mounted = true;

    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (!mounted) return;
        gsap.registerPlugin(ScrollTrigger);
        ctx = gsap.context(() => {
          gsap.fromTo(
            items,
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              ease: 'none',
              stagger: 0.1,
              scrollTrigger: {
                trigger: container,
                start: 'top 85%',
                end: 'top 50%',
                scrub: 1,
              },
            }
          );
        }, container);
      }
    );

    return () => {
      mounted = false;
      ctx?.revert();
    };
  }, [reduced]);

  return (
    <section className="bg-gradient-to-b from-elysium-ivory to-elysium-pearl border-y border-elysium-whisper">
      <div className="container mx-auto px-6 py-16">
        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {/* Hallmarked in London */}
          <div className="trust-strip-item flex flex-col items-center gap-6 group">
            <div className="w-16 h-16 bg-gradient-to-br from-elysium-gold/20 to-elysium-gold/10 backdrop-blur-sm border border-elysium-gold/30 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-elysium-gold/20">
              <HallmarkIcon 
                size={32} 
                className="text-elysium-charcoal group-hover:text-elysium-gold transition-colors duration-300" 
              />
            </div>
            <div>
              <h2 className="font-serif text-xl uppercase tracking-[0.15em] text-elysium-charcoal mb-2 leading-tight">
                Hallmarked in London
              </h2>
              <p className="text-sm text-elysium-smoke leading-relaxed font-light tracking-wide">
                Assay Office certified
              </p>
            </div>
          </div>
          
          {/* Free 30-day Returns */}
          <div className="trust-strip-item flex flex-col items-center gap-6 group">
            <div className="w-16 h-16 bg-gradient-to-br from-elysium-gold/20 to-elysium-gold/10 backdrop-blur-sm border border-elysium-gold/30 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-elysium-gold/20">
              <ReturnsIcon 
                size={32} 
                className="text-elysium-charcoal group-hover:text-elysium-gold transition-colors duration-300" 
              />
            </div>
            <div>
              <h2 className="font-serif text-xl uppercase tracking-[0.15em] text-elysium-charcoal mb-2 leading-tight">
                Free 30-day Returns
              </h2>
              <p className="text-sm text-elysium-smoke leading-relaxed font-light tracking-wide">
                No questions asked
              </p>
            </div>
          </div>
          
          {/* Complimentary Resizing */}
          <Link href="/resizing" className="trust-strip-item flex flex-col items-center gap-6 group transition-transform duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-br from-elysium-gold/20 to-elysium-gold/10 backdrop-blur-sm border border-elysium-gold/30 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-elysium-gold/20">
              <ServiceIcon 
                size={32} 
                className="text-elysium-charcoal group-hover:text-elysium-gold transition-colors duration-300" 
              />
            </div>
            <div>
              <h2 className="font-serif text-xl uppercase tracking-[0.15em] text-elysium-charcoal mb-2 leading-tight">
                Complimentary Resizing
              </h2>
              <p className="text-sm text-elysium-smoke leading-relaxed font-light tracking-wide">
                Lifetime service
              </p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

