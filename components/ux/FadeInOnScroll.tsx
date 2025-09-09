"use client";
import React from "react";
import { useFadeInOnScroll } from "@/hooks/useFadeInOnScroll";

type Props = {
  className?: string;
  children: React.ReactNode;
  y?: number;
  duration?: number;
  delay?: number;
};

export default function FadeInOnScroll({ className = "", children, y, duration, delay }: Props) {
  const ref = useFadeInOnScroll<HTMLDivElement>({ y, duration, delay });
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}



