"use client";
import { useState, useRef, useEffect, TouchEvent } from 'react';
import Image from 'next/image';

interface MobileGalleryProps {
  images: Array<{ src: string; alt: string }>;
  className?: string;
}

export default function MobileGallery({ images, className = "" }: MobileGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const minSwipeDistance = 50;

  const handleTouchStart = (e: TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    const currentTouch = e.targetTouches[0].clientX;
    const diff = touchStart - currentTouch;
    setTouchEnd(currentTouch);
    setDragOffset(-diff);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }

    setIsDragging(false);
    setDragOffset(0);
    setTouchStart(0);
    setTouchEnd(0);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main Gallery */}
      <div 
        ref={containerRef}
        className="relative overflow-hidden rounded-2xl bg-gray-100 aspect-square"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="flex transition-transform duration-300 ease-out h-full"
          style={{ 
            transform: `translateX(${-currentIndex * 100 + (isDragging ? dragOffset / 3 : 0)}%)` 
          }}
        >
          {images.map((image, index) => (
            <div key={index} className="w-full h-full flex-shrink-0 relative">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover select-none"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={index === 0}
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* Navigation Arrows (Hidden on small screens) */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-charcoal hover:bg-white transition-all touch-manipulation hidden sm:flex"
              aria-label="Previous image"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15,18 9,12 15,6"></polyline>
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-charcoal hover:bg-white transition-all touch-manipulation hidden sm:flex"
              aria-label="Next image"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9,18 15,12 9,6"></polyline>
              </svg>
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Dots Indicator */}
      {images.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 touch-manipulation ${
                index === currentIndex 
                  ? 'bg-gold scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Thumbnail Strip (Mobile) */}
      {images.length > 1 && (
        <div className="mt-4 sm:hidden">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all touch-manipulation ${
                  index === currentIndex 
                    ? 'border-gold ring-2 ring-gold/20' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Image
                  src={image.src}
                  alt={`Thumbnail ${index + 1}`}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Swipe Instruction (Show only on first load) */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-xs bg-black/40 px-3 py-1 rounded-full backdrop-blur animate-bounce-gentle sm:hidden">
          Swipe to browse
        </div>
      )}
    </div>
  );
}