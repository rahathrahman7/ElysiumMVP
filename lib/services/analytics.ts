import { prisma } from '@/lib/database/prisma';

export async function trackProductView(
  productSlug: string,
  userId?: string,
  sessionId?: string
) {
  return await prisma.productView.create({
    data: {
      productSlug,
      userId,
      sessionId,
    }
  });
}

export async function getRecentlyViewed(userId: string, limit: number = 10) {
  const views = await prisma.productView.findMany({
    where: { userId },
    orderBy: { viewedAt: 'desc' },
    distinct: ['productSlug'],
    take: limit,
  });

  return views.map(v => v.productSlug);
}

export async function getRecentlyViewedBySession(sessionId: string, limit: number = 10) {
  const views = await prisma.productView.findMany({
    where: { sessionId },
    orderBy: { viewedAt: 'desc' },
    distinct: ['productSlug'],
    take: limit,
  });

  return views.map(v => v.productSlug);
}

export async function getProductViewCount(productSlug: string): Promise<number> {
  return await prisma.productView.count({
    where: { productSlug }
  });
}

export async function getTrendingProducts(limit: number = 10) {
  // Get products with most views in last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const views = await prisma.productView.groupBy({
    by: ['productSlug'],
    where: {
      viewedAt: {
        gte: thirtyDaysAgo,
      }
    },
    _count: {
      productSlug: true,
    },
    orderBy: {
      _count: {
        productSlug: 'desc',
      }
    },
    take: limit,
  });

  return views.map(v => ({
    productSlug: v.productSlug,
    viewCount: v._count.productSlug,
  }));
}
