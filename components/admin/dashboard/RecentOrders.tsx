import Link from 'next/link';
import { AdminCard } from '../ui/AdminCard';
import { OrderStatusBadge } from '../ui/AdminBadge';
import { Order, OrderItem } from '@prisma/client';

interface RecentOrdersProps {
  orders: (Order & { items: OrderItem[] })[];
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <AdminCard>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-serif text-[#753600]">Recent Orders</h2>
        <Link
          href="/admin/orders"
          className="text-sm text-[#D4AF37] hover:text-[#753600] font-medium transition-colors"
        >
          View All →
        </Link>
      </div>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No orders yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="pb-3 text-xs font-medium text-gray-600 uppercase tracking-wide">Order #</th>
                <th className="pb-3 text-xs font-medium text-gray-600 uppercase tracking-wide">Customer</th>
                <th className="pb-3 text-xs font-medium text-gray-600 uppercase tracking-wide">Items</th>
                <th className="pb-3 text-xs font-medium text-gray-600 uppercase tracking-wide">Total</th>
                <th className="pb-3 text-xs font-medium text-gray-600 uppercase tracking-wide">Status</th>
                <th className="pb-3 text-xs font-medium text-gray-600 uppercase tracking-wide">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-[#753600] hover:text-[#D4AF37] font-medium text-sm transition-colors"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.customerName || 'Guest'}</div>
                      <div className="text-xs text-gray-500">{order.customerEmail}</div>
                    </div>
                  </td>
                  <td className="py-4 text-sm text-gray-600">{order.items.length}</td>
                  <td className="py-4 text-sm font-medium text-gray-900">
                    {formatCurrency(Number(order.totalAmountGbp))}
                  </td>
                  <td className="py-4">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="py-4 text-sm text-gray-600">{formatDate(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminCard>
  );
}
