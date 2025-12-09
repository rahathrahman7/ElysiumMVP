import { getAllOrders } from '@/lib/services/orders';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { AdminCard } from '@/components/admin/ui/AdminCard';
import { OrderStatusBadge } from '@/components/admin/ui/AdminBadge';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const orders = await getAllOrders({ limit: 50 });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <div>
      <AdminHeader
        title="Orders"
        subtitle={`${orders.length} total orders`}
      />

      <div className="p-8">
        <AdminCard>
          {/* Filter Bar */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
            <div className="flex gap-2">
              <select className="px-4 py-2 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]">
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>

              <input
                type="search"
                placeholder="Search by order # or email..."
                className="px-4 py-2 border border-gray-300 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>

            <button className="px-4 py-2 text-sm font-medium text-[#753600] hover:text-[#D4AF37] transition-colors">
              Export CSV
            </button>
          </div>

          {/* Orders Table */}
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </div>
              <p className="text-gray-600">No orders found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 text-left">
                    <th className="pb-3 text-xs font-medium text-gray-600 uppercase tracking-wide">Order #</th>
                    <th className="pb-3 text-xs font-medium text-gray-600 uppercase tracking-wide">Customer</th>
                    <th className="pb-3 text-xs font-medium text-gray-600 uppercase tracking-wide">Email</th>
                    <th className="pb-3 text-xs font-medium text-gray-600 uppercase tracking-wide">Items</th>
                    <th className="pb-3 text-xs font-medium text-gray-600 uppercase tracking-wide">Total</th>
                    <th className="pb-3 text-xs font-medium text-gray-600 uppercase tracking-wide">Status</th>
                    <th className="pb-3 text-xs font-medium text-gray-600 uppercase tracking-wide">Date</th>
                    <th className="pb-3 text-xs font-medium text-gray-600 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-[#753600] hover:text-[#D4AF37] font-mono text-sm font-medium transition-colors"
                        >
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="py-4 text-sm text-gray-900">
                        {order.customerName || 'Guest'}
                      </td>
                      <td className="py-4 text-sm text-gray-600">
                        {order.customerEmail}
                      </td>
                      <td className="py-4 text-sm text-gray-600">
                        {order.items.length}
                      </td>
                      <td className="py-4 text-sm font-medium text-gray-900">
                        {formatCurrency(Number(order.totalAmountGbp))}
                      </td>
                      <td className="py-4">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="py-4 text-sm text-gray-600">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="py-4">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-sm text-[#D4AF37] hover:text-[#753600] font-medium transition-colors"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </AdminCard>
      </div>
    </div>
  );
}
