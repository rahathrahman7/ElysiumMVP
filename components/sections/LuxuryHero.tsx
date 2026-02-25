"use client";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function LuxuryHero() {
  const [ready, setReady] = useState(false);
  const reduced = useReducedMotion();

  /* ─── Parallax refs (3 layers: bg, left hand, right hand) ─── */
  const sectionRef = useRef<HTMLElement>(null);
  const bgLayerRef = useRef<HTMLDivElement>(null);
  const leftHandRef = useRef<HTMLDivElement>(null);
  const rightHandRef = useRef<HTMLDivElement>(null);
  const textTopRef = useRef<HTMLDivElement>(null);
  const textBottomRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  /* Track mouse in refs to avoid re-renders */
  const bgMouse = useRef({ mx: 0, my: 0 });
  const handMouse = useRef({ mx: 0, my: 0 });

  const applyMouseTransforms = useCallback(() => {
    const bg = bgMouse.current;
    const h = handMouse.current;
    if (bgLayerRef.current) {
      bgLayerRef.current.style.transform = `translate3d(${bg.mx}px, ${bg.my}px, 0)`;
    }
    if (leftHandRef.current) {
      leftHandRef.current.style.transform = `translate3d(${h.mx}px, ${h.my}px, 0)`;
    }
    if (rightHandRef.current) {
      rightHandRef.current.style.transform = `translate3d(${h.mx}px, ${h.my}px, 0)`;
    }
  }, []);

  /* ─── Mouse parallax ─── */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (reduced) return;
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;

      bgMouse.current.mx = nx * -8;
      bgMouse.current.my = ny * -8;
      handMouse.current.mx = nx * -30;
      handMouse.current.my = ny * -30;
      applyMouseTransforms();
    },
    [reduced, applyMouseTransforms]
  );

  const handleMouseLeave = useCallback(() => {
    bgMouse.current.mx = 0;
    bgMouse.current.my = 0;
    handMouse.current.mx = 0;
    handMouse.current.my = 0;
    applyMouseTransforms();
  }, [applyMouseTransforms]);

  /* ─── Scroll parallax + exit depth (GSAP ScrollTrigger) ─── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.3,
        } as ScrollTrigger.Vars,
      });

      // Background layer sinks slowly
      if (bgLayerRef.current) {
        tl.to(bgLayerRef.current, { y: 80, ease: "none", duration: 1 }, 0);
      }

      // Hands sink further + scale slightly
      if (leftHandRef.current) {
        tl.to(leftHandRef.current, { y: 120, scale: 1.04, ease: "none", duration: 1 }, 0);
      }
      if (rightHandRef.current) {
        tl.to(rightHandRef.current, { y: 120, scale: 1.04, ease: "none", duration: 1 }, 0);
      }

      // Top text rises and fades (faster than scroll)
      if (textTopRef.current) {
        tl.to(textTopRef.current, { y: -100, opacity: 0, ease: "none", duration: 1 }, 0);
      }

      // Bottom text rises and fades
      if (textBottomRef.current) {
        tl.to(textBottomRef.current, { y: -60, opacity: 0, ease: "none", duration: 1 }, 0);
      }

      // Gradient overlay darkens
      if (overlayRef.current) {
        tl.to(overlayRef.current, { opacity: 0.7, ease: "none", duration: 1 }, 0);
      }
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  /* ─── Ready fade-in ─── */
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  /* ─── Layer styles ─── */
  const layerTransition = "transform 600ms cubic-bezier(0.2, 0, 0.2, 1)";
  const introEase = "cubic-bezier(0.16, 1, 0.3, 1)";
  const layerStyle = { transition: layerTransition };

  // Left hand: slides in from the left
  const leftHandStyle: React.CSSProperties = ready
    ? { transition: layerTransition }
    : { transition: `transform 5.5s ${introEase}, opacity 4s ease-out`, transform: "translate3d(-60px, 0, 0)", opacity: 0 };

  // Right hand: slides in from the right
  const rightHandStyle: React.CSSProperties = ready
    ? { transition: layerTransition }
    : { transition: `transform 5.5s ${introEase}, opacity 4s ease-out`, transform: "translate3d(60px, 0, 0)", opacity: 0 };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden min-h-screen flex flex-col items-center justify-between pt-20 md:pt-32 pb-6 md:pb-8"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute inset-0">
        {/* Mobile Image — single combined, no parallax */}
        <Image
          src="/images/herov3mobile.png"
          alt="ELYSIUM Luxury Collection"
          fill
          priority
          sizes="100vw"
          quality={75}
          className="object-cover object-center md:hidden scale-105 transition-transform duration-[8s] ease-out"
        />

        {/* Desktop: three-layer parallax depth */}
        <div className="hidden md:block absolute inset-0">
          {/* Back layer — silk background */}
          <div
            ref={bgLayerRef}
            className="absolute inset-[-12px] will-change-transform"
            style={layerStyle}
          >
            <Image
              src="/images/backgrounddepth.png"
              alt=""
              fill
              priority
              sizes="100vw"
              quality={100}
              unoptimized
              className="object-cover object-center"
            />
          </div>

          {/* Left hand — slides in from left */}
          <div
            ref={leftHandRef}
            className="absolute inset-[-30px] will-change-transform"
            style={leftHandStyle}
          >
            <Image
              src="/images/hand-left.png"
              alt=""
              fill
              priority
              sizes="100vw"
              quality={100}
              unoptimized
              className="object-cover object-center"
            />
          </div>

          {/* Right hand — slides in from right */}
          <div
            ref={rightHandRef}
            className="absolute inset-[-30px] will-change-transform"
            style={rightHandStyle}
          >
            <Image
              src="/images/hand-right.png"
              alt="ELYSIUM Luxury Collection"
              fill
              priority
              sizes="100vw"
              quality={100}
              unoptimized
              className="object-cover object-center"
            />
          </div>
        </div>

        {/* Gradient Overlay (animated on scroll) */}
        <div ref={overlayRef} className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-elysium-gold/5 via-transparent to-elysium-gold/5" />
      </div>

      <div ref={textTopRef} className="relative z-20 max-w-7xl mx-auto px-6 text-center w-full pt-[10vh] md:pt-32 will-change-transform">
        <div className={`mb-6 md:mb-8 transition-all duration-1000 ease-out ${
          ready ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
        }`}>
          <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white tracking-[0.15em] drop-shadow-2xl leading-tight">
            ELYSIUM
          </h1>
          <p className="font-light text-white/80 text-lg md:text-lg lg:text-xl tracking-[0.3em] mt-3 md:mt-4">
            LONDON
          </p>
        </div>

        <div className={`mb-8 md:mb-0 transition-all duration-1000 delay-300 ease-out ${
          ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          <div className="flex flex-row items-center justify-center gap-3 md:gap-4">
            <Link
              href="/shop"
              className="group px-6 md:px-10 py-3 md:py-4 text-white text-opacity-95 font-semibold tracking-[0.2em] uppercase text-xs md:text-sm transition-all duration-300 hover:text-white whitespace-nowrap"
            >
              <span className="relative z-10 drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
                Explore Collection
              </span>
            </Link>
            <Link
              href="/bespoke"
              className="group px-6 md:px-10 py-3 md:py-4 text-white font-semibold tracking-[0.2em] uppercase text-xs md:text-sm transition-all duration-300 flex items-center gap-2 whitespace-nowrap"
            >
              <span className="drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">Bespoke Design</span>
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex-1 w-full min-h-[120px] md:min-h-[180px] flex items-center justify-center"></div>

      <div ref={textBottomRef} className="relative z-20 max-w-7xl mx-auto px-6 text-center w-full will-change-transform">
        <div className={`md:hidden mb-6 transition-all duration-1000 delay-500 ease-out ${
          ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          <div className="flex items-center justify-center space-x-4 sm:space-x-6 text-white/70 text-xs font-light tracking-wide">
            <span>Ethically Sourced</span>
            <span className="w-px h-4 bg-white/30"></span>
            <span>Lifetime Service</span>
            <span className="w-px h-4 bg-white/30"></span>
            <span>Handcrafted in London</span>
          </div>
        </div>

        <div className={`hidden md:block mb-8 transition-all duration-1000 delay-500 ease-out ${
          ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          <div className="flex items-center justify-center space-x-8 text-white/70 text-sm font-light tracking-wide">
            <span>Ethically Sourced</span>
            <span className="w-px h-4 bg-white/30"></span>
            <span>Lifetime Service</span>
            <span className="w-px h-4 bg-white/30"></span>
            <span>Handcrafted in London</span>
          </div>
        </div>

        <div className={`pt-8 md:pt-0 transition-all duration-1000 delay-600 ease-out ${
          ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-light text-white tracking-[0.02em] leading-[0.9] mb-4 md:mb-6">
            <span className="block">Modern Luxury</span>
            <span className="block font-normal text-[var(--color-gold,#D4AF37)]">Redefined</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 font-light tracking-wide max-w-2xl mx-auto leading-relaxed px-4">
            Where timeless craftsmanship meets contemporary innovation
          </p>
        </div>

        <button
          aria-label="Explore more"
          onClick={() => document.getElementById('featured-collection')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          className={`mt-6 md:mt-8 mx-auto group transition-all duration-1000 delay-700 ${
            ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="flex flex-col items-center space-y-2 text-white/80 hover:text-white transition-colors">
            <span className="text-xs tracking-[0.2em] uppercase font-light">Discover</span>
            <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center group-hover:border-white transition-colors">
              <div className="w-1 h-3 bg-white/80 rounded-full mt-2 animate-bounce group-hover:bg-white transition-colors"></div>
            </div>
          </div>
        </button>
      </div>

      {/* Premium Ambient Lighting Effect */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-elysium-gold/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-elysium-gold/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
    </section>
  );
}
