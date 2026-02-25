import type { CartItem } from "@/lib/state/cart";

export interface CheckoutPayload {
  items: Array<{
    productSlug: string;
    title: string;
    price: number;
    quantity: number;
    configuration?: Record<string, unknown>;
  }>;
  customerEmail: string;
  customerName?: string;
}

export async function createCheckoutSession(
  items: CartItem[],
  customerEmail: string,
  customerName?: string
): Promise<void> {
  const payload: CheckoutPayload = {
    items: items.map((it) => ({
      productSlug: it.productSlug,
      title: it.title,
      price: it.price,
      quantity: it.quantity,
      configuration: it.configuration ?? {},
    })),
    customerEmail,
    customerName,
  };

  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error ?? "Failed to create checkout session");
  }

  const { url } = await res.json();
  if (url) window.location.href = url;
}
















