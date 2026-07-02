import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { requireEnv } from '@/lib/env';
import { updateOrderStatus } from '@/lib/services/orders';
import { clearCart } from '@/lib/services/cart';
import { OrderStatus } from '@prisma/client';
import {
  fulfillOrderInventory,
  releaseOrderInventory,
} from '@/lib/services/checkoutInventory';
import { prisma } from '@/lib/database/prisma';

let _stripe: Stripe | null = null;
function getStripe() {
  if (!_stripe) {
    _stripe = new Stripe(requireEnv('STRIPE_SECRET_KEY'), {
      apiVersion: '2024-06-20',
    });
  }
  return _stripe;
}

const RELEASABLE_STATUSES: OrderStatus[] = [
  OrderStatus.PENDING,
  OrderStatus.PROCESSING,
  OrderStatus.PAYMENT_FAILED,
];

async function releaseOrderIfNeeded(orderId: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || !RELEASABLE_STATUSES.includes(order.status)) {
    return order?.status;
  }

  await releaseOrderInventory(orderId);
  await updateOrderStatus(orderId, OrderStatus.CANCELLED);
  return OrderStatus.CANCELLED;
}

export async function POST(request: Request) {
  const stripe = getStripe();
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      requireEnv('STRIPE_WEBHOOK_SECRET')
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;

        if (orderId) {
          await updateOrderStatus(
            orderId,
            OrderStatus.PROCESSING,
            session.payment_intent as string
          );
          console.log(`Order ${orderId} marked as PROCESSING`);
        }
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;

        if (orderId) {
          const status = await releaseOrderIfNeeded(orderId);
          console.log(`Checkout session expired for order ${orderId}, status: ${status}`);
        }
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata?.orderId;

        if (orderId) {
          const existing = await prisma.order.findUnique({
            where: { id: orderId },
            select: { status: true, userId: true },
          });

          if (!existing) break;

          if (existing.status === OrderStatus.PAID) {
            console.log(`Order ${orderId} already PAID, skipping fulfillment`);
            break;
          }

          await updateOrderStatus(
            orderId,
            OrderStatus.PAID,
            paymentIntent.id
          );
          await fulfillOrderInventory(orderId);

          if (existing.userId) {
            await clearCart(existing.userId);
          }

          console.log(`Order ${orderId} marked as PAID and inventory fulfilled`);
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata?.orderId;

        if (orderId) {
          const existing = await prisma.order.findUnique({
            where: { id: orderId },
            select: { status: true },
          });

          if (!existing) break;

          if (!RELEASABLE_STATUSES.includes(existing.status)) {
            console.log(`Order ${orderId} status ${existing.status}, skipping inventory release`);
            break;
          }

          await releaseOrderInventory(orderId);
          await updateOrderStatus(
            orderId,
            OrderStatus.PAYMENT_FAILED,
            paymentIntent.id
          );
          console.log(`Order ${orderId} marked as PAYMENT_FAILED and inventory released`);
        }
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntentId = charge.payment_intent as string;
        console.log(`Charge refunded for payment intent: ${paymentIntentId}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
