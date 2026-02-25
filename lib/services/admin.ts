import { prisma } from '@/lib/database/prisma';
import { OrderStatus } from '@prisma/client';

/**
 * Get dashboard overview stats
 */
export async function getDashboardStats() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);
  const lastMonth = new Date(today);
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  // Parallel queries for performance
  const [
    ordersToday,
    ordersYesterday,
    revenueThisWeek,
    revenueLastWeek,
    newInquiries,
    pendingInquiries,
    viewsToday,
    viewsYesterday,
    recentOrders,
    lowStockItems,
  ] = await Promise.all([
    // Orders today
    prisma.order.count({ where: { createdAt: { gte: today } } }),
    // Orders yesterday
    prisma.order.count({ where: { createdAt: { gte: yesterday, lt: today } } }),
    // Revenue this week
    prisma.order.aggregate({
      where: {
        createdAt: { gte: lastWeek },
        status: { in: ['PAID', 'FULFILLED', 'SHIPPED', 'DELIVERED'] }
      },
      _sum: { totalAmountGbp: true }
    }),
    // Revenue last week (for comparison)
    prisma.order.aggregate({
      where: {
        createdAt: { gte: lastMonth, lt: lastWeek },
        status: { in: ['PAID', 'FULFILLED', 'SHIPPED', 'DELIVERED'] }
      },
      _sum: { totalAmountGbp: true }
    }),
    // New inquiries (status = NEW)
    prisma.bespokeLead.count({ where: { status: 'NEW' } }),
    // Pending inquiries (not converted/lost/archived)
    prisma.bespokeLead.count({
      where: { status: { notIn: ['CONVERTED', 'LOST', 'ARCHIVED'] } }
    }),
    // Product views today
    prisma.productView.count({ where: { viewedAt: { gte: today } } }),
    // Product views yesterday
    prisma.productView.count({ where: { viewedAt: { gte: yesterday, lt: today } } }),
    // Recent orders (last 5)
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
      }
    }),
    // Low stock items - use quoted identifiers to respect camelCase columns
    prisma.$queryRaw`
      SELECT
        "id",
        "productSlug",
        "variantKey",
        "stockLevel",
        "reservedStock",
        "lowStockThreshold"
      FROM "inventory"
      WHERE ("stockLevel" - "reservedStock") <= "lowStockThreshold"
      ORDER BY ("stockLevel" - "reservedStock") ASC
      LIMIT 10
    `,
  ]);

  // Calculate percentage changes
  const ordersChange = ordersYesterday > 0
    ? ((ordersToday - ordersYesterday) / ordersYesterday) * 100
    : ordersToday > 0 ? 100 : 0;

  const revenueChange = Number(revenueLastWeek._sum.totalAmountGbp || 0) > 0
    ? ((Number(revenueThisWeek._sum.totalAmountGbp || 0) - Number(revenueLastWeek._sum.totalAmountGbp || 0)) / Number(revenueLastWeek._sum.totalAmountGbp)) * 100
    : Number(revenueThisWeek._sum.totalAmountGbp || 0) > 0 ? 100 : 0;

  const viewsChange = viewsYesterday > 0
    ? ((viewsToday - viewsYesterday) / viewsYesterday) * 100
    : viewsToday > 0 ? 100 : 0;

  return {
    orders: {
      today: ordersToday,
      change: ordersChange,
      changeType: ordersChange > 0 ? 'positive' as const : ordersChange < 0 ? 'negative' as const : 'neutral' as const,
    },
    revenue: {
      thisWeek: Number(revenueThisWeek._sum.totalAmountGbp || 0),
      change: revenueChange,
      changeType: revenueChange > 0 ? 'positive' as const : revenueChange < 0 ? 'negative' as const : 'neutral' as const,
    },
    inquiries: {
      new: newInquiries,
      pending: pendingInquiries,
    },
    views: {
      today: viewsToday,
      change: viewsChange,
      changeType: viewsChange > 0 ? 'positive' as const : viewsChange < 0 ? 'negative' as const : 'neutral' as const,
    },
    recentOrders,
    lowStockItems,
  };
}

/**
 * Get pending inquiries that need attention
 */
export async function getPendingInquiries(limit: number = 5) {
  return await prisma.bespokeLead.findMany({
    where: {
      status: { in: ['NEW', 'CONTACTED'] }
    },
    orderBy: { createdAt: 'asc' },
    take: limit,
  });
}
