"use client";
import Link from "next/link";
import { useCartStore } from "@/lib/state/cart";

export function MiniCartIcon() {
  const count = useCartStore((s)=>s.items.length);
  return (
    <Link href="/cart" className="relative group">
      <span className="sr-only">Cart</span>
      <div className="h-6 w-6 flex items-center justify-center" aria-hidden>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-elysium-brown group-hover:text-elysium-gold transition-colors duration-300">
          {/* Luxury shopping bag */}
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
      </div>
      {count > 0 && (
        <span className="absolute -top-2 -right-2 text-[10px] bg-elysium-brown text-white rounded-full h-5 min-w-[1.25rem] px-1 flex items-center justify-center group-hover:bg-elysium-gold group-hover:text-elysium-brown transition-colors duration-300">{count}</span>
      )}
    </Link>
  );
}









