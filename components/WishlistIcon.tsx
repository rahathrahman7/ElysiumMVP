"use client";
import Link from "next/link";
import useWishlist from "@/hooks/useWishlist";

export function WishlistIcon() {
  const { items } = useWishlist();
  const count = items.length;
  
  return (
    <Link href="/wishlist" className="relative">
      <span className="sr-only">Wishlist</span>
      <div className="h-6 w-6 rounded-full border flex items-center justify-center text-neutral-600 hover:text-neutral-900 transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </div>
      {count > 0 && (
        <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center font-medium">
          {count}
        </span>
      )}
    </Link>
  );
}



