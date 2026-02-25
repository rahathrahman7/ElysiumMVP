"use client";
import { useState } from "react";
import { useCartStore } from "@/lib/state/cart";
import { createCheckoutSession } from "@/lib/stripe/client";

export default function CartPage() {
  const { items, removeItem, total } = useCartStore();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!email.trim()) {
      setCheckoutError("Please enter your email address");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setCheckoutError("Please enter a valid email address");
      return;
    }
    setCheckoutError(null);
    setIsCheckingOut(true);
    try {
      await createCheckoutSession(items, email.trim(), name.trim() || undefined);
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : "Checkout failed");
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="font-heading text-3xl md:text-4xl mb-6">Your Bag</h1>
      {items.length === 0 ? (
        <p>Your bag is empty.</p>
      ) : (
        <div className="space-y-4 max-w-2xl">
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

          <div className="pt-6 space-y-2 border-t">
            <label htmlFor="checkout-email" className="block text-sm font-medium">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              id="checkout-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2 border rounded"
              required
            />
            <label htmlFor="checkout-name" className="block text-sm font-medium">
              Name (optional)
            </label>
            <input
              id="checkout-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-3 py-2 border rounded"
            />
            {checkoutError && (
              <p className="text-sm text-red-600">{checkoutError}</p>
            )}
            <button
              className="px-4 py-2 bg-charcoal text-ivory rounded disabled:opacity-50"
              onClick={handleCheckout}
              disabled={isCheckingOut}
            >
              {isCheckingOut ? "Proceeding..." : "Checkout"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}



