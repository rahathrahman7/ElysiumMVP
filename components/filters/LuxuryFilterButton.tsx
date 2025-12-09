"use client";
import { ReactNode } from "react";

interface LuxuryFilterButtonProps {
  children: ReactNode;
  active: boolean;
  onClick: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function LuxuryFilterButton({ 
  children, 
  active, 
  onClick, 
  className = "",
  size = "md" 
}: LuxuryFilterButtonProps) {
  const sizeClasses = {
    sm: "w-20 h-24",
    md: "w-24 h-28", 
    lg: "w-28 h-32"
  };

  return (
    <button
      onClick={onClick}
      className={`group flex flex-col items-center justify-center rounded-full border transition-all duration-200 ease-in-out ${sizeClasses[size]} ${className}
        ${active
          ? "border-[#D4AF37] bg-[#FAF9F6] shadow-md scale-105 ring-2 ring-[#D4AF37]/20"
          : "border-gray-200 bg-white hover:border-[#D4AF37] hover:shadow-sm hover:scale-105"
        }
      `}
    >
      {children}
    </button>
  );
}














