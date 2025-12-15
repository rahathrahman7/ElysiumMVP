"use client";

import Image from "next/image";
import { MetalOption } from "@/lib/productTypes";
import { useState } from "react";

interface MetalSwatchProps {
  metal: MetalOption;
  isSelected: boolean;
  onSelect: (metal: MetalOption) => void;
  onHover?: (metalName?: string) => void;
  size?: "xs" | "sm" | "md" | "lg";
  showLabel?: boolean;
  groupName?: string;
  variant?: "square" | "circle";
}

export default function MetalSwatch({
  metal,
  isSelected,
  onSelect,
  onHover,
  size = "md",
  showLabel = true,
  groupName = "metal-selection",
  variant = "circle",
}: MetalSwatchProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Debug: Log image loading issues
  const handleImageError = () => {
    console.warn(`Failed to load swatch image: ${metal.imageUrl} for metal: ${metal.name}`);
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // Size variants - smaller, more subtle icons
  const sizeClasses = {
    xs: "w-5 h-5",
    sm: "w-7 h-7",
    md: "w-8 h-8",
    lg: "w-9 h-9",
  };

  const labelSizes = {
    xs: "text-[9px]",
    sm: "text-[11px]",
    md: "text-xs",
    lg: "text-xs",
  };

  // Format label - clean display name
  const getDisplayName = (name: string) => {
    return name
      .replace('18k ', '')
      .replace(/Two-Tone:?\s*/g, '')  // Handle both "Two-Tone " and "Two-Tone: "
      .toUpperCase();
  };

  return (
    <label
      className="flex flex-col items-center cursor-pointer group"
      onMouseEnter={() => onHover?.(metal.name)}
      onMouseLeave={() => onHover?.(undefined)}
    >
      {/* Hidden radio input for accessibility */}
      <input
        type="radio"
        name={groupName}
        value={metal.name}
        checked={isSelected}
        onChange={() => onSelect(metal)}
        className="sr-only"
        aria-label={metal.name}
      />

      {/* Swatch container */}
      <div
        className={`
          relative ${sizeClasses[size]}
          ${variant === "circle" ? "rounded-full" : "rounded-lg"}
          overflow-hidden
          transition-all duration-300 ease-out
          ${isSelected
            ? "ring-[2px] ring-[#D4AF37] ring-offset-[3px] ring-offset-white shadow-md"
            : "ring-1 ring-[#E8E4DF] group-hover:ring-[#D4AF37]/40 group-hover:shadow-sm group-hover:scale-[1.08]"
          }
        `}
      >
        {/* Loading state - show HEX color while image loads */}
        {imageLoading && metal.imageUrl && !imageError && (
          <div
            className="absolute inset-0 w-full h-full"
            style={{ backgroundColor: metal.hex || "#CCCCCC" }}
          />
        )}
        
        {/* Display image or fallback to HEX */}
        {metal.imageUrl && !imageError ? (
          <Image
            src={metal.imageUrl}
            alt={metal.name}
            width={56}
            height={56}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onError={handleImageError}
            onLoad={handleImageLoad}
            quality={75}
            loading="lazy"
            sizes="56px"
            unoptimized={metal.imageUrl?.includes('/swatches/')}
            priority={false}
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ backgroundColor: metal.hex || "#CCCCCC" }}
          />
        )}
      </div>

      {/* Label */}
      {showLabel && (
        <span
          className={`
            mt-3 text-center font-serif ${labelSizes[size]}
            tracking-[0.1em] leading-tight
            transition-colors duration-200
            ${isSelected ? "text-[#D4AF37] font-medium" : "text-[#6D3D0D]/50 group-hover:text-[#6D3D0D]/70"}
          `}
        >
          {getDisplayName(metal.name)}
        </span>
      )}
    </label>
  );
}
