"use client";

import { useRef, useEffect } from "react";
import useSWR from "swr";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LuxuryProductCard from "@/components/ui/LuxuryProductCard";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const CARD_WIDTH = 280;
const GAP = 32;

export function HorizontalProductCarousel() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { data, error, isLoading } = useSWR("/api/products?limit=12", fetcher);
  const products = data?.products ?? [];

  useEffect(() => {
    if (reduced || !sectionRef.current || !trackRef.current || products.length === 0) return;

    const section = sectionRef.current;
    const track = trackRef.current;
    const cards = gsap.utils.toArray<HTMLElement>(track.children);

    const totalWidth = products.length * (CARD_WIDTH + GAP) - GAP;
    const scrollDistance = Math.max(totalWidth - (typeof window !== "undefined" ? window.innerWidth : 1200), 0);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: `+=${scrollDistance + 400}`,
        scrub: 1,
        pin: true,
      },
    });

    tl.to(
      track,
      {
        x: -scrollDistance,
        ease: "none",
        duration: 1,
      },
      0
    );

    tl.fromTo(
      cards,
      { opacity: 0, scale: 0.92, x: 60 },
      {
        opacity: 1,
        scale: 1,
        x: 0,
        duration: 0.6,
        stagger: 0.06,
        ease: "power2.out",
      },
      0
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [products.length, reduced]);

  if (reduced) {
    return (
      <section className="py-16 bg-[#FAF7F2]">
        <div className="container mx-auto px-6">
          <h2 className="font-serif text-2xl text-[#6D3D0D] text-center mb-8">Featured Collection</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((p: { _id: string; slug: string }) => (
              <LuxuryProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="h-[100vh] flex items-center justify-center bg-[#FAF7F2]">
        <p className="text-[#6D3D0D]/60 font-light">Loading collection…</p>
      </section>
    );
  }

  if (error || products.length === 0) {
    return (
      <section className="h-[50vh] flex items-center justify-center bg-[#FAF7F2]">
        <p className="text-[#6D3D0D]/60 font-light">Unable to load products.</p>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative min-h-[250vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-[#FAF7F2] flex items-center">
        <div
          ref={trackRef}
          className="flex gap-8 absolute left-0 top-1/2 -translate-y-1/2 pl-[5vw]"
          style={{ willChange: "transform" }}
        >
          {products.map((p: { _id: string; slug: string }) => (
            <div key={p._id} className="w-[280px] flex-shrink-0">
              <LuxuryProductCard product={p} priority={false} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
