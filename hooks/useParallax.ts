"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "./useReducedMotion";

type Options = { y?: number };

export function useParallax<T extends HTMLElement>({ y = 20 }: Options = {}) {
  const ref = useRef<T | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: y * -0.5 },
        {
          y,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5,
          } as ScrollTrigger.Vars,
        }
      );
    }, el);

    return () => ctx.revert();
  }, [y, reduced]);

  return ref;
}



