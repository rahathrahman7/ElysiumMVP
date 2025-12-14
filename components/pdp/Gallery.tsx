"use client";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import ZoomOverlay from "./ZoomOverlay";

type Img = { src: string; alt?: string; width?: number; height?: number };
export default function Gallery({
  images = [],
  className = "",
}: {
  images: Img[];
  className?: string;
}) {
  const safe = images?.length ? images : [{ src: "/products/placeholder.svg", alt: "Image coming soon" }];
  const [index, setIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  
  // Mobile touch handling
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const minSwipeDistance = 50;

  const prev = () => setIndex((i) => (i - 1 + safe.length) % safe.length);
  const next = () => setIndex((i) => (i + 1) % safe.length);

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && safe.length > 1) {
      next();
    }
    if (isRightSwipe && safe.length > 1) {
      prev();
    }

    setIsDragging(false);
  };

  // keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (zoomOpen) return; // overlay handles its own keys
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomOpen, safe.length]);

  // Preload neighbors
  const preload = useMemo(() => {
    const n = (index + 1) % safe.length;
    const p = (index - 1 + safe.length) % safe.length;
    return [safe[n]?.src, safe[p]?.src].filter((src) => src && src.trim() !== '') as string[];
  }, [index, safe]);

  useEffect(() => {
    preload.forEach((src) => {
      if (src && src.trim() !== '') {
        const i = new window.Image();
        i.src = src;
      }
    });
  }, [preload]);

  const current = safe[index];

  return (
    <div className={`w-full ${className}`}>
      {/* Main image */}
      <div
        ref={mainRef}
        className="gallery-main-image relative aspect-square w-full overflow-hidden border border-neutral-200"
        style={{ backgroundColor: '#E8E2DA' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <button
          type="button"
          aria-label="Open zoom"
          onClick={() => setZoomOpen(true)}
          className="absolute inset-0 group touch-manipulation"
        >
          {current.src && current.src.trim() !== '' ? (
            <Image
              key={current.src}
              src={current.src}
              alt={current.alt || "Product image"}
              fill
              sizes="(min-width:1024px) 50vw, 100vw"
              className="object-contain p-4 transition-transform duration-300 ease-out group-hover:scale-[1.02]"
              priority={index === 0}
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-neutral-500" style={{ backgroundColor: '#E8E2DA' }}>
              <span className="text-xs">Image coming soon</span>
            </div>
          )}
          {/* Soft gradient top & bottom for depth */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/0" />
        </button>

        {/* Prev/Next controls (desktop) */}
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center p-2">
          <button
            type="button"
            onClick={prev}
            className="gallery-nav-control pointer-events-auto hidden md:grid h-9 w-9 place-items-center rounded-full bg-white/80 text-neutral-800 shadow hover:bg-white touch-manipulation"
            aria-label="Previous image"
          >
            ←
          </button>
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center p-2">
          <button
            type="button"
            onClick={next}
            className="gallery-nav-control pointer-events-auto hidden md:grid h-9 w-9 place-items-center rounded-full bg-white/80 text-neutral-800 shadow hover:bg-white touch-manipulation"
            aria-label="Next image"
          >
            →
          </button>
        </div>

        {/* Mobile swipe indicator */}
        {safe.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-xs bg-black/40 px-3 py-1 rounded-full backdrop-blur md:hidden animate-bounce-gentle">
            Swipe to browse
          </div>
        )}

        {/* Image counter for mobile */}
        {safe.length > 1 && (
          <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded-full text-xs md:hidden">
            {index + 1}/{safe.length}
          </div>
        )}
      </div>

      {/* Thumbs */}
      <div className="mt-3 grid grid-cols-5 gap-2 md:grid-cols-6">
        {safe.map((img, i) => {
          const active = i === index;
          return (
            <button
              key={img.src + i}
              type="button"
              onClick={() => setIndex(i)}
              aria-current={active ? "true" : "false"}
              className={[
                "gallery-thumbnail relative aspect-square overflow-hidden rounded-xl border touch-manipulation",
                active ? "border-[var(--gold)] active ring-2 ring-gold/20" : "border-neutral-200 hover:border-[var(--gold)]",
              ].join(" ")}
            >
              {img.src && img.src.trim() !== '' ? (
                <Image
                  src={img.src}
                  alt={img.alt || `Thumbnail ${i + 1}`}
                  fill
                  sizes="120px"
                  className="object-cover"
                  loading={i === 0 ? "eager" : "lazy"}
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-neutral-500" style={{ backgroundColor: '#E8E2DA' }}>
                  <span className="text-xs">—</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Zoom overlay */}
      {zoomOpen && (
        <ZoomOverlay images={safe} index={index} onClose={() => setZoomOpen(false)} onPrev={prev} onNext={next} />
      )}
    </div>
  );
}
