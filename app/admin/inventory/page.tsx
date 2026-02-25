import { prisma } from '@/lib/database/prisma';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { AdminCard, StatCard } from '@/components/admin/ui/AdminCard';
import { AdminButton } from '@/components/admin/ui/AdminButton';

export const dynamic = 'force-dynamic';

export default async function InventoryPage() {
  const inventory = await prisma.inventory.findMany({
    orderBy: [
      { productSlug: 'asc' },
      { variantKey: 'asc' }
    ]
  });

  const lowStockItems = inventory.filter(
    item => (item.stockLevel - item.reservedStock) <= item.lowStockThreshold
  );

  const outOfStockItems = inventory.filter(
    item => (item.stockLevel - item.reservedStock) === 0
  );

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
        title="Inventory"
        subtitle={`${inventory.length} total variants`}
        actions={
          <AdminButton variant="primary" size="sm">
            Add Stock
          </AdminButton>
        }
      />

      <div className="p-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Variants"
            value={inventory.length}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            }
          />

          <StatCard
            title="Low Stock"
            value={lowStockItems.length}
            changeType="negative"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            }
          />

          <StatCard
            title="Out of Stock"
            value={outOfStockItems.length}
            changeType="negative"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            }
          />
        </div>

        {/* Inventory Table */}
        <AdminCard>
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-xl font-serif text-[#753600]">All Inventory</h2>

            <div className="flex gap-2">
              <select className="px-4 py-2 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]">
                <option value="ALL">All Products</option>
                <option value="LOW">Low Stock Only</option>
                <option value="OUT">Out of Stock</option>
              </select>

              <input
                type="search"
                placeholder="Search variants..."
                className="px-4 py-2 border border-gray-300 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />

              <button className="px-4 py-2 text-sm font-medium text-[#753600] hover:text-[#D4AF37] transition-colors">
                Export CSV
              </button>
            </div>
          </div>

          {inventory.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-4">No inventory records found</p>
              <AdminButton variant="primary">
                Add Your First Product
              </AdminButton>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 text-left">
                    <th className="pb-3 text-xs font-medium text-gray-600 uppercase tracking-wide">Product</th>
                    <th className="pb-3 text-xs font-medium text-gray-600 uppercase tracking-wide">Variant</th>
                    <th className="pb-3 text-xs font-medium text-gray-600 uppercase tracking-wide">Stock Level</th>
                    <th className="pb-3 text-xs font-medium text-gray-600 uppercase tracking-wide">Reserved</th>
                    <th className="pb-3 text-xs font-medium text-gray-600 uppercase tracking-wide">Available</th>
                    <th className="pb-3 text-xs font-medium text-gray-600 uppercase tracking-wide">Threshold</th>
                    <th className="pb-3 text-xs font-medium text-gray-600 uppercase tracking-wide">Last Updated</th>
                    <th className="pb-3 text-xs font-medium text-gray-600 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {inventory.map((item) => {
                    const available = item.stockLevel - item.reservedStock;
                    const isLowStock = available <= item.lowStockThreshold;
                    const isOutOfStock = available === 0;

                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-gray-50 transition-colors ${
                          isOutOfStock
                            ? 'bg-red-50/50'
                            : isLowStock
                            ? 'bg-amber-50/50'
                            : ''
                        }`}
                      >
                        <td className="py-4 text-sm font-medium text-gray-900">
                          {item.productSlug}
                        </td>
                        <td className="py-4 text-sm text-gray-600 font-mono">
                          {item.variantKey}
                        </td>
                        <td className="py-4 text-sm text-gray-900">
                          {item.stockLevel}
                        </td>
                        <td className="py-4 text-sm text-gray-600">
                          {item.reservedStock}
                        </td>
                        <td className="py-4">
                          <span
                            className={`text-sm font-semibold ${
                              isOutOfStock
                                ? 'text-red-600'
                                : isLowStock
                                ? 'text-amber-600'
                                : 'text-emerald-600'
                            }`}
                          >
                            {available}
                          </span>
                        </td>
                        <td className="py-4 text-sm text-gray-600">
                          {item.lowStockThreshold}
                        </td>
                        <td className="py-4 text-sm text-gray-600">
                          {formatDate(item.lastUpdated)}
                        </td>
                        <td className="py-4">
                          <AdminButton variant="ghost" size="sm">
                            Edit
                          </AdminButton>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </AdminCard>
      </div>
    </div>
  );
}
