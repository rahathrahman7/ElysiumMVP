"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";

export default function HeroImage() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  // Tiny parallax on scroll (1–2% for luxury subtlety)
  useEffect(() => {
    const el = parallaxRef.current;
    if (!el) return;
    const onScroll = () => {
      const y = Math.min(12, window.scrollY * 0.06); // max 12px
      el.style.transform = `translateY(${y}px)`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative isolate min-h-[78vh] lg:min-h-[86vh] overflow-hidden">
      {/* Background with parallax container */}
      <div ref={parallaxRef} className="absolute inset-0 will-change-transform">
        <Image
          src="/images/herov3.png"
          alt="Ivory silk with golden light sweep"
          fill
          priority
          sizes="100vw"
          quality={100}
          className="object-cover object-center"
          unoptimized={true}
        />
      </div>

      {/* Readability overlays */}
      <div className="pointer-events-none absolute inset-0">
        {/* soft top-to-bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/28 via-transparent to-white/42" />
        {/* vignette via mask for edges */}
        <div className="absolute inset-0 [mask-image:radial-gradient(85%_100%_at_50%_55%,#000_70%,transparent_100%)]" />
      </div>

      {/* Foreground content */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center text-center py-20 sm:py-24 lg:py-32">

          {/* Logo with subtle gold glow + gentle pulse */}
          <div className="relative animate-fade-in" style={{ animationDelay: "0ms" }}>
            {/* glow */}
            <div className="absolute -inset-x-20 -inset-y-12 md:-inset-x-28 md:-inset-y-16 rounded-full opacity-60 blur-2xl
                            bg-[radial-gradient(closest-side,rgba(212,175,55,0.18),transparent_65%)]" />
            <Image
              src="/logo/image.png"
              alt="ELYSIUM London"
              width={600}
              height={180}
              priority
              className="relative drop-shadow-[0_8px_18px_rgba(0,0,0,0.18)] animate-logo-pulse"
            />
          </div>

          {/* Tagline (closer to logo, slightly larger) */}
          <p
            className="mt-4 sm:mt-5 max-w-2xl animate-fade-in"
            style={{ animationDelay: "140ms" }}
          >
            <span className="font-serif text-[15px] sm:text-[16px] leading-7 tracking-[0.006em] text-[#2E2E2E]
                              drop-shadow-[0_1px_0_rgba(255,255,255,0.65)]">
              Bespoke engagement rings in 18k gold &amp; platinum. D–F colour. VS1+ clarity. GIA/IGI certified.
            </span>
          </p>

          {/* CTA container (KEEP inner anchors EXACTLY as they are in your file) */}
          <div className="hero-ctas mt-10 flex justify-center gap-3 animate-fade-in" style={{ animationDelay: "280ms" }}>
            <a
              href="/products"
              className="inline-block px-6 py-3 border-2 border-charcoal text-charcoal uppercase tracking-wide text-sm font-serif font-medium hover:bg-charcoal hover:text-white transition-all duration-300 leading-tight"
            >
              Shop Collection
            </a>
            <a
              href="/bespoke"
              className="inline-block px-6 py-3 border-2 border-gold text-gold uppercase tracking-wide text-sm font-serif font-medium hover:bg-gold hover:text-white transition-all duration-300 leading-tight"
            >
              Book Appointment
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
