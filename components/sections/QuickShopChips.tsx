"use client";

import Link from "next/link";
import { useRef } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function QuickShopChips() {
  const sectionRef = useRef<HTMLElement>(null);

  useScrollReveal({
    trigger: sectionRef,
    start: "top 85%",
    end: "top 55%",
    scrub: 1,
    opacity: [0.7, 1],
    y: [10, 0],
  });
  // Define chips with their filter types
  const categoryChips = [
    { label: "Earrings", href: "/shop?category=earrings" },
    { label: "Bracelets", href: "/shop?category=bracelets" },
  ];

  const styleChips = [
    { label: "Solitaire", filter: "solitaire" },
    { label: "Hidden Halo", filter: "hidden-halo" },
    { label: "Trilogy", filter: "three-stone" },
    { label: "Traditional Halo", filter: "halo" },
    { label: "Half Eternity", filter: "half-eternity" },
  ];

  const shapeChips = [
    { label: "Round", filter: "round" },
    { label: "Oval", filter: "oval" },
    { label: "Marquise", filter: "marquise" },
    { label: "Radiant", filter: "radiant" },
    { label: "Emerald", filter: "emerald" },
    { label: "Pear", filter: "pear" },
    { label: "Princess", filter: "princess" },
    { label: "Cushion", filter: "cushion" },
    { label: "Asscher", filter: "asscher" },
    { label: "Heart", filter: "heart" },
  ];

  const allChips = [...categoryChips, ...styleChips, ...shapeChips];

  return (
    <section ref={sectionRef} id="quick-shop-chips" className="mx-auto max-w-5xl px-6 py-6 md:py-8">
      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-5">
        {allChips.map((chip) => {
          const isCategory = categoryChips.some(c => c.label === chip.label);
          const isStyle = styleChips.some(s => s.label === chip.label);
          const href = isCategory 
            ? (chip as { href: string }).href 
            : isStyle 
              ? `/shop?style=${(chip as { filter: string }).filter}`
              : `/shop?shape=${(chip as { filter: string }).filter}`;
          
          return (
            <Link
              key={chip.label}
              href={href}
              className="px-4 py-2 border rounded-full text-[12px] tracking-[0.16em] uppercase transition-all duration-300 hover:scale-105 luxury-chip"
            >
              {chip.label}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
