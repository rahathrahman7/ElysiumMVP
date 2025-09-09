import { requireEnv } from "@/lib/env";

export async function createCheckoutSession(items: Array<{ id: string; title: string; price: number; quantity: number }>) {
  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });
  if (!res.ok) throw new Error("Failed to create session");
  const { url } = await res.json();
  window.location.href = url;
}










