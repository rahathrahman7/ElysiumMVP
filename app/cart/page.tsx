"use client";
import { useCartStore } from "@/lib/state/cart";
import { createCheckoutSession } from "@/lib/stripe/client";

export default function CartPage() {
  const { items, removeItem, total } = useCartStore();
  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="font-heading text-3xl md:text-4xl mb-6">Your Bag</h1>
      {items.length === 0 ? (
        <p>Your bag is empty.</p>
      ) : (
        <div className="space-y-4">
          {items.map((it) => (
            <div key={it.id} className="flex items-center justify-between border-b pb-3">
              <div>
                <div className="font-medium">{it.title}</div>
                <div className="text-sm text-charcoal/70">{it.variantLabel}</div>
              </div>
              <div className="flex items-center gap-3">
                <div>£{(it.price / 100).toFixed(2)}</div>
                <button className="text-sm underline" onClick={() => removeItem(it.id)}>Remove</button>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between pt-4">
            <div className="font-medium">Total</div>
            <div>£{(total() / 100).toFixed(2)}</div>
          </div>
          <button
            className="px-4 py-2 bg-charcoal text-ivory rounded"
            onClick={() => createCheckoutSession(items)}
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
}



