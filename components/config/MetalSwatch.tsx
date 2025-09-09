"use client";
import { ReactNode } from "react";

interface MetalSwatchProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  swatchColor: string;
  className?: string;
}

export default function MetalSwatch({ 
  label, 
  active = false, 
  onClick, 
  swatchColor, 
  className = "" 
}: MetalSwatchProps) {
  return (
    <button
      onClick={onClick}
      className={[
        "group relative flex flex-col items-center justify-center w-28 h-32 rounded-2xl border-2 transition-all duration-300",
        "hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2",
        active
          ? "border-[var(--gold)] bg-gradient-to-br from-[var(--ivory)] to-white shadow-lg ring-2 ring-[var(--gold)]/20"
          : "border-neutral-200 bg-white hover:border-[var(--gold)] hover:shadow-md hover:bg-gradient-to-br hover:from-[var(--ivory)] hover:to-white",
        className,
      ].join(" ")}
      aria-pressed={active}
    >
      {/* Metal Swatch */}
      <div className={[
        "w-12 h-12 rounded-full mb-3 transition-all duration-300 border-2",
        "flex items-center justify-center relative overflow-hidden",
        active 
          ? "border-[var(--gold)] shadow-lg" 
          : "border-neutral-200 group-hover:border-[var(--gold)]"
      ].join(" ")}>
        <div 
          className="w-full h-full rounded-full"
          style={{ backgroundColor: swatchColor }}
        />
        {active && (
          <div className="absolute inset-0 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-[var(--gold)] text-lg">✓</span>
          </div>
        )}
      </div>
      
      {/* Label */}
      <span className={[
        "text-sm font-serif font-medium text-center leading-tight transition-colors duration-300",
        active 
          ? "text-[var(--gold)]" 
          : "text-neutral-700 group-hover:text-[var(--gold)]"
      ].join(" ")}>
        {label}
      </span>
    </button>
  );
}



