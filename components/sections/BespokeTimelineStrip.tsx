"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const steps = [
  {
    n: "01",
    title: "Consultation",
    copy: "Share your story in a complimentary, no-obligation conversation with our design team.",
    duration: "Day 1",
  },
  {
    n: "02",
    title: "CAD Design",
    copy: "Photorealistic 3D renders bring your vision to life — refined until every detail is perfect.",
    duration: "1–2 weeks",
  },
  {
    n: "03",
    title: "Handcrafting",
    copy: "Master artisans shape your one-of-one piece by hand in our London atelier.",
    duration: "6–8 weeks",
  },
  {
    n: "04",
    title: "Delivery",
    copy: "Your finished heirloom, presented in signature packaging — ready to treasure forever.",
    duration: "The reveal",
  },
];

export function BespokeTimelineStrip() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reduced || typeof window === "undefined") return;

    const cards = section.querySelectorAll(".journey-card");
    const line = section.querySelector(".journey-progress");
    if (cards.length === 0) return;

    let ctx: { revert: () => void } | null = null;
    let mounted = true;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (!mounted) return;
        gsap.registerPlugin(ScrollTrigger);
        ctx = gsap.context(() => {
          if (line) {
            gsap.fromTo(
              line,
              { scaleX: 0 },
              {
                scaleX: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: section.querySelector(".journey-rail"),
                  start: "top 78%",
                  end: "top 42%",
                  scrub: 0.8,
                },
              }
            );
          }

          gsap.fromTo(
            cards,
            { opacity: 0, y: 32, scale: 0.97 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.85,
              ease: "power3.out",
              stagger: 0.1,
              scrollTrigger: { trigger: section, start: "top 72%" },
            }
          );
        }, section);
      }
    );

    return () => {
      mounted = false;
      ctx?.revert();
    };
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white"
      aria-labelledby="bespoke-journey-heading"
    >
      {/* Subtle atmospheric background — no brown tint */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_80%_30%,rgba(0,0,0,0.02),transparent_65%)]" />
      </div>

      <div className="relative max-w-[1500px] mx-auto px-5 sm:px-8 md:px-10 py-20 md:py-28 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left — editorial intro */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <p className="text-[10px] text-[#D4AF37] uppercase tracking-[0.5em] font-light mb-5">
              Made For You
            </p>
            <h2
              id="bespoke-journey-heading"
              className="font-serif text-[#6D3D0D] leading-[1.02] tracking-[-0.02em]"
              style={{ fontSize: "clamp(2.25rem, 4.5vw, 3.5rem)" }}
            >
              The Bespoke
              <br />
              <span className="text-[#D4AF37]">Journey</span>
            </h2>
            <p className="text-sm md:text-base text-[#6D3D0D]/60 font-light leading-[1.85] mt-6 max-w-sm">
              Four considered chapters from first conversation to final polish — each
              piece crafted entirely around you.
            </p>

            <div className="hidden lg:flex items-center gap-3 mt-10">
              <span className="w-12 h-px bg-[#D4AF37]/50" />
              <span className="w-2 h-2 rotate-45 border border-[#D4AF37]/60" />
            </div>

            <Link
              href="/bespoke"
              className="group mt-10 lg:mt-12 inline-flex items-center gap-3 px-10 py-4 bg-[#6D3D0D] text-white font-light tracking-[0.16em] uppercase text-xs transition-all duration-500 hover:bg-[#D4AF37] hover:gap-4 hover:shadow-[0_16px_40px_rgba(109,61,13,0.18)]"
            >
              <span>Start Your Journey</span>
              <svg className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Right — horizontal journey rail */}
          <div className="lg:col-span-8">
            <div className="journey-rail relative">
              {/* Progress track */}
              <div
                className="absolute left-0 right-0 hidden md:block h-px bg-[#6D3D0D]/10"
                style={{ top: "1.65rem" }}
                aria-hidden
              >
                <div className="journey-progress h-full w-full origin-left bg-gradient-to-r from-[#D4AF37] via-[#C9A54A] to-[#D4AF37]/40" />
              </div>

              {/* Cards — always horizontal */}
              <ol className="flex flex-row gap-3 sm:gap-4 md:gap-5 overflow-x-auto pb-2 md:pb-0 snap-x snap-mandatory scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {steps.map((step, i) => (
                  <li
                    key={step.n}
                    className="journey-card group relative flex-shrink-0 snap-start"
                    style={{ width: "clamp(9.5rem, 22vw, 13.5rem)" }}
                  >
                    {/* Node */}
                    <div className="relative z-10 mb-5 md:mb-7 flex items-center gap-3">
                      <span className="relative grid place-items-center w-[3.25rem] h-[3.25rem]">
                        <span className="absolute inset-0 rounded-full border border-[#D4AF37]/30 bg-white shadow-[0_4px_20px_rgba(109,61,13,0.08)] transition-all duration-500 group-hover:border-[#D4AF37] group-hover:shadow-[0_8px_28px_rgba(212,175,55,0.2)]" />
                        <span className="font-serif text-[#6D3D0D] text-sm tracking-wide">{step.n}</span>
                      </span>
                      {i < steps.length - 1 && (
                        <span className="md:hidden flex-1 h-px bg-gradient-to-r from-[#D4AF37]/40 to-transparent min-w-[1rem]" aria-hidden />
                      )}
                    </div>

                    {/* Card */}
                    <div className="relative bg-white border border-[#6D3D0D]/8 p-4 sm:p-5 transition-all duration-500 group-hover:border-[#D4AF37]/35 group-hover:shadow-[0_20px_50px_rgba(109,61,13,0.1)] group-hover:-translate-y-1">
                      {/* Gold left accent */}
                      <span
                        className="absolute left-0 top-4 bottom-4 w-[2px] bg-gradient-to-b from-[#D4AF37] to-[#D4AF37]/20 transition-all duration-500 group-hover:top-3 group-hover:bottom-3"
                        aria-hidden
                      />

                      <p className="text-[9px] uppercase tracking-[0.28em] text-[#D4AF37] font-light mb-3 pl-3">
                        {step.duration}
                      </p>
                      <h3 className="font-serif text-[#6D3D0D] text-lg sm:text-xl leading-tight pl-3 mb-3">
                        {step.title}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-[#6D3D0D]/55 font-light leading-relaxed pl-3">
                        {step.copy}
                      </p>

                      {/* Ghost numeral */}
                      <span
                        className="pointer-events-none absolute -right-1 -bottom-2 font-serif text-[4.5rem] leading-none text-[#6D3D0D]/[0.04] select-none transition-colors duration-500 group-hover:text-[#D4AF37]/10"
                        aria-hidden
                      >
                        {step.n}
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Mobile CTA */}
            <div className="lg:hidden text-center mt-10">
              <Link
                href="/bespoke"
                className="group inline-flex items-center gap-3 px-10 py-4 bg-[#6D3D0D] text-white font-light tracking-[0.16em] uppercase text-xs transition-all duration-500 hover:bg-[#D4AF37] hover:gap-4"
              >
                <span>Start Your Journey</span>
                <svg className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
    </section>
  );
}

export default BespokeTimelineStrip;
