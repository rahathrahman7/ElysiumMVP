"use client";
import { ReactNode, useState } from "react";

interface EnhancedSelectCardProps {
  label: string;
  description?: string;
  active?: boolean;
  disabled?: boolean;
  count?: number;
  onClick?: () => void;
  children?: ReactNode;
  className?: string;
  variant?: 'default' | 'compact' | 'large';
  showRipple?: boolean;
}

export default function EnhancedSelectCard({ 
  label, 
  description,
  active = false, 
  disabled = false,
  count,
  onClick, 
  children, 
  className = "",
  variant = 'default',
  showRipple = true
}: EnhancedSelectCardProps) {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    
    if (showRipple) {
      const rect = e.currentTarget.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      const newRipple = { id: Date.now(), x, y };
      
      setRipples(prev => [...prev, newRipple]);
      
      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
      }, 600);
    }
    
    onClick?.();
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'compact':
        return "w-20 h-24";
      case 'large':
        return "w-36 h-40";
      default:
        return "w-28 h-32";
    }
  };

  const getIconSize = () => {
    switch (variant) {
      case 'compact':
        return "w-8 h-8";
      case 'large':
        return "w-16 h-16";
      default:
        return "w-12 h-12";
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={[
        "group relative flex flex-col items-center justify-center rounded-[var(--radius-2xl)] border-2 transition-all duration-300 overflow-hidden",
        "hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-gold)]/50",
        active
          ? "border-[var(--color-gold)] bg-[var(--color-ivory)] shadow-[var(--shadow-gold-md)] ring-2 ring-[var(--color-gold)]/30 animate-luxury-glow"
          : disabled
          ? "border-[var(--border-subtle)] bg-[var(--surface-card)] opacity-50 cursor-not-allowed"
          : "border-[var(--border-default)] bg-[var(--surface-card)] hover:border-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:shadow-[var(--shadow-md)]",
        getVariantClasses(),
        className,
      ].join(" ")}
      aria-pressed={active}
      aria-disabled={disabled}
    >
      {/* Ripple Effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute animate-ping rounded-full bg-[var(--color-gold)]/30 pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 100,
            height: 100,
          }}
        />
      ))}

      {/* Selection Indicator */}
      {active && (
        <div className="absolute top-2 right-2 w-5 h-5 bg-[var(--color-gold)] rounded-full flex items-center justify-center animate-scale-in">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-white">
            <polyline points="20,6 9,17 4,12"></polyline>
          </svg>
        </div>
      )}

      {/* Count Badge */}
      {count && count > 0 && (
        <div className="absolute top-2 left-2 min-w-5 h-5 bg-[var(--color-gold)] text-white text-xs font-bold rounded-full flex items-center justify-center px-1 animate-bounce">
          {count}
        </div>
      )}

      {/* Icon/Content Container */}
      <div className={[
        "rounded-full flex items-center justify-center mb-3 transition-all duration-300",
        active 
          ? "bg-[var(--color-gold)] text-white shadow-[var(--shadow-gold-sm)] animate-heartbeat" 
          : disabled
          ? "bg-[var(--border-subtle)] text-[var(--color-ink-soft)]"
          : "bg-[var(--color-ivory)] text-[var(--color-ink-soft)] group-hover:bg-[var(--color-gold)] group-hover:text-white group-hover:shadow-[var(--shadow-gold-sm)] group-hover:scale-110",
        getIconSize()
      ].join(" ")}>
        {children || (
          <svg
            className={variant === 'large' ? 'w-8 h-8' : variant === 'compact' ? 'w-5 h-5' : 'w-6 h-6'}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        )}
      </div>
      
      {/* Label */}
      <div className="text-center px-2">
        <span className={[
          "font-serif font-medium leading-tight transition-colors duration-300",
          variant === 'large' ? 'text-base' : variant === 'compact' ? 'text-xs' : 'text-sm',
          active 
            ? "text-[var(--color-gold)]" 
            : disabled
            ? "text-[var(--color-ink-soft)]"
            : "text-[var(--color-ink)] group-hover:text-[var(--color-gold)]"
        ].join(" ")}>
          {label}
        </span>
        
        {description && variant !== 'compact' && (
          <p className={[
            "text-xs text-[var(--color-ink-soft)] mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
            variant === 'large' ? 'text-sm' : 'text-xs'
          ].join(" ")}>
            {description}
          </p>
        )}
      </div>

    </button>
  );
}