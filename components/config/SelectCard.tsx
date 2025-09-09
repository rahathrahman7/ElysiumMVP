"use client";
import { ReactNode } from "react";

interface SelectCardProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  children?: ReactNode;
  className?: string;
}

export default function SelectCard({ 
  label, 
  active = false, 
  onClick, 
  children, 
  className = "" 
}: SelectCardProps) {
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
      {/* Icon/Content Container */}
      <div className={[
        "w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all duration-300",
        active 
          ? "bg-[var(--gold)] text-white" 
          : "bg-neutral-100 text-neutral-600 group-hover:bg-[var(--gold)] group-hover:text-white"
      ].join(" ")}>
        {children || (
          <span className="text-xl">✨</span>
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



