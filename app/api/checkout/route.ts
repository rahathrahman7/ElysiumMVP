import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getServerSession } from 'next-auth';
import { requireEnv, env } from "@/lib/env";
import { authOptions } from '@/lib/auth/config';
import { createOrder } from '@/lib/services/orders';
import { updateOrderStatus } from '@/lib/services/orders';
import { OrderStatus } from '@prisma/client';
import {
  CheckoutInventoryError,
  releaseCheckoutInventory,
  reserveCheckoutInventory,
  validateCheckoutInventory,
} from '@/lib/services/checkoutInventory';
import { z } from 'zod';

const checkoutItemSchema = z.object({
  productSlug: z.string(),
  title: z.string(),
  price: z.number().int().positive(),
  quantity: z.number().int().min(1),
  configuration: z.object({
    metal: z.string().min(1),
    size: z.string().optional(),
    diamond: z.object({
      shape: z.string(),
      carat: z.number(),
      color: z.string(),
      clarity: z.string(),
    }).optional(),
    engraving: z.string().optional(),
  }),
});

const checkoutSchema = z.object({
  items: z.array(checkoutItemSchema).min(1),
  customerEmail: z.string().email(),
  customerName: z.string().optional(),
  billingAddressId: z.string().optional(),
  shippingAddressId: z.string().optional(),
});

export async function POST(request: Request) {
  let reservedItems: Parameters<typeof releaseCheckoutInventory>[0] | null = null;

  try {
    const stripe = new Stripe(requireEnv("STRIPE_SECRET_KEY"), { apiVersion: "2024-06-20" });
    const session = await getServerSession(authOptions);

    const body = await request.json();
    const { items, customerEmail, customerName, billingAddressId, shippingAddressId } =
      checkoutSchema.parse(body);

    const inventoryItems = items.map((item) => ({
      productSlug: item.productSlug,
      configuration: item.configuration,
      quantity: item.quantity,
      title: item.title,
    }));

    await validateCheckoutInventory(inventoryItems);
    await reserveCheckoutInventory(inventoryItems);
    reservedItems = inventoryItems;

    const order = await createOrder({
      userId: session?.user?.id,
      customerEmail,
      customerName,
      items: items.map(item => ({
        productSlug: item.productSlug,
        configuration: item.configuration,
        quantity: item.quantity,
        unitPriceGbp: item.price / 100,
      })),
      billingAddressId,
      shippingAddressId,
    });

    let checkoutSession: Stripe.Checkout.Session;
    try {
      checkoutSession = await stripe.checkout.sessions.create({
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
    } catch (stripeError) {
      await releaseCheckoutInventory(inventoryItems);
      await updateOrderStatus(order.id, OrderStatus.CANCELLED);
      throw stripeError;
    }

    reservedItems = null;

    return NextResponse.json({
      id: checkoutSession.id,
      url: checkoutSession.url,
      orderId: order.id,
      orderNumber: order.orderNumber,
    });
  } catch (error) {
    if (reservedItems) {
      await releaseCheckoutInventory(reservedItems);
    }

    if (error instanceof CheckoutInventoryError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }

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
