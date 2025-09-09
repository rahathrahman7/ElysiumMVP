"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "./useReducedMotion";

export function useStaggerChildren<T extends HTMLElement>(childSelector = ":scope > *", stagger = 0.06) {
  const ref = useRef<T | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const items = Array.from(root.querySelectorAll<HTMLElement>(childSelector));
    if (!items.length) return;

    if (reduced) {
      items.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(items, { opacity: 0, y: 16 });
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger,
        scrollTrigger: {
          trigger: root,
          start: "top 85%",
          once: true,
        } as ScrollTrigger.Vars,
      });
    }, root);

    return () => ctx.revert();
  }, [childSelector, stagger, reduced]);

  return ref;
}



