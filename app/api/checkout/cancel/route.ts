import { NextResponse } from 'next/server';
import { OrderStatus } from '@prisma/client';
import { getOrder, updateOrderStatus } from '@/lib/services/orders';
import { releaseOrderInventory } from '@/lib/services/checkoutInventory';

const RELEASABLE_STATUSES: OrderStatus[] = [
  OrderStatus.PENDING,
  OrderStatus.PROCESSING,
  OrderStatus.PAYMENT_FAILED,
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orderId = body?.orderId as string | undefined;

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
    }

    const order = await getOrder(orderId);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (!RELEASABLE_STATUSES.includes(order.status)) {
      return NextResponse.json({
        released: false,
        status: order.status,
      });
    }

    await releaseOrderInventory(orderId);
    await updateOrderStatus(orderId, OrderStatus.CANCELLED);

    return NextResponse.json({
      released: true,
      status: OrderStatus.CANCELLED,
    });
  } catch (error) {
    console.error('Checkout cancel error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
