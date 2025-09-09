"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AccessibilityContextType {
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  focusVisible: boolean;
  announceChanges: (message: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

interface AccessibilityProviderProps {
  children: ReactNode;
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [focusVisible, setFocusVisible] = useState(false);

  // Detect user preferences
  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    // Check for high contrast preference
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');
    setHighContrast(contrastQuery.matches);
    
    const handleContrastChange = (e: MediaQueryListEvent) => setHighContrast(e.matches);
    contrastQuery.addEventListener('change', handleContrastChange);
    
    // Detect if user is using keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setFocusVisible(true);
      }
    };
    
    const handleMouseDown = () => {
      setFocusVisible(false);
    };
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      contrastQuery.removeEventListener('change', handleContrastChange);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  // Apply accessibility classes to document
  useEffect(() => {
    const classes = [];
    
    if (reducedMotion) classes.push('reduced-motion');
    if (highContrast) classes.push('high-contrast');
    if (focusVisible) classes.push('focus-visible-mode');
    
    classes.push(`font-size-${fontSize}`);
    
    document.documentElement.className = classes.join(' ');
  }, [reducedMotion, highContrast, fontSize, focusVisible]);

  const announceChanges = (message: string) => {
    // Create a live region for screen readers
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.textContent = message;
    
    document.body.appendChild(liveRegion);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(liveRegion);
    }, 1000);
  };

  const value: AccessibilityContextType = {
    reducedMotion,
    highContrast,
    fontSize,
    focusVisible,
    announceChanges,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
      
      {/* Screen reader only announcements */}
      <div id="aria-live-region" aria-live="polite" aria-atomic="true" className="sr-only" />
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
}

// Screen reader only utility class
export const srOnly = "sr-only absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0";