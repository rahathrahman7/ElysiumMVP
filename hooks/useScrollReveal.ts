"use client";

import { useEffect, RefObject } from "react";
import { useReducedMotion } from "./useReducedMotion";

type ScrollRevealConfig = {
  trigger: RefObject<HTMLElement | null>;
  start?: string;
  end?: string;
  scrub?: number | boolean;
  opacity?: [number, number];
  y?: [number, number];
  scale?: [number, number];
  clipPath?: [string, string];
  ease?: string;
};

export function useScrollReveal({
  trigger,
  start = "top 85%",
  end = "top 50%",
  scrub = 1,
  opacity,
  y,
  scale,
  clipPath,
  ease = "power2.out",
}: ScrollRevealConfig) {
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = trigger.current;
    if (!el || reduced || typeof window === "undefined") return;

    const from: Record<string, unknown> = {};
    const to: Record<string, unknown> = {};

    if (opacity) {
      from.opacity = opacity[0];
      to.opacity = opacity[1];
    }
    if (y !== undefined) {
      from.y = y[0];
      to.y = y[1];
    }
    if (scale !== undefined) {
      from.scale = scale[0];
      to.scale = scale[1];
    }
    if (clipPath) {
      from.clipPath = clipPath[0];
      to.clipPath = clipPath[1];
    }

    if (Object.keys(from).length === 0 && Object.keys(to).length === 0) return;

    let ctx: { revert: () => void } | null = null;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger);
        ctx = gsap.context(() => {
          gsap.fromTo(el, from, {
            ...to,
            ease,
            scrollTrigger: {
              trigger: el,
              start,
              end,
              scrub,
            },
          });
        }, el);
      }
    );

    return () => {
      ctx?.revert();
    };
  }, [trigger, start, end, scrub, reduced, opacity, y, scale, clipPath, ease]);
}
