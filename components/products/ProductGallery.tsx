"use client";

import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
  activeIndex: number;
  onThumbnailClick: (index: number) => void;
}

export function ProductGallery({ images, activeIndex, onThumbnailClick }: ProductGalleryProps) {
  return (
    <div className="space-y-6">
      {/* Main Image */}
      <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-50">
        {images[activeIndex] && (
          <Image
            src={images[activeIndex]}
            alt="Product image"
            fill
            className="object-cover object-center"
            priority={activeIndex === 0}
          />
        )}
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-3">
        {images.map((image, index) => (
          <button
            key={image}
            onClick={() => onThumbnailClick(index)}
            className={`aspect-square relative overflow-hidden rounded-lg border-2 transition-all ${
              activeIndex === index
                ? "border-[#45321e] ring-2 ring-[#45321e]/20"
                : "border-gray-200 hover:border-[#45321e]"
            }`}
          >
            <Image
              src={image}
              alt={`Product image ${index + 1}`}
              fill
              className="object-cover object-center"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
