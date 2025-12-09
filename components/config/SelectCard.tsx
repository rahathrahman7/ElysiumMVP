"use client";
import { ReactNode } from "react";
import Image from "next/image";

interface SelectCardProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  children?: ReactNode;
  className?: string;
  iconSrc?: string;
}

export default function SelectCard({
  label,
  active = false,
  onClick,
  children,
  className = "",
  iconSrc
}: SelectCardProps) {
  return (
    <button
      onClick={onClick}
      className={[
        "group relative flex flex-col items-center justify-center w-28 h-32 rounded-2xl border-2 transition-all duration-300",
        "hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2",
        active
          ? "border-[var(--gold)] bg-[var(--ivory)] shadow-lg ring-2 ring-[var(--gold)]/20"
          : "border-neutral-200 bg-white hover:border-[var(--gold)] hover:bg-[var(--gold)] hover:shadow-md",
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
        {iconSrc ? (
          <Image
            src={iconSrc}
            alt={label}
            width={28}
            height={28}
            className="transition-all duration-300"
          />
        ) : children ? (
          children
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
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









