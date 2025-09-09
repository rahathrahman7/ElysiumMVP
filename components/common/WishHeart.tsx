"use client";
import useWishlist from "@/hooks/useWishlist";
import Image from "next/image";

export default function WishHeart({
  item,
  className = "",
  size = 28,
}: {
  item: { slug: string; name: string; price?: number | string; imageSrc?: string };
  className?: string;
  size?: number;
}) {
  const { has, toggle } = useWishlist();
  const active = has(item.slug);
  return (
    <button
      type="button"
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(item); }}
      className={`rounded-full bg-white/90 backdrop-blur-sm p-2 shadow-sm hover:bg-white hover:shadow-md transition-all duration-200 ${className}`}
      title={active ? "Wishlisted" : "Add to wishlist"}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className="transition-all duration-200"
      >
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          stroke="currentColor"
          strokeWidth="1.5"
          fill={active ? "currentColor" : "none"}
          className="transition-all duration-200"
        />
      </svg>
    </button>
  );
}
