"use client";
import { useState } from "react";
import { useCartStore } from "@/lib/state/cart";
import { createCheckoutSession } from "@/lib/stripe/client";

export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const { items, removeItem, total } = useCartStore();
  return (
    <div>
      <button aria-haspopup="dialog" aria-expanded={open} onClick={()=>setOpen(true)} className="hidden">Open Cart</button>
      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={()=>setOpen(false)} />
          <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-ivory border-l p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="font-heading text-xl">Your Bag</div>
              <button onClick={()=>setOpen(false)} aria-label="Close">×</button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4">
              {items.length === 0 ? <div>Your bag is empty.</div> : items.map((it)=> (
                <div key={it.id} className="flex items-center justify-between border-b pb-3">
                  <div>
                    <div className="font-medium">{it.title}</div>
                    <div className="text-sm text-charcoal/70">{it.variantLabel}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div>£{(it.price / 100).toFixed(2)}</div>
                    <button className="text-sm underline" onClick={()=>removeItem(it.id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t mt-4 flex items-center justify-between">
              <div className="font-medium">Total</div>
              <div>£{(total()/100).toFixed(2)}</div>
            </div>
            <button className="mt-4 px-4 py-2 bg-charcoal text-ivory rounded" onClick={()=>createCheckoutSession(items)}>Checkout</button>
          </aside>
        </div>
      )}
    </div>
  );
}
















