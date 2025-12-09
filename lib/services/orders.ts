import { prisma } from '@/lib/database/prisma';
import { OrderStatus } from '@prisma/client';

export interface CreateOrderData {
  userId?: string;
  customerEmail: string;
  customerName?: string;
  items: Array<{
    productSlug: string;
    configuration: any;
    quantity: number;
    unitPriceGbp: number;
  }>;
  billingAddressId?: string;
  shippingAddressId?: string;
  notes?: string;
}

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `ELY-${timestamp}-${random}`;
}

export async function createOrder(data: CreateOrderData) {
  const orderNumber = generateOrderNumber();

  // Calculate total
  const totalAmountGbp = data.items.reduce(
    (sum, item) => sum + item.unitPriceGbp * item.quantity,
    0
  );

  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId: data.userId,
      customerEmail: data.customerEmail,
      customerName: data.customerName,
      totalAmountGbp,
      billingAddressId: data.billingAddressId,
      shippingAddressId: data.shippingAddressId,
      notes: data.notes,
      items: {
        create: data.items.map(item => ({
          productSlug: item.productSlug,
          configuration: item.configuration,
          quantity: item.quantity,
          unitPriceGbp: item.unitPriceGbp,
          totalPriceGbp: item.unitPriceGbp * item.quantity,
        }))
      }
    },
    include: {
      items: true,
      billingAddress: true,
      shippingAddress: true,
    }
  });

  return order;
}

export async function getOrder(orderId: string, userId?: string) {
  const where: any = { id: orderId };

  if (userId) {
    where.userId = userId;
  }

  return await prisma.order.findUnique({
    where,
    include: {
      items: true,
      billingAddress: true,
      shippingAddress: true,
    }
  });
}

export async function getOrderByNumber(orderNumber: string) {
  return await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: true,
      billingAddress: true,
      shippingAddress: true,
    }
  });
}

export async function getUserOrders(userId: string) {
  return await prisma.order.findMany({
    where: { userId },
    include: {
      items: true,
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  stripePaymentIntentId?: string
) {
  return await prisma.order.update({
    where: { id: orderId },
    data: {
      status,
      ...(stripePaymentIntentId && { stripePaymentIntentId }),
    }
  });
}

export async function getAllOrders(params?: {
  status?: OrderStatus;
  limit?: number;
  offset?: number;
}) {
  const where: any = {};

  if (params?.status) {
    where.status = params.status;
  }

  return await prisma.order.findMany({
    where,
    include: {
      items: true,
      billingAddress: true,
      shippingAddress: true,
    },
    orderBy: { createdAt: 'desc' },
    take: params?.limit,
    skip: params?.offset,
  });
}
