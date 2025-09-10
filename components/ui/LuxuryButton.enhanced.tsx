"use client";
import { forwardRef } from 'react';
import clsx from 'clsx';

interface LuxuryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  href?: string;
  isLoading?: boolean;
}

const LuxuryButton = forwardRef<HTMLButtonElement, LuxuryButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, isLoading, ...props }, ref) => {
    const baseClasses = `
      relative overflow-hidden
      font-medium tracking-[0.1em] uppercase
      transition-all duration-300 ease-out
      transform-gpu
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      group
    `;

    const variants = {
      primary: `
        bg-gradient-to-r from-elysium-obsidian to-elysium-charcoal
        text-white
        hover:from-elysium-charcoal hover:to-elysium-obsidian
        hover:scale-[1.02] hover:shadow-2xl
        focus:ring-elysium-gold
        before:absolute before:inset-0 before:bg-gradient-to-r 
        before:from-transparent before:via-white/10 before:to-transparent
        before:translate-x-[-100%] before:skew-x-12
        hover:before:translate-x-[100%] before:transition-transform before:duration-700
      `,
      secondary: `
        bg-white border-2 border-elysium-gold
        text-elysium-obsidian
        hover:bg-elysium-gold hover:text-white
        hover:scale-[1.02] hover:shadow-xl
        focus:ring-elysium-gold
      `,
      ghost: `
        bg-transparent border border-elysium-smoke/30
        text-elysium-charcoal
        hover:bg-elysium-whisper hover:border-elysium-gold/50
        hover:text-elysium-obsidian
        focus:ring-elysium-gold/50
      `,
      gold: `
        bg-gradient-to-r from-elysium-gold to-amber-500
        text-white
        hover:from-amber-500 hover:to-elysium-gold
        hover:scale-[1.02] hover:shadow-2xl hover:shadow-elysium-gold/25
        focus:ring-elysium-gold
        before:absolute before:inset-0 before:bg-gradient-to-r 
        before:from-transparent before:via-elysium-shimmer before:to-transparent
        before:translate-x-[-100%] before:skew-x-12
        hover:before:translate-x-[100%] before:transition-transform before:duration-700
      `
    };

    const sizes = {
      sm: 'px-4 py-2 text-xs rounded-lg',
      md: 'px-6 py-3 text-sm rounded-xl',
      lg: 'px-8 py-4 text-base rounded-2xl'
    };

    return (
      <button
        ref={ref}
        className={clsx(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        disabled={isLoading}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center">
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span>Loading...</span>
            </div>
          ) : (
            children
          )}
        </span>
      </button>
    );
  }
);

LuxuryButton.displayName = 'LuxuryButton';

export default LuxuryButton;