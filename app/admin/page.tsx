import { getDashboardStats, getPendingInquiries } from '@/lib/services/admin';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { StatCard } from '@/components/admin/ui/AdminCard';
import { RecentOrders } from '@/components/admin/dashboard/RecentOrders';
import { PendingInquiries } from '@/components/admin/dashboard/PendingInquiries';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const stats = await getDashboardStats();
  const pendingInquiries = await getPendingInquiries();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatChange = (change: number) => {
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  return (
    <div>
      <AdminHeader
        title="Dashboard"
        subtitle="Welcome back! Here's what's happening with your store."
      />

      <div className="p-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Orders Today"
            value={stats.orders.today}
            change={formatChange(stats.orders.change)}
            changeType={stats.orders.changeType}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            }
          />

          <StatCard
            title="Revenue (7 Days)"
            value={formatCurrency(stats.revenue.thisWeek)}
            change={formatChange(stats.revenue.change)}
            changeType={stats.revenue.changeType}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />

          <StatCard
            title="New Inquiries"
            value={stats.inquiries.new}
            change={`${stats.inquiries.pending} pending`}
            changeType="neutral"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            }
          />

          <StatCard
            title="Views Today"
            value={stats.views.today}
            change={formatChange(stats.views.change)}
            changeType={stats.views.changeType}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Recent Orders (2/3 width) */}
          <div className="lg:col-span-2">
            <RecentOrders orders={stats.recentOrders} />
          </div>

          {/* Quick Actions (1/3 width) */}
          <div className="space-y-6">
            {/* Low Stock Alerts */}
            <div className="bg-white border border-[rgba(109,61,13,0.08)] shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-serif text-[#753600]">Low Stock Alerts</h2>
                <Link
                  href="/admin/inventory"
                  className="text-sm text-[#D4AF37] hover:text-[#753600] font-medium transition-colors"
                >
                  View All →
                </Link>
              </div>

              {(stats.lowStockItems as any[]).length === 0 ? (
                <p className="text-sm text-gray-600 text-center py-4">All stock levels healthy</p>
              ) : (
                <div className="space-y-3">
                  {(stats.lowStockItems as any[]).slice(0, 5).map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 truncate">{item.productSlug}</p>
                        <p className="text-xs text-gray-500">{item.variantKey}</p>
                      </div>
                      <span className={`ml-2 font-bold ${
                        item.stockLevel - item.reservedStock === 0
                          ? 'text-red-600'
                          : 'text-amber-600'
                      }`}>
                        {item.stockLevel - item.reservedStock}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-[rgba(109,61,13,0.08)] shadow-sm p-6">
              <h2 className="text-xl font-serif text-[#753600] mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <AdminButton href="/admin/orders" variant="outline" className="w-full">
                  View All Orders
                </AdminButton>
                <AdminButton href="/admin/inventory" variant="outline" className="w-full">
                  Manage Inventory
                </AdminButton>
                <AdminButton href="/admin/analytics" variant="outline" className="w-full">
                  View Analytics
                </AdminButton>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Inquiries */}
        <PendingInquiries inquiries={pendingInquiries} />
      </div>
    </div>
  );
}
