"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Hero() {
  // fade-in on mount (simple)
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 50); return () => clearTimeout(t); }, []);

  return (
    <section id="site-hero" className="relative overflow-hidden min-h-[70vh] md:min-h-[90vh]">
      {/* Background image */}
      <Image
        src="/images/herov3.png"
        alt="Ivory silk with hands composition"
        fill
        priority
        sizes="100vw"
        quality={100}
        unoptimized={true}
        className="
          object-cover
          [object-position:center_40%]
          md:[object-position:center_50%]
        "
      />



      {/* Logo higher up */}
      <div
        className={[
          "absolute inset-x-0 top-[4vh] z-20 flex justify-center px-4 transition-all duration-1000",
          ready ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
        ].join(" ")}
      >
        <div className="animate-float">
          <Image
            src="/logo/image.png"
            alt="Elysium London"
            width={900}
            height={200}
            className="
              w-[clamp(280px,35vw,600px)]
              drop-shadow-[0_4px_20px_rgba(0,0,0,0.3)]
              hover:drop-shadow-[0_8px_30px_rgba(212,175,55,0.4)]
              transition-all duration-300 hover:scale-105
            "
            priority
          />
        </div>
      </div>

      {/* SHOP COLLECTION at bottom */}
      <div 
        className={[
          "absolute inset-x-0 bottom-[8vh] z-10 flex justify-center px-4 transition-all duration-1000 delay-300",
          ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        ].join(" ")}
      >
        <Link 
          href="/shop"
          className="hero-link inline-block relative group overflow-hidden px-8 py-4 bg-white/10 backdrop-blur border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
        >
          <span className="relative z-10 text-white font-medium tracking-[0.1em] text-sm">SHOP COLLECTION</span>
          <div className="absolute inset-0 bg-gradient-to-r from-gold/20 via-gold/40 to-gold/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
        </Link>
      </div>

      {/* Scroll cue */}
      <button
        aria-label="Scroll"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        className={[
          "group absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] tracking-[0.18em] text-white/80 hover:text-white transition-all duration-1000 delay-500",
          ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        ].join(" ")}
      >
        <span className="block animate-bounce-gentle">SCROLL</span>
        <span className="mx-auto mt-1 block h-3 w-3 rotate-45 border-b border-r border-current transition-transform group-hover:translate-y-[2px] animate-bounce-gentle" style={{ animationDelay: "0.5s" }}></span>
      </button>
    </section>
  );
}