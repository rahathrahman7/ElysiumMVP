"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCartStore } from "@/lib/state/cart";

export default function CheckoutSuccessContent() {
  const clear = useCartStore((s) => s.clear);
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");

  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <div className="container mx-auto px-6 py-16 text-center">
      <h1 className="font-heading text-3xl md:text-4xl mb-4">Thank you</h1>
      <p className="text-charcoal/80">
        Your order{orderNumber ? ` ${orderNumber}` : ""} has been received and is being prepared.
      </p>
    </div>
  );
}
