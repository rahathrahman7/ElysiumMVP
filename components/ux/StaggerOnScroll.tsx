"use client";
import React from "react";
import { useStaggerChildren } from "@/hooks/useStaggerChildren";

type Props = {
  className?: string;
  children: React.ReactNode;
  selector?: string;
};

export default function StaggerOnScroll({ className = "", children, selector = ":scope > *" }: Props) {
  const ref = useStaggerChildren<HTMLDivElement>(selector);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}



