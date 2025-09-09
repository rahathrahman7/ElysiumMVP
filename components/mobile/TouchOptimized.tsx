"use client";
import { useState, useRef, useEffect, TouchEvent } from 'react';

interface TouchOptimizedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function TouchOptimizedButton({ 
  children, 
  onClick, 
  className = "", 
  disabled = false,
  variant = 'primary' 
}: TouchOptimizedButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleTouchStart = (e: TouchEvent) => {
    if (disabled) return;
    setIsPressed(true);
    
    // Create ripple effect
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      const newRipple = { id: Date.now(), x, y };
      
      setRipples(prev => [...prev, newRipple]);
      
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
      }, 600);
    }
  };

  const handleTouchEnd = () => {
    setIsPressed(false);
    if (!disabled && onClick) {
      onClick();
    }
  };

  const variantClasses = {
    primary: 'bg-gold text-white hover:bg-gold/90 active:bg-gold/80',
    secondary: 'bg-white border-2 border-gold text-gold hover:bg-gold hover:text-white',
    ghost: 'bg-transparent text-charcoal hover:bg-gray-100 active:bg-gray-200'
  };

  return (
    <button
      ref={buttonRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative overflow-hidden min-h-[44px] px-6 py-3 rounded-lg font-medium
        transition-all duration-150 select-none touch-manipulation
        ${variantClasses[variant]}
        ${isPressed ? 'scale-95' : 'scale-100'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full animate-ping pointer-events-none"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
          }}
        />
      ))}
      
      <span className="relative z-10">{children}</span>
    </button>
  );
}

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  className?: string;
  threshold?: number;
}

export function SwipeableCard({ 
  children, 
  onSwipeLeft, 
  onSwipeRight, 
  className = "",
  threshold = 50 
}: SwipeableCardProps) {
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    setCurrentX(e.touches[0].clientX - startX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    const deltaX = currentX;
    
    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (deltaX < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    }
    
    setCurrentX(0);
    setIsDragging(false);
  };

  return (
    <div
      ref={cardRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`
        transform transition-transform duration-150
        ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
        touch-manipulation
        ${className}
      `}
      style={{
        transform: `translateX(${currentX}px)`,
      }}
    >
      {children}
    </div>
  );
}

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startY, setStartY] = useState(0);
  const threshold = 80;

  const handleTouchStart = (e: TouchEvent) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (window.scrollY === 0 && startY > 0) {
      const currentY = e.touches[0].clientY;
      const distance = Math.max(0, currentY - startY);
      setPullDistance(Math.min(distance, threshold * 1.5));
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    setPullDistance(0);
    setStartY(0);
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative"
    >
      {/* Pull indicator */}
      {pullDistance > 0 && (
        <div 
          className="absolute top-0 left-0 right-0 flex items-center justify-center bg-ivory/95 backdrop-blur transition-all duration-150 z-10"
          style={{ height: `${pullDistance}px` }}
        >
          {pullDistance >= threshold ? (
            <div className="flex items-center text-gold">
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                className={isRefreshing ? 'animate-spin' : ''}
              >
                <polyline points="23 4 23 10 17 10"></polyline>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
              </svg>
              <span className="ml-2 text-sm font-medium">
                {isRefreshing ? 'Refreshing...' : 'Release to refresh'}
              </span>
            </div>
          ) : (
            <div className="flex items-center text-gray-500">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="8 18 12 22 16 18"></polyline>
                <polyline points="8 6 12 2 16 6"></polyline>
                <line x1="12" y1="2" x2="12" y2="22"></line>
              </svg>
              <span className="ml-2 text-sm">Pull to refresh</span>
            </div>
          )}
        </div>
      )}
      
      <div style={{ transform: `translateY(${pullDistance}px)` }}>
        {children}
      </div>
    </div>
  );
}