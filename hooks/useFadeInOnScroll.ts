"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "./useReducedMotion";

type Options = {
  y?: number;
  duration?: number;
  delay?: number;
};

export function useFadeInOnScroll<T extends HTMLElement>({ y = 16, duration = 0.6, delay = 0 }: Options = {}) {
  const ref = useRef<T | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) {
      el.style.opacity = "1";
      el.style.transform = "none";
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(el, { opacity: 0, y });
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration,
        delay,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        } as ScrollTrigger.Vars,
      });
    }, el);

    return () => ctx.revert();
  }, [reduced, y, duration, delay]);

  return ref;
}



