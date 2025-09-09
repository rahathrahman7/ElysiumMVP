"use client";
import Image, { ImageProps } from "next/image";
import { useState, useRef, useEffect } from "react";

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  fallbackSrc?: string;
  showSkeleton?: boolean;
  blurDataURL?: string;
  priority?: boolean;
  quality?: number;
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  onError?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  className?: string;
  containerClassName?: string;
}

export function OptimizedImage({
  src,
  alt,
  fallbackSrc = "/images/placeholder-ring.jpg",
  showSkeleton = true,
  blurDataURL,
  priority = false,
  quality = 85,
  onLoad,
  onError,
  className = "",
  containerClassName = "",
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return; // Don't lazy load priority images
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px 0px' // Load images 50px before they come into view
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  // Generate low-quality placeholder if not provided
  const generateBlurDataURL = (width: number = 40, height: number = 40) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Create a simple gradient as placeholder
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#FAF7F2');
      gradient.addColorStop(1, '#E8E2DA');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }
    
    return canvas.toDataURL();
  };

  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoading(false);
    setError(false);
    onLoad?.(event);
  };

  const handleError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setError(true);
    setIsLoading(false);
    setCurrentSrc(fallbackSrc);
    onError?.(event);
  };

  const defaultBlurDataURL = blurDataURL || generateBlurDataURL();

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${containerClassName}`}
    >
      {/* Loading Skeleton */}
      {isLoading && showSkeleton && (
        <div 
          className={`absolute inset-0 loading-skeleton rounded-lg ${
            isLoading ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-300`}
          aria-hidden="true"
        />
      )}

      {/* Image */}
      {isInView && (
        <Image
          src={currentSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          } ${className}`}
          placeholder={blurDataURL || defaultBlurDataURL ? "blur" : "empty"}
          blurDataURL={blurDataURL || defaultBlurDataURL}
          priority={priority}
          quality={quality}
          {...props}
        />
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-ivory)] text-[var(--color-ink-soft)]">
          <div className="text-center">
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
              className="mx-auto mb-2 opacity-50"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21,15 16,10 5,21"/>
            </svg>
            <p className="text-xs">Image unavailable</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Hook for preloading images
export function useImagePreloader(sources: string[]) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<Set<string>>(new Set());

  useEffect(() => {
    const preloadImage = (src: string) => {
      return new Promise<void>((resolve) => {
        const img = new window.Image();
        
        img.onload = () => {
          setLoadedImages(prev => new Set(prev).add(src));
          resolve();
        };
        
        img.onerror = () => {
          setErrors(prev => new Set(prev).add(src));
          resolve();
        };
        
        img.src = src;
      });
    };

    // Preload all images
    Promise.all(sources.map(preloadImage));
  }, [sources]);

  return {
    isLoaded: (src: string) => loadedImages.has(src),
    hasError: (src: string) => errors.has(src),
    loadedCount: loadedImages.size,
    totalCount: sources.length,
    progress: sources.length > 0 ? loadedImages.size / sources.length : 1
  };
}

// Progressive image loading for galleries
export interface ProgressiveImageProps extends OptimizedImageProps {
  thumbnailSrc?: string;
  highResSrc?: string;
}

export function ProgressiveImage({
  src,
  thumbnailSrc,
  highResSrc,
  alt,
  className = "",
  ...props
}: ProgressiveImageProps) {
  const [currentSrc, setCurrentSrc] = useState(thumbnailSrc || src);
  const [isHighResLoaded, setIsHighResLoaded] = useState(false);

  useEffect(() => {
    if (!highResSrc) return;

    const img = new window.Image();
    img.onload = () => {
      setCurrentSrc(highResSrc);
      setIsHighResLoaded(true);
    };
    img.src = highResSrc;
  }, [highResSrc]);

  return (
    <OptimizedImage
      src={currentSrc}
      alt={alt}
      className={`transition-all duration-500 ${
        !isHighResLoaded && highResSrc ? 'filter blur-sm scale-105' : ''
      } ${className}`}
      {...props}
    />
  );
}