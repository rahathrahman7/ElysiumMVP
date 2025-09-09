import Stripe from "stripe";
import { NextResponse } from "next/server";
import { requireEnv, env } from "@/lib/env";

export async function POST(request: Request) {
  const stripe = new Stripe(requireEnv("STRIPE_SECRET_KEY"), { apiVersion: "2024-06-20" });
  const { items } = await request.json();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${env.NEXT_PUBLIC_SITE_URL}/checkout/success`,
    cancel_url: `${env.NEXT_PUBLIC_SITE_URL}/checkout/cancel`,
    line_items: items.map((i: any) => ({
      price_data: {
        currency: "gbp",
        product_data: { name: i.title },
        unit_amount: i.price,
      },
      quantity: i.quantity,
    })),
  });
  return NextResponse.json({ id: session.id, url: session.url });
}










