"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ─── Expandable card + colour-swatch styles (injected once via <style>) ─── */
const expandStyles = `
  .expand-card {
    display: inline-flex;
    flex-direction: column;
    flex-shrink: 0;
  }
  .expand-panel {
    max-width: 0;
    opacity: 0;
    overflow: hidden;
    transition: max-width 500ms cubic-bezier(0.4, 0, 0.2, 1),
                opacity 400ms cubic-bezier(0.4, 0, 0.2, 1);
  }
  .expand-card:hover .expand-panel {
    max-width: 260px;
    opacity: 1;
  }
  @media (max-width: 767px) {
    .expand-card:hover .expand-panel {
      max-width: 200px;
    }
  }

  /* ── Colour variant images: stack & toggle via :has() ── */
  .variant-img {
    opacity: 0;
    transition: opacity 300ms ease;
  }
  .variant-img.variant-default { opacity: 1; }

  .expand-card:has(.swatch-gold:hover) .variant-img { opacity: 0; }
  .expand-card:has(.swatch-gold:hover) .variant-img.variant-gold { opacity: 1; }

  .expand-card:has(.swatch-rose:hover) .variant-img { opacity: 0; }
  .expand-card:has(.swatch-rose:hover) .variant-img.variant-rose { opacity: 1; }

  .expand-card:has(.swatch-silver:hover) .variant-img { opacity: 0; }
  .expand-card:has(.swatch-silver:hover) .variant-img.variant-silver { opacity: 1; }

  .expand-card:has(.swatch-platinum:hover) .variant-img { opacity: 0; }
  .expand-card:has(.swatch-platinum:hover) .variant-img.variant-platinum { opacity: 1; }

  /* ── Bento row: neighbor transitions when a card expands ── */
  .bento-row {
    position: relative;
  }
  .bento-row .expand-card {
    transition: width 500ms cubic-bezier(0.4, 0, 0.2, 1),
                min-width 500ms cubic-bezier(0.4, 0, 0.2, 1),
                opacity 400ms cubic-bezier(0.4, 0, 0.2, 1),
                padding 500ms cubic-bezier(0.4, 0, 0.2, 1),
                margin 500ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* LEFT card hovered → middle card collapses so right slides into middle */
  .bento-row .expand-card:first-child:hover + .expand-card {
    width: 0 !important;
    min-width: 0 !important;
    opacity: 0;
    overflow: hidden;
    padding: 0 !important;
    margin: 0 !important;
  }

  /* MIDDLE card hovered → right card fades out */
  .bento-row .expand-card:nth-child(2):hover ~ .expand-card {
    opacity: 0;
  }

  /* ── Product row: hidden scrollbar ── */
  .product-scroll-row {
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }
  .product-scroll-row::-webkit-scrollbar {
    display: none;
  }

  /* RIGHT card hovered → pin to right so it doesn't shift; middle collapses to free space for expand panel */
  .bento-row:has(.expand-card:last-child:hover) .expand-card:last-child {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 10;
  }
  .bento-row:has(.expand-card:last-child:hover) .expand-card:nth-child(2) {
    width: 0 !important;
    min-width: 0 !important;
    opacity: 0;
    overflow: hidden;
    padding: 0 !important;
    margin: 0 !important;
  }
`;

/* ─── Colour variant type ─── */
type ColourVariant = {
  name: string;   // "gold" | "rose" | "silver" | "platinum"
  src: string;    // image path
  swatch: string; // CSS colour for the dot
};

const SWATCH_COLOURS: Record<string, string> = {
  gold: "#D4A76A",
  rose: "#B76E79",
  silver: "#C0C0C0",
  platinum: "#E5E4E2",
};

/* ─── Product card with optional hover-expand description + colour swatches ─── */
function ProductCard({
  href,
  src,
  alt,
  label,
  description,
  className = "",
  aspect = "aspect-square",
  imgClass = "object-contain",
  expandable = false,
  variants,
}: {
  href: string;
  src: string;
  alt: string;
  label: string;
  description?: string;
  className?: string;
  aspect?: string;
  imgClass?: string;
  expandable?: boolean;
  variants?: ColourVariant[];
}) {
  // Non-expandable: simple card
  if (!expandable || !description) {
    return (
      <Link href={href} className={`group block flex-shrink-0 ${className}`}>
        <div
          className="relative overflow-hidden p-[6px]"
          style={{
            backgroundColor: "#E8E2DA",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          }}
        >
          <div className={`relative ${aspect} overflow-hidden bg-white`}>
            <Image
              src={src}
              alt={alt}
              fill
              className={`${imgClass} transition-transform duration-500 ease-out group-hover:scale-[1.02]`}
              sizes="(max-width: 768px) 45vw, 280px"
            />
          </div>
        </div>
        <p className="font-serif text-[13px] md:text-[14px] text-[#6D3D0D] mt-3 text-center tracking-wide">
          {label}
        </p>
      </Link>
    );
  }

  // Determine default variant name from the main src
  const defaultVariant =
    variants?.find((v) => v.src === src)?.name ?? variants?.[0]?.name ?? "gold";

  // Expandable: card expands on hover to reveal description + swatches
  return (
    <Link href={href} className="expand-card carousel-card">
      <div className="flex items-stretch">
        {/* Image side - always fixed width */}
        <div className="w-[220px] md:w-[280px] flex-shrink-0">
          <div
            className="relative overflow-hidden p-[6px]"
            style={{
              backgroundColor: "#E8E2DA",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            }}
          >
            <div className={`relative ${aspect} overflow-hidden bg-white`}>
              {/* Stack all variant images; CSS :has() toggles visibility */}
              {variants && variants.length > 1 ? (
                variants.map((v) => (
                  <Image
                    key={v.name}
                    src={v.src}
                    alt={`${alt} – ${v.name}`}
                    fill
                    className={`variant-img variant-${v.name} ${v.name === defaultVariant ? "variant-default" : ""} ${imgClass} absolute inset-0`}
                    sizes="(max-width: 768px) 45vw, 280px"
                  />
                ))
              ) : (
                <Image
                  src={src}
                  alt={alt}
                  fill
                  className={`${imgClass} transition-transform duration-500 ease-out`}
                  sizes="(max-width: 768px) 45vw, 280px"
                />
              )}
            </div>
          </div>
        </div>

        {/* Description panel - slides in from right on hover */}
        <div className="expand-panel">
          <div className="w-[200px] md:w-[260px] h-full flex flex-col justify-center px-5 md:px-6 py-4">
            <h5 className="font-serif text-[#6D3D0D] text-lg md:text-xl leading-snug mb-3">
              {label}
            </h5>
            <p className="text-[11px] md:text-xs text-[#6D3D0D]/60 font-light leading-relaxed line-clamp-3">
              {description}
            </p>

            {/* Colour swatches */}
            {variants && variants.length > 1 && (
              <div className="flex items-center gap-2 mt-3">
                {variants.map((v) => (
                  <span
                    key={v.name}
                    className={`swatch-${v.name} block w-4 h-4 rounded-full border cursor-pointer transition-transform duration-200 hover:scale-125`}
                    style={{
                      backgroundColor: v.swatch,
                      borderColor: v.name === defaultVariant ? "#6D3D0D" : "rgba(109,61,13,0.2)",
                    }}
                    title={v.name.charAt(0).toUpperCase() + v.name.slice(1)}
                  />
                ))}
              </div>
            )}

            <span className="inline-flex items-center gap-1.5 text-[10px] text-[#D4AF37] uppercase tracking-[0.15em] mt-4 font-light whitespace-nowrap">
              Discover
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </span>
          </div>
        </div>
      </div>

      <p className="font-serif text-[13px] md:text-[14px] text-[#6D3D0D] mt-3 text-center tracking-wide w-[220px] md:w-[280px]">
        {label}
      </p>
    </Link>
  );
}

/* ─── Arrow SVG ─── */
const ArrowRight = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
  </svg>
);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   MAIN COMPONENT
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function CategoryShowcase() {
  const reduced = useReducedMotion();

  /* ─── Refs ─── */
  const headerRef = useRef<HTMLDivElement>(null);
  const bespokeRef = useRef<HTMLDivElement>(null);
  const bespokeHeadingRef = useRef<HTMLHeadingElement>(null);
  const bentoRef = useRef<HTMLDivElement>(null);
  const weddingRef = useRef<HTMLDivElement>(null);
  const weddingImageRef = useRef<HTMLDivElement>(null);
  const weddingTextRef = useRef<HTMLDivElement>(null);
  const forHerSectionRef = useRef<HTMLDivElement>(null);
  const forHerTextRef = useRef<HTMLDivElement>(null);
  const forHerCardsRef = useRef<HTMLDivElement>(null);
  const forHimSectionRef = useRef<HTMLDivElement>(null);
  const forHimTextRef = useRef<HTMLDivElement>(null);
  const forHimCardsRef = useRef<HTMLDivElement>(null);

  /* ─── Collections header: scrub-based fade ─── */
  useScrollReveal({
    trigger: headerRef,
    start: "top 85%",
    end: "top 50%",
    scrub: 1,
    opacity: [0.6, 1],
    y: [12, 0],
  });

  /* ─── Bento: scrub-based stagger reveal ─── */
  useEffect(() => {
    const container = bentoRef.current;
    if (!container || reduced || typeof window === "undefined") return;
    const items = container.querySelectorAll(".bento-reveal-item");
    if (items.length === 0) return;

    let ctx: { revert: () => void } | null = null;
    let mounted = true;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (!mounted) return;
        gsap.registerPlugin(ScrollTrigger);
        ctx = gsap.context(() => {
          gsap.fromTo(
            items,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              ease: "none",
              stagger: 0.08,
              scrollTrigger: {
                trigger: container,
                start: "top 85%",
                end: "top 45%",
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

  /* ─── Bespoke CTA: blur-to-sharp word reveal ─── */
  useEffect(() => {
    const heading = bespokeHeadingRef.current;
    const section = bespokeRef.current;
    if (!heading || !section || reduced || typeof window === "undefined") return;

    const words = heading.querySelectorAll<HTMLSpanElement>(".reveal-word");
    if (words.length === 0) return;

    let ctx: { revert: () => void } | null = null;
    let mounted = true;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (!mounted) return;
        gsap.registerPlugin(ScrollTrigger);
        ctx = gsap.context(() => {
          gsap.fromTo(
            words,
            { opacity: 0, filter: "blur(8px)", y: 12 },
            {
              opacity: 1,
              filter: "blur(0px)",
              y: 0,
              ease: "power2.out",
              stagger: 0.08,
              scrollTrigger: {
                trigger: section,
                start: "top 65%",
                end: "top 30%",
                scrub: 0.8,
              },
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

  /* ─── Bento carousel state ─── */
  const bentoStripRef = useRef<HTMLDivElement>(null);
  const [bentoPage, setBentoPage] = useState(0);
  const BENTO_PER_PAGE = 6; // 3 cols × 2 rows
  const bentoProducts = [
    { href: "/products/crown-earrings", src: "/products/Earrings/Crown/crown-gold-front.PNG", alt: "Crown diamond studs", label: "Crown Studs", description: "Classic four-claw diamond studs, designed to be worn and loved for generations.", variants: [{ name: "gold", src: "/products/Earrings/Crown/crown-gold-front.PNG", swatch: SWATCH_COLOURS.gold }, { name: "rose", src: "/products/Earrings/Crown/crown-rose-front.PNG", swatch: SWATCH_COLOURS.rose }, { name: "silver", src: "/products/Earrings/Crown/crown-silver-front.PNG", swatch: SWATCH_COLOURS.silver }] },
    { href: "/products/eternal-earrings", src: "/products/Earrings/Eternal/eternal-gold-front.PNG", alt: "Eternal diamond drops", label: "Eternal Drops", description: "Enduring elegance with a round-cut diamond in a classic four-claw setting.", variants: [{ name: "gold", src: "/products/Earrings/Eternal/eternal-gold-front.PNG", swatch: SWATCH_COLOURS.gold }, { name: "rose", src: "/products/Earrings/Eternal/eternal-rose-front.PNG", swatch: SWATCH_COLOURS.rose }, { name: "silver", src: "/products/Earrings/Eternal/eternal-silver-front.PNG", swatch: SWATCH_COLOURS.silver }] },
    { href: "/products/essence-earrings", src: "/products/Earrings/Essence/essence-gold-front.PNG", alt: "Essence diamond studs", label: "Essence Studs", description: "Minimalist brilliance captured in a refined bezel setting for everyday luxury.", variants: [{ name: "gold", src: "/products/Earrings/Essence/essence-gold-front.PNG", swatch: SWATCH_COLOURS.gold }, { name: "rose", src: "/products/Earrings/Essence/essence-rose-front.PNG", swatch: SWATCH_COLOURS.rose }, { name: "silver", src: "/products/Earrings/Essence/essence-silver-front.PNG", swatch: SWATCH_COLOURS.silver }] },
    { href: "/products/heirloom-earrings", src: "/products/Earrings/Heirloom/heirloom-gold-front.PNG", alt: "Heirloom diamond drops", label: "Heirloom Drops", description: "Timeless drop earrings with exceptional craftsmanship passed through generations.", variants: [{ name: "gold", src: "/products/Earrings/Heirloom/heirloom-gold-front.PNG", swatch: SWATCH_COLOURS.gold }, { name: "rose", src: "/products/Earrings/Heirloom/heirloom-rose-front.PNG", swatch: SWATCH_COLOURS.rose }, { name: "silver", src: "/products/Earrings/Heirloom/heirloom-silver-front.PNG", swatch: SWATCH_COLOURS.silver }] },
    { href: "/products/timeless-earrings", src: "/products/Earrings/Timeless/timeless-gold-front.PNG", alt: "Timeless diamond studs", label: "Timeless Studs", description: "The quintessential diamond stud, effortlessly elevating every occasion.", variants: [{ name: "gold", src: "/products/Earrings/Timeless/timeless-gold-front.PNG", swatch: SWATCH_COLOURS.gold }, { name: "rose", src: "/products/Earrings/Timeless/timeless-rose-front.PNG", swatch: SWATCH_COLOURS.rose }, { name: "silver", src: "/products/Earrings/Timeless/timeless-silver-front.PNG", swatch: SWATCH_COLOURS.silver }] },
    { href: "/products/pure-earrings", src: "/products/Earrings/Pure/pure-gold-front.PNG", alt: "Pure diamond studs", label: "Pure Studs", description: "Clean lines and pure brilliance in a contemporary setting for modern elegance.", variants: [{ name: "gold", src: "/products/Earrings/Pure/pure-gold-front.PNG", swatch: SWATCH_COLOURS.gold }, { name: "rose", src: "/products/Earrings/Pure/pure-rose-front.PNG", swatch: SWATCH_COLOURS.rose }, { name: "silver", src: "/products/Earrings/Pure/pure-silver-front.PNG", swatch: SWATCH_COLOURS.silver }] },
    { href: "/products/refined-earrings", src: "/products/Earrings/Refined/refined-gold-front.PNG", alt: "Refined diamond drops", label: "Refined Drops", description: "Delicate drops that catch the light with every movement. Effortlessly sophisticated.", variants: [{ name: "gold", src: "/products/Earrings/Refined/refined-gold-front.PNG", swatch: SWATCH_COLOURS.gold }, { name: "rose", src: "/products/Earrings/Refined/refined-rose-front.PNG", swatch: SWATCH_COLOURS.rose }, { name: "silver", src: "/products/Earrings/Refined/refined-silver-front.PNG", swatch: SWATCH_COLOURS.silver }] },
    { href: "/products/classic-4-claw-tennis-bracelet", src: "/products/Classic%204%20Claw%20Tennis%20Bracelet%20/3ct/classicTB3ct-gold2.PNG", alt: "Classic tennis bracelet", label: "Classic Tennis", description: "A continuous line of brilliant diamonds set in 18k gold. The ultimate statement.", variants: [{ name: "gold", src: "/products/Classic%204%20Claw%20Tennis%20Bracelet%20/3ct/classicTB3ct-gold2.PNG", swatch: SWATCH_COLOURS.gold }, { name: "rose", src: "/products/Classic%204%20Claw%20Tennis%20Bracelet%20/3ct/classicTB3ct-rose2.PNG", swatch: SWATCH_COLOURS.rose }, { name: "silver", src: "/products/Classic%204%20Claw%20Tennis%20Bracelet%20/3ct/classicTB3ct-silver2.PNG", swatch: SWATCH_COLOURS.silver }] },
  ];
  const bentoTotalPages = Math.ceil(bentoProducts.length / BENTO_PER_PAGE);

  const advanceBento = useCallback(() => {
    const next = (bentoPage + 1) % bentoTotalPages;
    setBentoPage(next);
    if (bentoStripRef.current) {
      gsap.to(bentoStripRef.current, {
        xPercent: -next * 100,
        duration: 0.6,
        ease: "power2.inOut",
      });
    }
  }, [bentoPage, bentoTotalPages]);

  const retreatBento = useCallback(() => {
    const prev = bentoPage <= 0 ? bentoTotalPages - 1 : bentoPage - 1;
    setBentoPage(prev);
    if (bentoStripRef.current) {
      gsap.to(bentoStripRef.current, {
        xPercent: -prev * 100,
        duration: 0.6,
        ease: "power2.inOut",
      });
    }
  }, [bentoPage, bentoTotalPages]);

  /* ─── Continuous marquee for For Her / For Him ─── */
  const forHerTweenRef = useRef<gsap.core.Tween | null>(null);
  const forHimTweenRef = useRef<gsap.core.Tween | null>(null);

  /* Helper: setup auto-scroll marquee with infinite loop */
  const setupMarquee = useCallback(
    (
      inner: HTMLDivElement,
      tweenRef: React.MutableRefObject<gsap.core.Tween | null>,
      direction: "left" | "right",
    ) => {
      const items = inner.children;
      if (!items.length) return () => {};
      const count = items.length;
      for (let i = 0; i < count; i++) {
        const clone = items[i].cloneNode(true) as HTMLElement;
        clone.setAttribute("aria-hidden", "true");
        inner.appendChild(clone);
      }
      const halfWidth = inner.scrollWidth / 2;
      const duration = halfWidth / 30;
      const startX = direction === "left" ? 0 : -halfWidth;
      const endX   = direction === "left" ? -halfWidth : 0;

      gsap.set(inner, { x: startX });
      tweenRef.current = gsap.to(inner, { x: endX, duration, ease: "none", repeat: -1 });

      const pause = () => tweenRef.current?.pause();
      const play  = () => tweenRef.current?.play();
      inner.addEventListener("mouseenter", pause);
      inner.addEventListener("mouseleave", play);

      return () => {
        tweenRef.current?.kill();
        inner.removeEventListener("mouseenter", pause);
        inner.removeEventListener("mouseleave", play);
        const all = Array.from(inner.children);
        const half = Math.floor(all.length / 2);
        for (let i = all.length - 1; i >= half; i--) all[i].remove();
      };
    },
    [],
  );

  /* Arrow nav: shift the marquee by one card width */
  const shiftMarquee = useCallback(
    (tweenRef: React.MutableRefObject<gsap.core.Tween | null>, inner: HTMLDivElement | null, dir: -1 | 1) => {
      if (!inner) return;
      const firstCard = inner.firstElementChild as HTMLElement | null;
      const cardW = firstCard ? firstCard.offsetWidth + 20 : 300;
      const currentX = gsap.getProperty(inner, "x") as number;
      tweenRef.current?.pause();
      gsap.to(inner, {
        x: currentX + dir * cardW,
        duration: 0.45,
        ease: "power2.out",
        onComplete: () => tweenRef.current?.play(),
      });
    },
    [],
  );

  useEffect(() => {
    const inner = forHerCardsRef.current;
    if (!inner || reduced) return;
    let cleanup: (() => void) | undefined;
    const raf = requestAnimationFrame(() => {
      cleanup = setupMarquee(inner, forHerTweenRef, "left");
    });
    return () => { cancelAnimationFrame(raf); cleanup?.(); };
  }, [reduced, setupMarquee]);

  useEffect(() => {
    const inner = forHimCardsRef.current;
    if (!inner || reduced) return;
    let cleanup: (() => void) | undefined;
    const raf = requestAnimationFrame(() => {
      cleanup = setupMarquee(inner, forHimTweenRef, "right");
    });
    return () => { cancelAnimationFrame(raf); cleanup?.(); };
  }, [reduced, setupMarquee]);

  /* ─── Ready to Wear: scrub-based reveal + optional pin ─── */
  useEffect(() => {
    const section = weddingRef.current;
    const imageEl = weddingImageRef.current;
    const textEl = weddingTextRef.current;
    if (!section || !imageEl || !textEl || reduced || typeof window === "undefined") return;

    let ctx: { revert: () => void } | null = null;
    let mounted = true;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (!mounted) return;
        gsap.registerPlugin(ScrollTrigger);
        const pinEnd = "+=100%";
        ctx = gsap.context(() => {
          ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: pinEnd,
            pin: true,
            scrub: 1,
          });

          gsap.fromTo(
            imageEl,
            { scale: 0.98, opacity: 0.7 },
            {
              scale: 1,
              opacity: 1,
              ease: "none",
              scrollTrigger: { trigger: section, start: "top top", end: pinEnd, scrub: 1 },
            }
          );

          gsap.fromTo(
            textEl,
            { y: 8, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              ease: "none",
              scrollTrigger: { trigger: section, start: "top top", end: pinEnd, scrub: 1 },
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
    <section className="bg-[#FAF7F2]">
      {/* Inject expand-card hover styles (works on cloned nodes too) */}
      <style dangerouslySetInnerHTML={{ __html: expandStyles }} />
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          FOR HER — Text left, products right
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div ref={forHerSectionRef} className="bg-white py-20 md:py-28 overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-6 flex flex-col md:flex-row items-start md:items-center gap-10 md:gap-12">
          {/* Text panel */}
          <div ref={forHerTextRef} className="md:w-[280px] lg:w-[320px] flex-shrink-0 will-change-transform">
            <p className="text-[10px] text-[#D4AF37] uppercase tracking-[0.4em] font-light mb-4">
              Engagement Rings & Bridal
            </p>
            <h4 className="font-serif text-[#6D3D0D] text-3xl md:text-4xl lg:text-5xl tracking-wide leading-tight mb-4">
              For Her
            </h4>
            <p className="text-sm text-[#6D3D0D]/60 font-light leading-relaxed mb-8 max-w-[280px]">
              Exceptional designs crafted to celebrate your most meaningful moments.
            </p>
            <Link
              href="/shop?category=ring"
              className="inline-flex items-center gap-2 text-xs text-[#D4AF37] uppercase tracking-[0.2em] hover:text-[#6D3D0D] transition-colors duration-300"
            >
              Explore Collection <ArrowRight />
            </Link>
          </div>

          {/* Continuous carousel with fade edges + arrow nav */}
          <div className="flex-1 min-w-0 w-full md:w-auto relative group/carousel">
            {/* Prev */}
            <button
              onClick={() => shiftMarquee(forHerTweenRef, forHerCardsRef.current, 1)}
              aria-label="Previous"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-white/80 border border-[#D4AF37]/30 text-[#6D3D0D] shadow-sm opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 hover:bg-white"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
            </button>
            {/* Next */}
            <button
              onClick={() => shiftMarquee(forHerTweenRef, forHerCardsRef.current, -1)}
              aria-label="Next"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-white/80 border border-[#D4AF37]/30 text-[#6D3D0D] shadow-sm opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 hover:bg-white"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
            </button>
            <div
              className="overflow-hidden"
              style={{
                maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
              }}
            >
            <div ref={forHerCardsRef} className="flex gap-5 md:gap-6 pb-4 will-change-transform">
              <ProductCard
                href="/products/seraphina-signature-six-claw"
                src="/products/Seraphina/Seraphina-gold-front.jpeg"
                alt="Seraphina six-claw solitaire"
                label="Seraphina"
                description="Signature six-claw solitaire with a round-cut centre and delicate pav&eacute; band."
                expandable
                variants={[
                  { name: "gold", src: "/products/Seraphina/Seraphina-gold-front.jpeg", swatch: SWATCH_COLOURS.gold },
                  { name: "rose", src: "/products/Seraphina/Seraphina-rose-front.jpeg", swatch: SWATCH_COLOURS.rose },
                  { name: "silver", src: "/products/Seraphina/Seraphina-silver-front.jpeg", swatch: SWATCH_COLOURS.silver },
                ]}
              />
              <ProductCard
                href="/products/vow-veil"
                src="/products/vow-and-veil/VV-gold-front.jpeg"
                alt="Vow & Veil toi et moi"
                label="Vow & Veil"
                description="A round and pear-cut stone paired in a gracefully sculpted, curved band."
                expandable
                variants={[
                  { name: "gold", src: "/products/vow-and-veil/VV-gold-front.jpeg", swatch: SWATCH_COLOURS.gold },
                  { name: "rose", src: "/products/vow-and-veil/VV-rose-front.jpeg", swatch: SWATCH_COLOURS.rose },
                  { name: "silver", src: "/products/vow-and-veil/VV-silver-front.jpeg", swatch: SWATCH_COLOURS.silver },
                ]}
              />
              <ProductCard
                href="/products/eterna-oval-solitaire-hidden-halo"
                src="/products/Eterna/eterna-front.jpeg"
                alt="Eterna oval solitaire"
                label="Eterna"
                description="Classic four-talon oval solitaire enhanced by a dazzling hidden halo."
                expandable
                variants={[
                  { name: "gold", src: "/products/Eterna/eterna-front.jpeg", swatch: SWATCH_COLOURS.gold },
                  { name: "rose", src: "/products/Eterna/eterna-rose-front.jpeg", swatch: SWATCH_COLOURS.rose },
                  { name: "platinum", src: "/products/Eterna/eterna-plat-front.jpeg", swatch: SWATCH_COLOURS.platinum },
                ]}
              />
              <ProductCard
                href="/products/luna-low-set-solitaire"
                src="/products/Luna/Luna-gold-front.jpeg"
                alt="Luna low-set solitaire"
                label="Luna"
                description="Low-set round centre stone with hidden halo, designed to sit flush with a wedding band."
                expandable
                variants={[
                  { name: "gold", src: "/products/Luna/Luna-gold-front.jpeg", swatch: SWATCH_COLOURS.gold },
                  { name: "rose", src: "/products/Luna/Luna-rose-front.jpeg", swatch: SWATCH_COLOURS.rose },
                  { name: "silver", src: "/products/Luna/Luna-silver-front.jpeg", swatch: SWATCH_COLOURS.silver },
                ]}
              />
              <ProductCard
                href="/products/aura-engagement-ring"
                src="/products/Aura/Aura-gold-front.jpg"
                alt="Aura engagement ring"
                label="Aura"
                description="Oval-cut centre stone complemented by round and marquise-cut side stones."
                expandable
                variants={[
                  { name: "gold", src: "/products/Aura/Aura-gold-front.jpg", swatch: SWATCH_COLOURS.gold },
                  { name: "rose", src: "/products/Aura/aura-rose-front.jpg", swatch: SWATCH_COLOURS.rose },
                  { name: "silver", src: "/products/Aura/aura-silver-front.jpg", swatch: SWATCH_COLOURS.silver },
                ]}
              />
              <ProductCard
                href="/products/unity-engagement-ring"
                src="/products/Unity/unity-gold-front.jpg"
                alt="Unity braided solitaire"
                label="Unity"
                description="Refined braided design with an oval-cut centre, pav&eacute; detail, and hidden halo."
                expandable
                variants={[
                  { name: "gold", src: "/products/Unity/unity-gold-front.jpg", swatch: SWATCH_COLOURS.gold },
                  { name: "rose", src: "/products/Unity/unity-rose-front.jpg", swatch: SWATCH_COLOURS.rose },
                  { name: "silver", src: "/products/Unity/unity-silver-front.jpg", swatch: SWATCH_COLOURS.silver },
                ]}
              />
              <ProductCard
                href="/products/lumea-engagement-ring"
                src="/products/Lumea/lumia-gold-front.jpg"
                alt="Lumea toi et moi"
                label="Lumea"
                description="Striking oval and pear-cut stones brought together in a timeless toi et moi design."
                expandable
                variants={[
                  { name: "gold", src: "/products/Lumea/lumia-gold-front.jpg", swatch: SWATCH_COLOURS.gold },
                  { name: "rose", src: "/products/Lumea/lumia-rose-front.jpg", swatch: SWATCH_COLOURS.rose },
                  { name: "silver", src: "/products/Lumea/lumia-silver-front.jpg", swatch: SWATCH_COLOURS.silver },
                ]}
              />
              <ProductCard
                href="/products/orabella-toi-et-moi"
                src="/products/Orabella/orabella-gold-front.jpeg"
                alt="Orabella toi et moi"
                label="Orabella"
                description="Round and oval stones in a distinctive toi et moi silhouette of quiet luxury."
                expandable
                variants={[
                  { name: "gold", src: "/products/Orabella/orabella-gold-front.jpeg", swatch: SWATCH_COLOURS.gold },
                  { name: "rose", src: "/products/Orabella/orabella-rose-front.jpeg", swatch: SWATCH_COLOURS.rose },
                  { name: "silver", src: "/products/Orabella/orabella-silver-back.jpeg", swatch: SWATCH_COLOURS.silver },
                ]}
              />
            </div>
            </div>
          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          FOR HIM — Products left, text right (mirrored)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div ref={forHimSectionRef} className="bg-[#F8F6F2] py-20 md:py-28 overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-6 flex flex-col-reverse md:flex-row items-start md:items-center gap-10 md:gap-12">
          {/* Continuous carousel with fade edges + arrow nav */}
          <div className="flex-1 min-w-0 w-full md:w-auto relative group/carousel">
            {/* Prev */}
            <button
              onClick={() => shiftMarquee(forHimTweenRef, forHimCardsRef.current, 1)}
              aria-label="Previous"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-[#F8F6F2]/90 border border-[#D4AF37]/30 text-[#6D3D0D] shadow-sm opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 hover:bg-white"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
            </button>
            {/* Next */}
            <button
              onClick={() => shiftMarquee(forHimTweenRef, forHimCardsRef.current, -1)}
              aria-label="Next"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-[#F8F6F2]/90 border border-[#D4AF37]/30 text-[#6D3D0D] shadow-sm opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 hover:bg-white"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
            </button>
            <div
              className="overflow-hidden"
              style={{
                maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
              }}
            >
            <div ref={forHimCardsRef} className="flex gap-5 md:gap-6 pb-4 will-change-transform">
              <ProductCard
                href="/products/arden-mens-ring"
                src="/products/mens-rings/Arden/arden-silver.jpeg"
                alt="Arden wedding band"
                label="Arden"
                description="Smooth beveled edges with dual polished grooves on a brushed finish band."
                expandable
                variants={[
                  { name: "silver", src: "/products/mens-rings/Arden/arden-silver.jpeg", swatch: SWATCH_COLOURS.silver },
                  { name: "gold", src: "/products/mens-rings/Arden/Arden-gold.jpeg", swatch: SWATCH_COLOURS.gold },
                  { name: "rose", src: "/products/mens-rings/Arden/arden-rose.jpeg", swatch: SWATCH_COLOURS.rose },
                ]}
              />
              <ProductCard
                href="/products/bastion-mens-ring"
                src="/products/mens-rings/Bastion/basttion-silver.jpeg"
                alt="Bastion wedding band"
                label="Bastion"
                description="A distinctive polished groove set into a refined brushed finish band."
                expandable
                variants={[
                  { name: "silver", src: "/products/mens-rings/Bastion/basttion-silver.jpeg", swatch: SWATCH_COLOURS.silver },
                  { name: "gold", src: "/products/mens-rings/Bastion/bastion-gold.jpeg", swatch: SWATCH_COLOURS.gold },
                  { name: "rose", src: "/products/mens-rings/Bastion/bastion-rose.jpeg", swatch: SWATCH_COLOURS.rose },
                ]}
              />
              <ProductCard
                href="/products/kairo-mens-ring"
                src="/products/mens-rings/Kairo/kairo-silver.jpeg"
                alt="Kairo wedding band"
                label="Kairo"
                description="Bold yet refined, featuring clean modern lines and a comfortable flat profile."
                expandable
                variants={[
                  { name: "silver", src: "/products/mens-rings/Kairo/kairo-silver.jpeg", swatch: SWATCH_COLOURS.silver },
                  { name: "gold", src: "/products/mens-rings/Kairo/kairo-gold.jpeg", swatch: SWATCH_COLOURS.gold },
                  { name: "rose", src: "/products/mens-rings/Kairo/kairo-rose.jpeg", swatch: SWATCH_COLOURS.rose },
                ]}
              />
              <ProductCard
                href="/products/orion-mens-ring"
                src="/products/mens-rings/Orion/orion-silver.jpeg"
                alt="Orion wedding band"
                label="Orion"
                description="A sleek contemporary design with subtle textural contrast and timeless appeal."
                expandable
                variants={[
                  { name: "silver", src: "/products/mens-rings/Orion/orion-silver.jpeg", swatch: SWATCH_COLOURS.silver },
                  { name: "gold", src: "/products/mens-rings/Orion/orion-gold.jpeg", swatch: SWATCH_COLOURS.gold },
                  { name: "rose", src: "/products/mens-rings/Orion/orion-rose.jpeg", swatch: SWATCH_COLOURS.rose },
                ]}
              />
              <ProductCard
                href="/products/heritage-mens-ring"
                src="/products/mens-rings/Heritage/heritage-silver.jpeg"
                alt="Heritage wedding band"
                label="Heritage"
                description="Distinctive hammered matte finish with smooth flat edges for a refined look."
                expandable
                variants={[
                  { name: "silver", src: "/products/mens-rings/Heritage/heritage-silver.jpeg", swatch: SWATCH_COLOURS.silver },
                  { name: "gold", src: "/products/mens-rings/Heritage/heritage-gold.jpeg", swatch: SWATCH_COLOURS.gold },
                  { name: "rose", src: "/products/mens-rings/Heritage/heritage-rose.jpeg", swatch: SWATCH_COLOURS.rose },
                ]}
              />
              <ProductCard
                href="/products/sable-mens-ring"
                src="/products/mens-rings/Sable/sable-silver.jpeg"
                alt="Sable wedding band"
                label="Sable"
                description="Dark and distinguished with a unique brushed finish and polished edges."
                expandable
                variants={[
                  { name: "silver", src: "/products/mens-rings/Sable/sable-silver.jpeg", swatch: SWATCH_COLOURS.silver },
                  { name: "gold", src: "/products/mens-rings/Sable/sable-gold.jpeg", swatch: SWATCH_COLOURS.gold },
                  { name: "rose", src: "/products/mens-rings/Sable/sable-rose.jpeg", swatch: SWATCH_COLOURS.rose },
                ]}
              />
              <ProductCard
                href="/products/blacksmith-mens-ring"
                src="/products/mens-rings/Blacksmith/blacksmith-silver.jpeg"
                alt="Blacksmith wedding band"
                label="Blacksmith"
                description="Rugged sophistication with a textured surface and comfortable court profile."
                expandable
                variants={[
                  { name: "silver", src: "/products/mens-rings/Blacksmith/blacksmith-silver.jpeg", swatch: SWATCH_COLOURS.silver },
                  { name: "gold", src: "/products/mens-rings/Blacksmith/blacksmith-gold.jpeg", swatch: SWATCH_COLOURS.gold },
                  { name: "rose", src: "/products/mens-rings/Blacksmith/blacksmith-rose.jpeg", swatch: SWATCH_COLOURS.rose },
                ]}
              />
              <ProductCard
                href="/products/vireo-mens-ring"
                src="/products/mens-rings/Vireo/vireo-silver.jpeg"
                alt="Vireo wedding band"
                label="Vireo"
                description="A refined classic with a polished finish and gently rounded profile."
                expandable
                variants={[
                  { name: "silver", src: "/products/mens-rings/Vireo/vireo-silver.jpeg", swatch: SWATCH_COLOURS.silver },
                  { name: "gold", src: "/products/mens-rings/Vireo/vireo-gold.jpeg", swatch: SWATCH_COLOURS.gold },
                  { name: "rose", src: "/products/mens-rings/Vireo/vireo-rose.jpeg", swatch: SWATCH_COLOURS.rose },
                ]}
              />
            </div>
            </div>
          </div>

          {/* Text panel */}
          <div ref={forHimTextRef} className="md:w-[280px] lg:w-[320px] flex-shrink-0 will-change-transform md:text-right">
            <p className="text-[10px] text-[#D4AF37] uppercase tracking-[0.4em] font-light mb-4">
              Wedding Bands
            </p>
            <h4 className="font-serif text-[#6D3D0D] text-3xl md:text-4xl lg:text-5xl tracking-wide leading-tight mb-4">
              For Him
            </h4>
            <p className="text-sm text-[#6D3D0D]/60 font-light leading-relaxed mb-8 max-w-[280px] md:ml-auto">
              Bold, refined bands designed for the modern gentleman.
            </p>
            <Link
              href="/shop?category=mens-rings"
              className="inline-flex items-center gap-2 text-xs text-[#D4AF37] uppercase tracking-[0.2em] hover:text-[#6D3D0D] transition-colors duration-300"
            >
              Explore Collection <ArrowRight />
            </Link>
          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION HEADER
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div ref={headerRef} className="text-center pt-24 md:pt-32 pb-12 md:pb-14">
        <p className="text-[10px] text-[#D4AF37] uppercase tracking-[0.4em] font-light mb-3">
          The Collections
        </p>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          READY TO WEAR — Own section, editorial layout
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section ref={weddingRef} className="bg-[#F8F6F2] py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          {/* Section label */}
          <p className="text-center text-[10px] text-[#D4AF37] uppercase tracking-[0.4em] font-light mb-10">
            Ready to Wear
          </p>
          {/* Hero image — full width, intentional aspect */}
          <div ref={weddingImageRef} className="relative w-full aspect-[4/3] md:aspect-[21/9] max-h-[45vh] md:max-h-[55vh] overflow-hidden">
            <Link href="/shop" className="group block relative h-full w-full">
              <Image
                src="/images/NewCollection.png"
                alt="Ready to wear collection of elegant diamond engagement rings"
                fill
                className="object-cover object-center transition-all duration-700 ease-out group-hover:scale-[1.03]"
                sizes="100vw"
                quality={80}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#F8F6F2]/30 via-transparent to-transparent" aria-hidden />
              <div className="absolute inset-0 bg-gradient-to-br from-elysium-gold/0 to-[#6D3D0D]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-700" aria-hidden />
            </Link>
          </div>
          {/* Text block — centered, deliberate hierarchy */}
          <div ref={weddingTextRef} className="max-w-xl mx-auto pt-12 md:pt-16 text-center">
            <p className="text-[#6D3D0D]/75 text-sm md:text-base font-light leading-[1.9] mb-10">
              Discover our ready-to-wear designs, crafted with exceptional artistry and timeless elegance.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-3 px-10 py-4 bg-[#6D3D0D] text-white font-light tracking-[0.15em] uppercase text-xs md:text-sm transition-all duration-500 hover:bg-[#D4AF37] hover:gap-5 hover:shadow-xl group relative overflow-hidden"
            >
              <span className="relative z-10">Explore Collection</span>
              <svg className="w-4 h-4 relative z-10 transition-transform duration-500 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" aria-hidden />
            </Link>
          </div>
        </div>
      </section>


      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          BESPOKE SERVICE CTA
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div
        ref={bespokeRef}
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #EDE8E0 0%, #E6DFD4 50%, #EDE8E0 100%)",
        }}
      >
        {/* Subtle top/bottom border lines */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C4A265]/20 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C4A265]/20 to-transparent" />

        <div className="relative text-center px-6 py-24 md:py-32 lg:py-40">
          {/* Faint radial glow behind content */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(196, 162, 101, 0.06) 0%, transparent 70%)",
            }}
          />

          {/* Ornament */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#B8963E]/30" />
            <div className="w-1.5 h-1.5 rotate-45 border border-[#B8963E]/40" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#B8963E]/30" />
          </div>

          <p className="relative text-[10px] text-[#9A7D3D] uppercase tracking-[0.5em] font-light mb-8">
            Bespoke Service
          </p>

          <h3
            ref={bespokeHeadingRef}
            className="relative font-serif text-[#2C2420] leading-[1.15] mb-8"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)", letterSpacing: "-0.01em" }}
          >
            <span className="reveal-word inline-block">Didn&apos;t&nbsp;</span>
            <span className="reveal-word inline-block">Find&nbsp;</span>
            <span className="reveal-word inline-block">the&nbsp;</span>
            <span className="reveal-word inline-block">One?</span>
            <br />
            <span className="reveal-word inline-block text-[#9A7D3D]">Let&nbsp;</span>
            <span className="reveal-word inline-block text-[#9A7D3D]">Us&nbsp;</span>
            <span className="reveal-word inline-block text-[#9A7D3D]">Create&nbsp;</span>
            <span className="reveal-word inline-block text-[#9A7D3D]">It.</span>
          </h3>

          <p className="relative text-sm md:text-base text-[#6B5D52] font-light leading-relaxed max-w-md mx-auto mb-12">
            Every love story is unique. Our master artisans will craft a
            one-of-one piece that tells yours — from first sketch to final polish.
          </p>

          <Link
            href="/bespoke"
            className="relative inline-flex items-center gap-3 px-10 py-4 border border-[#B8963E]/40 text-[#8A7030] font-light tracking-[0.2em] uppercase text-xs transition-all duration-500 hover:bg-[#B8963E] hover:text-white hover:border-[#B8963E] hover:gap-5 group"
          >
            <span>Begin Your Journey</span>
            <svg className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>

          {/* Bottom ornament */}
          <div className="flex items-center justify-center gap-4 mt-12">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#B8963E]/30" />
            <div className="w-1.5 h-1.5 rotate-45 border border-[#B8963E]/40" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#B8963E]/30" />
          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          FINE JEWELLERY BENTO GRID + CAROUSEL
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div ref={bentoRef} className="px-4 md:px-6 lg:px-10 pt-8 md:pt-12 pb-24 md:pb-32">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6">
          {/* Left: Tennis bracelet hero - height matches grid cards */}
          <div className="bento-reveal-item lg:col-span-5">
            <Link href="/products/classic-4-claw-tennis-bracelet" className="group block">
              <div
                className="relative overflow-hidden p-[6px]"
                style={{ backgroundColor: "#E8E2DA", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)" }}
              >
                <div className="relative h-[602px] md:h-[762px] overflow-hidden bg-white">
                  <Image
                    src="/products/Classic%204%20Claw%20Tennis%20Bracelet%20/3ct/classicTB3ct-gold.PNG"
                    alt="Classic tennis bracelet"
                    fill
                    className="object-contain transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 100vw, 42vw"
                  />
                </div>
              </div>
            </Link>
            <div className="mt-4">
              <h4 className="font-serif text-[#6D3D0D] text-2xl md:text-3xl mb-2">Classic Tennis</h4>
              <p className="text-[10px] text-[#6D3D0D]/40 tracking-[0.15em] mb-4">18K GOLD</p>
              <Link
                href="/products/classic-4-claw-tennis-bracelet"
                className="inline-flex items-center gap-2 text-xs text-[#6D3D0D]/60 uppercase tracking-[0.2em] hover:text-[#D4AF37] transition-colors duration-300"
              >
                View Collection <ArrowRight />
              </Link>
            </div>
          </div>

          {/* Right: Paginated 2×2 earring grid */}
          <div className="bento-reveal-item lg:col-span-7 flex flex-col">
            {/* Carousel viewport */}
            <div className="overflow-hidden">
              <div ref={bentoStripRef} className="flex will-change-transform" style={{ width: `${bentoTotalPages * 100}%` }}>
                {Array.from({ length: bentoTotalPages }).map((_, pageIdx) => {
                  const pageProducts = bentoProducts.slice(pageIdx * BENTO_PER_PAGE, (pageIdx + 1) * BENTO_PER_PAGE);
                  const row1 = pageProducts.slice(0, 3);
                  const row2 = pageProducts.slice(3, 6);
                  return (
                    <div key={pageIdx} className="flex flex-col gap-4" style={{ width: `${100 / bentoTotalPages}%` }}>
                      <div className="bento-row flex gap-4 overflow-hidden">
                        {row1.map((p) => (
                          <ProductCard
                            key={p.href}
                            href={p.href}
                            src={p.src}
                            alt={p.alt}
                            label={p.label}
                            description={p.description}
                            expandable
                            aspect="aspect-[3/4]"
                            variants={p.variants}
                          />
                        ))}
                      </div>
                      {row2.length > 0 && (
                        <div className="bento-row flex gap-4 overflow-hidden">
                          {row2.map((p) => (
                            <ProductCard
                              key={p.href}
                              href={p.href}
                              src={p.src}
                              alt={p.alt}
                              label={p.label}
                              description={p.description}
                              expandable
                              aspect="aspect-[3/4]"
                              variants={p.variants}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Navigation: arrows + dots + CTA */}
            <div className="flex items-center justify-between pt-6">
              {bentoTotalPages > 1 ? (
                <div className="flex items-center gap-4">
                  <button
                    onClick={retreatBento}
                    aria-label="Previous products"
                    className="text-[#6D3D0D]/30 hover:text-[#D4AF37] transition-colors duration-300"
                  >
                    <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                    </svg>
                  </button>
                  <div className="flex gap-2">
                    {Array.from({ length: bentoTotalPages }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                          i === bentoPage ? "bg-[#D4AF37]" : "bg-[#6D3D0D]/15"
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={advanceBento}
                    aria-label="More fine jewellery"
                    className="text-[#6D3D0D]/30 hover:text-[#D4AF37] transition-colors duration-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                    </svg>
                  </button>
                </div>
              ) : <div />}
              <Link
                href="/fine-jewellery"
                className="inline-flex items-center gap-2 text-xs text-[#D4AF37] uppercase tracking-[0.2em] hover:text-[#6D3D0D] transition-colors duration-300"
              >
                Explore Fine Jewellery <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION FOOTER
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="bg-[#FAF7F2] flex items-center justify-center gap-8 py-12">
        <div className="w-16 h-px bg-[#D4AF37]/25" />
        <Link
          href="/shop"
          className="text-[11px] text-[#6D3D0D]/40 uppercase tracking-[0.2em] hover:text-[#D4AF37] transition-colors duration-500"
        >
          View Complete Collection
        </Link>
        <div className="w-16 h-px bg-[#D4AF37]/25" />
      </div>
    </section>
  );
}
