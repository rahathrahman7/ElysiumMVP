"use client";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Track if we've already registered plugins
let isRegistered = false;

// Only register once in the browser
if (typeof window !== "undefined" && !isRegistered) {
  gsap.registerPlugin(ScrollTrigger);
  isRegistered = true;
}

export { gsap, ScrollTrigger };
