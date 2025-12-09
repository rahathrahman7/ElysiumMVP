import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getServerSession } from 'next-auth';
import { requireEnv, env } from "@/lib/env";
import { authOptions } from '@/lib/auth/config';
import { createOrder } from '@/lib/services/orders';
import { clearCart } from '@/lib/services/cart';
import { z } from 'zod';

const checkoutSchema = z.object({
  items: z.array(z.object({
    productSlug: z.string(),
    title: z.string(),
    price: z.number(),
    quantity: z.number(),
    configuration: z.any(),
  })),
  customerEmail: z.string().email(),
  customerName: z.string().optional(),
  billingAddressId: z.string().optional(),
  shippingAddressId: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const stripe = new Stripe(requireEnv("STRIPE_SECRET_KEY"), { apiVersion: "2024-06-20" });
    const session = await getServerSession(authOptions);

    const body = await request.json();
    const { items, customerEmail, customerName, billingAddressId, shippingAddressId } =
      checkoutSchema.parse(body);

    // Create order in database
    const order = await createOrder({
      userId: session?.user?.id,
      customerEmail,
      customerName,
      items: items.map(item => ({
        productSlug: item.productSlug,
        configuration: item.configuration,
        quantity: item.quantity,
        unitPriceGbp: item.price / 100, // Convert from pence to pounds
      })),
      billingAddressId,
      shippingAddressId,
    });

    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${env.NEXT_PUBLIC_SITE_URL}/checkout/success?order=${order.orderNumber}`,
      cancel_url: `${env.NEXT_PUBLIC_SITE_URL}/checkout/cancel?order=${order.id}`,
      customer_email: customerEmail,
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
      },
      line_items: items.map((i) => ({
        price_data: {
          currency: "gbp",
          product_data: {
            name: i.title,
            metadata: {
              productSlug: i.productSlug,
            }
          },
          unit_amount: i.price,
        },
        quantity: i.quantity,
      })),
      payment_intent_data: {
        metadata: {
          orderId: order.id,
          orderNumber: order.orderNumber,
        }
      }
    });

    // Clear cart if user is authenticated
    if (session?.user?.id) {
      await clearCart(session.user.id);
    }

    return NextResponse.json({
      id: checkoutSession.id,
      url: checkoutSession.url,
      orderId: order.id,
      orderNumber: order.orderNumber,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
















