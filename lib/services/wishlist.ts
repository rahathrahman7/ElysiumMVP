import { prisma } from '@/lib/database/prisma';

export async function getWishlist(userId: string) {
  return await prisma.wishlistItem.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
}

export async function addToWishlist(
  userId: string,
  productSlug: string,
  configuration?: any
) {
  return await prisma.wishlistItem.upsert({
    where: {
      userId_productSlug: {
        userId,
        productSlug,
      }
    },
    update: {
      configuration,
    },
    create: {
      userId,
      productSlug,
      configuration,
    }
  });
}

export async function removeFromWishlist(userId: string, productSlug: string) {
  return await prisma.wishlistItem.delete({
    where: {
      userId_productSlug: {
        userId,
        productSlug,
      }
    }
  });
}

export async function isInWishlist(userId: string, productSlug: string): Promise<boolean> {
  const item = await prisma.wishlistItem.findUnique({
    where: {
      userId_productSlug: {
        userId,
        productSlug,
      }
    }
  });

  return !!item;
}
