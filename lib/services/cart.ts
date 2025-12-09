import { prisma } from '@/lib/database/prisma';

export interface CartItemConfig {
  metal: string;
  size: string;
  diamond?: {
    shape: string;
    carat: number;
    color: string;
    clarity: string;
  };
  engraving?: string;
}

export async function getCart(userId: string) {
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });

  return cartItems;
}

export async function addToCart(
  userId: string,
  productSlug: string,
  configuration: CartItemConfig,
  quantity: number = 1
) {
  // Check if item with same config exists
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      userId,
      productSlug,
      configuration: configuration as any,
    }
  });

  if (existingItem) {
    // Update quantity
    return await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity }
    });
  }

  // Create new cart item
  return await prisma.cartItem.create({
    data: {
      userId,
      productSlug,
      configuration: configuration as any,
      quantity,
    }
  });
}

export async function updateCartItem(
  cartItemId: string,
  userId: string,
  quantity: number
) {
  // Verify item belongs to user
  const item = await prisma.cartItem.findUnique({
    where: { id: cartItemId }
  });

  if (!item || item.userId !== userId) {
    throw new Error('Cart item not found');
  }

  if (quantity <= 0) {
    return await prisma.cartItem.delete({
      where: { id: cartItemId }
    });
  }

  return await prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity }
  });
}

export async function removeFromCart(cartItemId: string, userId: string) {
  // Verify item belongs to user
  const item = await prisma.cartItem.findUnique({
    where: { id: cartItemId }
  });

  if (!item || item.userId !== userId) {
    throw new Error('Cart item not found');
  }

  return await prisma.cartItem.delete({
    where: { id: cartItemId }
  });
}

export async function clearCart(userId: string) {
  return await prisma.cartItem.deleteMany({
    where: { userId }
  });
}

export async function getCartItemCount(userId: string): Promise<number> {
  const items = await prisma.cartItem.findMany({
    where: { userId },
    select: { quantity: true }
  });

  return items.reduce((total, item) => total + item.quantity, 0);
}
