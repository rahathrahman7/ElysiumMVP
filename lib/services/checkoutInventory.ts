import { prisma } from '@/lib/database/prisma';
import { buildVariantKeyFromConfiguration } from '@/lib/inventory/variantKey';
import {
  checkAvailability,
  fulfillInventory,
  releaseInventory,
  reserveInventory,
} from '@/lib/services/inventory';

export interface CheckoutInventoryItem {
  productSlug: string;
  configuration: unknown;
  quantity: number;
  title?: string;
}

export interface ResolvedCheckoutItem extends CheckoutInventoryItem {
  variantKey: string;
}

export class CheckoutInventoryError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 400
  ) {
    super(message);
    this.name = 'CheckoutInventoryError';
  }
}

function resolveVariantKey(item: CheckoutInventoryItem): string {
  const configuration = item.configuration as { metal?: string; size?: string } | null;
  const variantKey = buildVariantKeyFromConfiguration(configuration ?? {});

  if (!variantKey) {
    throw new CheckoutInventoryError(
      `Missing metal selection for ${item.title ?? item.productSlug}`
    );
  }

  return variantKey;
}

export function resolveCheckoutItems(items: CheckoutInventoryItem[]): ResolvedCheckoutItem[] {
  return items.map((item) => ({
    ...item,
    variantKey: resolveVariantKey(item),
  }));
}

export async function validateCheckoutInventory(items: CheckoutInventoryItem[]): Promise<void> {
  const resolved = resolveCheckoutItems(items);

  for (const item of resolved) {
    const { available, stock } = await checkAvailability(
      item.productSlug,
      item.variantKey,
      item.quantity
    );

    if (!available) {
      const label = item.title ?? item.productSlug;
      throw new CheckoutInventoryError(
        stock === 0
          ? `${label} is out of stock for the selected configuration`
          : `${label} only has ${stock} available — reduce quantity or choose another size`
      );
    }
  }
}

export async function reserveCheckoutInventory(items: CheckoutInventoryItem[]): Promise<void> {
  const resolved = resolveCheckoutItems(items);
  const reserved: ResolvedCheckoutItem[] = [];

  try {
    for (const item of resolved) {
      const ok = await reserveInventory(item.productSlug, item.variantKey, item.quantity);
      if (!ok) {
        const label = item.title ?? item.productSlug;
        throw new CheckoutInventoryError(`${label} is no longer available`);
      }
      reserved.push(item);
    }
  } catch (error) {
    await releaseCheckoutInventory(reserved);
    throw error;
  }
}

export async function releaseCheckoutInventory(items: CheckoutInventoryItem[]): Promise<void> {
  const resolved = resolveCheckoutItems(items);

  for (const item of resolved) {
    try {
      await releaseInventory(item.productSlug, item.variantKey, item.quantity);
    } catch (error) {
      console.error(
        `Failed to release inventory for ${item.productSlug}/${item.variantKey}:`,
        error
      );
    }
  }
}

export async function fulfillOrderInventory(orderId: string): Promise<void> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) return;

  for (const item of order.items) {
    const variantKey = resolveVariantKey({
      productSlug: item.productSlug,
      configuration: item.configuration,
      quantity: item.quantity,
    });

    try {
      await fulfillInventory(item.productSlug, variantKey, item.quantity);
    } catch (error) {
      console.error(
        `Failed to fulfill inventory for order ${orderId} item ${item.productSlug}:`,
        error
      );
    }
  }
}

export async function releaseOrderInventory(orderId: string): Promise<void> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) return;

  for (const item of order.items) {
    try {
      const variantKey = resolveVariantKey({
        productSlug: item.productSlug,
        configuration: item.configuration,
        quantity: item.quantity,
      });
      await releaseInventory(item.productSlug, variantKey, item.quantity);
    } catch (error) {
      console.error(
        `Failed to release inventory for order ${orderId} item ${item.productSlug}:`,
        error
      );
    }
  }
}
