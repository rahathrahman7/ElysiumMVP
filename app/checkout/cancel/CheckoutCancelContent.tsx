"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function CheckoutCancelContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const [released, setReleased] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    fetch("/api/checkout/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.released) setReleased(true);
      })
      .catch((error) => {
        console.error("Failed to release checkout reservation:", error);
      });
  }, [orderId]);

  return (
    <div className="container mx-auto px-6 py-16 text-center">
      <h1 className="font-heading text-3xl md:text-4xl mb-4">Checkout cancelled</h1>
      <p className="text-charcoal/80 mb-6">
        {released
          ? "Your reserved items have been released. Your bag is unchanged."
          : "You can resume your order at any time."}
      </p>
      <Link href="/cart" className="underline text-charcoal">
        Return to your bag
      </Link>
    </div>
  );
}
