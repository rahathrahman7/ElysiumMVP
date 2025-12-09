import { prisma } from '@/lib/database/prisma';

export interface InventoryUpdate {
  productSlug: string;
  variantKey: string;
  stockLevel?: number;
  reservedStock?: number;
  lowStockThreshold?: number;
}

export async function getInventory(productSlug: string, variantKey: string) {
  return await prisma.inventory.findUnique({
    where: {
      productSlug_variantKey: {
        productSlug,
        variantKey,
      }
    }
  });
}

export async function getProductInventory(productSlug: string) {
  return await prisma.inventory.findMany({
    where: { productSlug }
  });
}

export async function updateInventory(data: InventoryUpdate) {
  const { productSlug, variantKey, ...updateData } = data;

  return await prisma.inventory.upsert({
    where: {
      productSlug_variantKey: {
        productSlug,
        variantKey,
      }
    },
    update: {
      ...updateData,
      lastUpdated: new Date(),
    },
    create: {
      productSlug,
      variantKey,
      stockLevel: updateData.stockLevel ?? 0,
      reservedStock: updateData.reservedStock ?? 0,
      lowStockThreshold: updateData.lowStockThreshold ?? 5,
    }
  });
}

export async function reserveInventory(
  productSlug: string,
  variantKey: string,
  quantity: number
): Promise<boolean> {
  const inventory = await getInventory(productSlug, variantKey);

  if (!inventory) {
    throw new Error('Inventory not found');
  }

  const availableStock = inventory.stockLevel - inventory.reservedStock;

  if (availableStock < quantity) {
    return false; // Not enough stock
  }

  await prisma.inventory.update({
    where: {
      productSlug_variantKey: {
        productSlug,
        variantKey,
      }
    },
    data: {
      reservedStock: inventory.reservedStock + quantity,
      lastUpdated: new Date(),
    }
  });

  return true;
}

export async function releaseInventory(
  productSlug: string,
  variantKey: string,
  quantity: number
) {
  const inventory = await getInventory(productSlug, variantKey);

  if (!inventory) {
    throw new Error('Inventory not found');
  }

  await prisma.inventory.update({
    where: {
      productSlug_variantKey: {
        productSlug,
        variantKey,
      }
    },
    data: {
      reservedStock: Math.max(0, inventory.reservedStock - quantity),
      lastUpdated: new Date(),
    }
  });
}

export async function fulfillInventory(
  productSlug: string,
  variantKey: string,
  quantity: number
) {
  const inventory = await getInventory(productSlug, variantKey);

  if (!inventory) {
    throw new Error('Inventory not found');
  }

  await prisma.inventory.update({
    where: {
      productSlug_variantKey: {
        productSlug,
        variantKey,
      }
    },
    data: {
      stockLevel: inventory.stockLevel - quantity,
      reservedStock: Math.max(0, inventory.reservedStock - quantity),
      lastUpdated: new Date(),
    }
  });
}

export async function getLowStockItems() {
  return await prisma.$queryRaw`
    SELECT *
    FROM inventory
    WHERE (stock_level - reserved_stock) <= low_stock_threshold
    ORDER BY (stock_level - reserved_stock) ASC
  `;
}

export async function checkAvailability(
  productSlug: string,
  variantKey: string,
  quantity: number
): Promise<{ available: boolean; stock: number }> {
  const inventory = await getInventory(productSlug, variantKey);

  if (!inventory) {
    return { available: false, stock: 0 };
  }

  const availableStock = inventory.stockLevel - inventory.reservedStock;

  return {
    available: availableStock >= quantity,
    stock: availableStock,
  };
}
