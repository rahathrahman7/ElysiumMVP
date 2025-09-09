"use client";
import Link from "next/link";
import { useCartStore } from "@/lib/state/cart";

export function MiniCartIcon() {
  const count = useCartStore((s)=>s.items.length);
  return (
    <Link href="/cart" className="relative">
      <span className="sr-only">Cart</span>
      <div className="h-6 w-6 flex items-center justify-center" aria-hidden>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-black">
          <path d="M6 7h12l-1 12H7L6 7z" />
          <path d="M9 7a3 3 0 0 1 6 0" />
        </svg>
      </div>
      {count > 0 && (
        <span className="absolute -top-2 -right-2 text-[10px] bg-black text-white rounded-full h-5 min-w-[1.25rem] px-1 flex items-center justify-center">{count}</span>
      )}
    </Link>
  );
}









