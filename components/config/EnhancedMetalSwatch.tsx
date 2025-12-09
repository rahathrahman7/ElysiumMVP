"use client";
import { useState } from "react";

interface EnhancedMetalSwatchProps {
  label: string;
  color: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

const metalTextures: Record<string, string> = {
  yellow: "#FFD700",
  white: "#F8F9FA",
  rose: "#FFE4E6",
  platinum: "#F1F5F9"
};

const metalHighlights: Record<string, string> = {
  yellow: "rgba(255, 215, 0, 0.3)",
  white: "rgba(248, 249, 250, 0.8)",
  rose: "rgba(254, 202, 202, 0.4)",
  platinum: "rgba(203, 213, 225, 0.4)"
};

export default function EnhancedMetalSwatch({ 
  label, 
  color,
  active = false,
  disabled = false, 
  onClick, 
  className = "",
  size = 'md',
  showTooltip = true
}: EnhancedMetalSwatchProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltipState, setShowTooltipState] = useState(false);

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return "w-12 h-16";
      case 'lg':
        return "w-20 h-24";
      default:
        return "w-16 h-20";
    }
  };

  const getSwatchSize = () => {
    switch (size) {
      case 'sm':
        return "w-8 h-8";
      case 'lg':
        return "w-12 h-12";
      default:
        return "w-10 h-10";
    }
  };

  const metalKey = label.toLowerCase().replace(/\s+/g, '');
  const background = metalTextures[metalKey] || color;
  const highlight = metalHighlights[metalKey] || 'rgba(255, 255, 255, 0.3)';

  return (
    <div className="relative">
      <button
        onClick={() => !disabled && onClick?.()}
        disabled={disabled}
        onMouseEnter={() => {
          setIsHovered(true);
          if (showTooltip) setShowTooltipState(true);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          setShowTooltipState(false);
        }}
        className={[
          "group relative flex flex-col items-center justify-center rounded-[var(--radius-xl)] border-2 transition-all duration-300 overflow-hidden",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-gold)]/50",
          active
            ? "border-[var(--color-gold)] shadow-[var(--shadow-gold-lg)] ring-2 ring-[var(--color-gold)]/30 scale-105"
            : disabled
            ? "border-[var(--border-subtle)] opacity-50 cursor-not-allowed"
            : "border-[var(--border-default)] hover:border-[var(--color-gold)] hover:scale-105 hover:shadow-[var(--shadow-lg)]",
          getSizeClasses(),
          className,
        ].join(" ")}
        aria-pressed={active}
        aria-disabled={disabled}
        aria-label={`Select ${label} metal`}
      >
        {/* Selection Indicator */}
        {active && (
          <div className="absolute top-1 right-1 w-4 h-4 bg-[var(--color-gold)] rounded-full flex items-center justify-center animate-scale-in z-10">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-white">
              <polyline points="20,6 9,17 4,12"></polyline>
            </svg>
          </div>
        )}

        {/* Metal Swatch */}
        <div className={[
          "relative rounded-full border-2 border-white shadow-inner transition-all duration-300 overflow-hidden",
          "group-hover:scale-110 group-hover:shadow-lg",
          getSwatchSize()
        ].join(" ")}>
          {/* Base metal color/texture */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{ background }}
          />
          
          {/* Metallic highlight effect */}
          <div 
            className="absolute inset-0 rounded-full opacity-60 group-hover:opacity-80 transition-opacity duration-300"
            style={{ 
              background: `radial-gradient(circle at 30% 30%, ${highlight} 0%, transparent 70%)` 
            }}
          />
          
          {/* Shine effect on hover */}
          {isHovered && (
            <div 
              className="absolute inset-0 rounded-full animate-shimmer"
              style={{
                background: `linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.6) 50%, transparent 70%)`,
                backgroundSize: '200% 200%'
              }}
            />
          )}
        </div>
        
        {/* Label */}
        <span className={[
          "text-xs font-serif font-medium mt-2 text-center transition-colors duration-300 capitalize",
          size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-sm' : 'text-xs',
          active 
            ? "text-[var(--color-gold)]" 
            : disabled
            ? "text-[var(--color-ink-soft)]"
            : "text-[var(--color-ink)] group-hover:text-[var(--color-gold)]"
        ].join(" ")}>
          {label}
        </span>

        {/* Hover glow effect */}
        <div className="absolute inset-0 rounded-[var(--radius-xl)] bg-gradient-to-br from-[var(--color-gold)]/0 to-[var(--color-gold)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </button>

      {/* Tooltip */}
      {showTooltip && showTooltipState && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-[var(--color-ink)] text-[var(--color-white)] text-xs rounded-lg shadow-lg z-20 whitespace-nowrap animate-fade-in-up">
          {label} Gold
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[var(--color-ink)]"></div>
        </div>
      )}
    </div>
  );
}