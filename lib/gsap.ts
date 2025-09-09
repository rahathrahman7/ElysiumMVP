"use client";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Only register once in the browser
if (typeof window !== "undefined" && !(gsap as any).core.globals().ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };



