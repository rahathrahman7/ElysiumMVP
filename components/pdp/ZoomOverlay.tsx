"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Img = { src: string; alt?: string; width?: number; height?: number };

interface ZoomOverlayProps {
  images: Img[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function ZoomOverlay({ images, index, onClose, onPrev, onNext }: ZoomOverlayProps) {
  const [currentIndex, setCurrentIndex] = useState(index);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  // Update current index when prop changes
  useEffect(() => {
    setCurrentIndex(index);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [index]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          onPrev();
          break;
        case "ArrowRight":
          onNext();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onPrev, onNext]);

  // Touch handlers for pinch and drag
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch start
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
      setDragStart({ x: distance, y: scale });
    } else if (e.touches.length === 1) {
      // Drag start
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    
    if (e.touches.length === 2) {
      // Pinch zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
      const scaleDiff = distance / dragStart.x;
      const newScale = Math.max(1, Math.min(3, dragStart.y * scaleDiff));
      setScale(newScale);
    } else if (e.touches.length === 1 && isDragging) {
      // Drag pan
      const newX = e.touches[0].clientX - dragStart.x;
      const newY = e.touches[0].clientY - dragStart.y;
      setPosition({ x: newX, y: newY });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    // Reset to bounds if needed
    if (scale < 1) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  const currentImage = images[currentIndex];

  return (
    <div className="zoom-overlay fixed inset-0 z-50 bg-black/95 backdrop-blur-sm">
      {/* Header with close button */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4">
        <div className="text-white text-sm">
          {currentIndex + 1} of {images.length}
        </div>
        <button
          onClick={onClose}
          className="rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition-colors"
          aria-label="Close zoom"
        >
          ✕
        </button>
      </div>

      {/* Image container */}
      <div className="flex h-full items-center justify-center p-4">
        <div
          ref={imageRef}
          className="image-container relative h-full w-full max-w-4xl"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            '--zoom-scale': scale,
            '--zoom-x': `${position.x}px`,
            '--zoom-y': `${position.y}px`,
          } as React.CSSProperties}
        >
          {currentImage.src && currentImage.src.trim() !== '' ? (
            <Image
              src={currentImage.src}
              alt={currentImage.alt || "Product image"}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-[var(--ivory)] text-neutral-500">
              <span className="text-xs">Image coming soon</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={onPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white hover:bg-white/30 transition-colors"
        aria-label="Previous image"
      >
        ←
      </button>
      <button
        onClick={onNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white hover:bg-white/30 transition-colors"
        aria-label="Next image"
      >
        →
      </button>

      {/* Thumbnail strip at bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4">
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img.src + i}
              onClick={() => setCurrentIndex(i)}
              className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
                i === currentIndex ? "border-white" : "border-white/30"
              }`}
            >
                          {img.src && img.src.trim() !== '' ? (
              <Image
                src={img.src}
                alt={img.alt || `Thumbnail ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center bg-[var(--ivory)] text-neutral-500">
                <span className="text-xs">—</span>
              </div>
            )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
