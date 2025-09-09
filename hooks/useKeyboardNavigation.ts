"use client";
import { useEffect, useRef, RefObject } from 'react';

interface UseKeyboardNavigationOptions {
  onEscape?: () => void;
  onEnter?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onTab?: (direction: 'forward' | 'backward') => void;
  trapFocus?: boolean;
  autoFocus?: boolean;
}

export function useKeyboardNavigation(
  containerRef: RefObject<HTMLElement>,
  options: UseKeyboardNavigationOptions = {}
) {
  const {
    onEscape,
    onEnter,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onTab,
    trapFocus = false,
    autoFocus = false,
  } = options;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          if (onEscape) {
            event.preventDefault();
            onEscape();
          }
          break;
        
        case 'Enter':
          if (onEnter) {
            event.preventDefault();
            onEnter();
          }
          break;
        
        case 'ArrowUp':
          if (onArrowUp) {
            event.preventDefault();
            onArrowUp();
          }
          break;
        
        case 'ArrowDown':
          if (onArrowDown) {
            event.preventDefault();
            onArrowDown();
          }
          break;
        
        case 'ArrowLeft':
          if (onArrowLeft) {
            event.preventDefault();
            onArrowLeft();
          }
          break;
        
        case 'ArrowRight':
          if (onArrowRight) {
            event.preventDefault();
            onArrowRight();
          }
          break;
        
        case 'Tab':
          if (trapFocus) {
            handleTabKey(event, container);
          }
          if (onTab) {
            onTab(event.shiftKey ? 'backward' : 'forward');
          }
          break;
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    // Auto focus first focusable element
    if (autoFocus) {
      const firstFocusable = getFocusableElements(container)[0];
      if (firstFocusable) {
        setTimeout(() => firstFocusable.focus(), 0);
      }
    }

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    containerRef,
    onEscape,
    onEnter,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onTab,
    trapFocus,
    autoFocus,
  ]);
}

function handleTabKey(event: KeyboardEvent, container: HTMLElement) {
  const focusableElements = getFocusableElements(container);
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey) {
    // Shift + Tab
    if (document.activeElement === firstElement) {
      event.preventDefault();
      lastElement?.focus();
    }
  } else {
    // Tab
    if (document.activeElement === lastElement) {
      event.preventDefault();
      firstElement?.focus();
    }
  }
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'textarea:not([disabled])',
    'select:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(', ');

  return Array.from(container.querySelectorAll(focusableSelectors)).filter(
    (element) => {
      const el = element as HTMLElement;
      return (
        el.offsetWidth > 0 &&
        el.offsetHeight > 0 &&
        window.getComputedStyle(el).visibility !== 'hidden'
      );
    }
  ) as HTMLElement[];
}

// Hook for managing focus restoration
export function useFocusRestore() {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const saveFocus = () => {
    previousFocusRef.current = document.activeElement as HTMLElement;
  };

  const restoreFocus = () => {
    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  };

  return { saveFocus, restoreFocus };
}

// Hook for roving tabindex pattern
export function useRovingTabindex(
  containerRef: RefObject<HTMLElement>,
  orientation: 'horizontal' | 'vertical' | 'grid' = 'horizontal'
) {
  const currentIndexRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateTabindex = (newIndex: number) => {
      const items = getFocusableElements(container);
      items.forEach((item, index) => {
        item.setAttribute('tabindex', index === newIndex ? '0' : '-1');
      });
      currentIndexRef.current = newIndex;
      items[newIndex]?.focus();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const items = getFocusableElements(container);
      const currentIndex = currentIndexRef.current;
      
      let newIndex = currentIndex;

      switch (event.key) {
        case 'ArrowRight':
          if (orientation === 'horizontal' || orientation === 'grid') {
            event.preventDefault();
            newIndex = (currentIndex + 1) % items.length;
          }
          break;
        
        case 'ArrowLeft':
          if (orientation === 'horizontal' || orientation === 'grid') {
            event.preventDefault();
            newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
          }
          break;
        
        case 'ArrowDown':
          if (orientation === 'vertical' || orientation === 'grid') {
            event.preventDefault();
            if (orientation === 'grid') {
              // Calculate grid dimensions (assuming square grid)
              const gridSize = Math.ceil(Math.sqrt(items.length));
              newIndex = Math.min(currentIndex + gridSize, items.length - 1);
            } else {
              newIndex = (currentIndex + 1) % items.length;
            }
          }
          break;
        
        case 'ArrowUp':
          if (orientation === 'vertical' || orientation === 'grid') {
            event.preventDefault();
            if (orientation === 'grid') {
              // Calculate grid dimensions (assuming square grid)
              const gridSize = Math.ceil(Math.sqrt(items.length));
              newIndex = Math.max(currentIndex - gridSize, 0);
            } else {
              newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
            }
          }
          break;
        
        case 'Home':
          event.preventDefault();
          newIndex = 0;
          break;
        
        case 'End':
          event.preventDefault();
          newIndex = items.length - 1;
          break;
      }

      if (newIndex !== currentIndex) {
        updateTabindex(newIndex);
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    // Initialize tabindex
    updateTabindex(0);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [containerRef, orientation]);
}