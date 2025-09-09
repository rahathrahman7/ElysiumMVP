"use client";
import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  interactionTime: number;
  isLoading: boolean;
}

export function usePerformance() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    interactionTime: 0,
    isLoading: true,
  });

  useEffect(() => {
    const measurePerformance = () => {
      if (typeof window === 'undefined' || !window.performance) return;

      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.fetchStart;
        const renderTime = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
        
        setMetrics({
          loadTime: Math.round(loadTime),
          renderTime: Math.round(renderTime),
          interactionTime: 0, // Will be updated by user interactions
          isLoading: false,
        });
      }
    };

    // Wait for the page to fully load
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
      return () => window.removeEventListener('load', measurePerformance);
    }
  }, []);

  const measureInteraction = (interactionName: string) => {
    if (typeof window === 'undefined' || !window.performance) return;

    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const interactionTime = Math.round(endTime - startTime);
      
      setMetrics(prev => ({
        ...prev,
        interactionTime,
      }));

      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`${interactionName} took ${interactionTime}ms`);
      }
    };
  };

  return {
    ...metrics,
    measureInteraction,
  };
}

// Hook for measuring Core Web Vitals
interface WebVitals {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint
  ttfb: number; // Time to First Byte
}

export function useWebVitals() {
  const [vitals, setVitals] = useState<Partial<WebVitals>>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Measure TTFB
    const measureTTFB = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        const ttfb = navigation.responseStart - navigation.requestStart;
        setVitals(prev => ({ ...prev, ttfb: Math.round(ttfb) }));
      }
    };

    // Measure FCP
    const measureFCP = () => {
      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        setVitals(prev => ({ ...prev, fcp: Math.round(fcpEntry.startTime) }));
      }
    };

    // Measure LCP using PerformanceObserver
    const measureLCP = () => {
      if ('PerformanceObserver' in window) {
        try {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            if (lastEntry) {
              setVitals(prev => ({ ...prev, lcp: Math.round(lastEntry.startTime) }));
            }
          });
          observer.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (error) {
          // PerformanceObserver not supported
        }
      }
    };

    // Measure CLS
    const measureCLS = () => {
      if ('PerformanceObserver' in window) {
        try {
          let clsValue = 0;
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
                clsValue += (entry as any).value;
              }
            }
            setVitals(prev => ({ ...prev, cls: Math.round(clsValue * 1000) / 1000 }));
          });
          observer.observe({ entryTypes: ['layout-shift'] });
        } catch (error) {
          // PerformanceObserver not supported
        }
      }
    };

    // Measure FID
    const measureFID = () => {
      if ('PerformanceObserver' in window) {
        try {
          const observer = new PerformanceObserver((list) => {
            const firstInput = list.getEntries()[0];
            if (firstInput) {
              const fid = (firstInput as any).processingStart - firstInput.startTime;
              setVitals(prev => ({ ...prev, fid: Math.round(fid) }));
            }
          });
          observer.observe({ entryTypes: ['first-input'] });
        } catch (error) {
          // PerformanceObserver not supported
        }
      }
    };

    measureTTFB();
    measureFCP();
    measureLCP();
    measureCLS();
    measureFID();
  }, []);

  // Get performance grade based on Core Web Vitals thresholds
  const getPerformanceGrade = (): 'good' | 'needs-improvement' | 'poor' => {
    const { lcp = 0, fid = 0, cls = 0 } = vitals;
    
    const lcpGood = lcp <= 2500;
    const fidGood = fid <= 100;
    const clsGood = cls <= 0.1;
    
    if (lcpGood && fidGood && clsGood) return 'good';
    if (lcp <= 4000 && fid <= 300 && cls <= 0.25) return 'needs-improvement';
    return 'poor';
  };

  return {
    vitals,
    grade: getPerformanceGrade(),
    isComplete: Object.keys(vitals).length >= 3,
  };
}

// Hook for monitoring bundle size and loading performance
export function useBundleMetrics() {
  const [metrics, setMetrics] = useState({
    jsSize: 0,
    cssSize: 0,
    totalRequests: 0,
    cacheHitRate: 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.performance) return;

    const calculateBundleSize = () => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      
      let jsSize = 0;
      let cssSize = 0;
      let totalRequests = resources.length;
      let cachedResources = 0;

      resources.forEach(resource => {
        const transferSize = resource.transferSize || 0;
        
        if (resource.name.endsWith('.js') || resource.name.includes('/_next/static/chunks/')) {
          jsSize += transferSize;
        } else if (resource.name.endsWith('.css')) {
          cssSize += transferSize;
        }
        
        // Check if resource was served from cache
        if (transferSize === 0 && resource.decodedBodySize > 0) {
          cachedResources++;
        }
      });

      const cacheHitRate = totalRequests > 0 ? (cachedResources / totalRequests) * 100 : 0;

      setMetrics({
        jsSize: Math.round(jsSize / 1024), // Convert to KB
        cssSize: Math.round(cssSize / 1024), // Convert to KB
        totalRequests,
        cacheHitRate: Math.round(cacheHitRate),
      });
    };

    // Wait for resources to load
    window.addEventListener('load', calculateBundleSize);
    return () => window.removeEventListener('load', calculateBundleSize);
  }, []);

  return metrics;
}

// Development-only performance logger
export function usePerformanceLogger(enabled: boolean = process.env.NODE_ENV === 'development') {
  const { vitals, grade } = useWebVitals();
  const bundleMetrics = useBundleMetrics();

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const logPerformance = () => {
      console.group('🚀 ELYSIUM Performance Metrics');
      console.log('Core Web Vitals:', vitals);
      console.log('Performance Grade:', grade);
      console.log('Bundle Metrics:', bundleMetrics);
      console.log('Memory Usage:', (performance as any).memory);
      console.groupEnd();
    };

    // Log after everything loads
    window.addEventListener('load', () => {
      setTimeout(logPerformance, 1000);
    });
  }, [enabled, vitals, grade, bundleMetrics]);
}