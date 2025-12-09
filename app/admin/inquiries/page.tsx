import { getAllLeads } from '@/lib/services/leads';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { AdminCard } from '@/components/admin/ui/AdminCard';
import { InquiryStatusBadge } from '@/components/admin/ui/AdminBadge';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function InquiriesPage() {
  const leads = await getAllLeads({ limit: 100 });

  const getDaysAgo = (date: Date) => {
    const now = new Date();
    const created = new Date(date);
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
        title="Inquiries"
        subtitle={`${leads.length} total bespoke consultation requests`}
      />

      <div className="p-8">
        <AdminCard>
          {/* Filter Bar */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
            <div className="flex gap-2">
              <select className="px-4 py-2 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]">
                <option value="ALL">All Statuses</option>
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="QUOTED">Quoted</option>
                <option value="NEGOTIATING">Negotiating</option>
                <option value="CONVERTED">Converted</option>
                <option value="LOST">Lost</option>
                <option value="ARCHIVED">Archived</option>
              </select>

              <input
                type="search"
                placeholder="Search by name or email..."
                className="px-4 py-2 border border-gray-300 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>

            <button className="px-4 py-2 text-sm font-medium text-[#753600] hover:text-[#D4AF37] transition-colors">
              Export CSV
            </button>
          </div>

          {/* Inquiries Table */}
          {leads.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <p className="text-gray-600">No inquiries found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 text-left">
                    <th className="pb-3 text-xs font-medium text-gray-600 uppercase tracking-wide">Date</th>
                    <th className="pb-3 text-xs font-medium text-gray-600 uppercase tracking-wide">Name</th>
                    <th className="pb-3 text-xs font-medium text-gray-600 uppercase tracking-wide">Email</th>
                    <th className="pb-3 text-xs font-medium text-gray-600 uppercase tracking-wide">Phone</th>
                    <th className="pb-3 text-xs font-medium text-gray-600 uppercase tracking-wide">Budget</th>
                    <th className="pb-3 text-xs font-medium text-gray-600 uppercase tracking-wide">Status</th>
                    <th className="pb-3 text-xs font-medium text-gray-600 uppercase tracking-wide">Days Ago</th>
                    <th className="pb-3 text-xs font-medium text-gray-600 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {leads.map((lead) => {
                    const daysAgo = getDaysAgo(lead.createdAt);
                    const isUrgent = lead.status === 'NEW' && daysAgo >= 2;

                    return (
                      <tr
                        key={lead.id}
                        className={`hover:bg-gray-50 transition-colors ${isUrgent ? 'bg-red-50/50' : ''}`}
                      >
                        <td className="py-4 text-sm text-gray-600">
                          {formatDate(lead.createdAt)}
                        </td>
                        <td className="py-4 text-sm font-medium text-gray-900">
                          {lead.name}
                        </td>
                        <td className="py-4 text-sm text-gray-600">
                          {lead.email}
                        </td>
                        <td className="py-4 text-sm text-gray-600">
                          {lead.phone || '—'}
                        </td>
                        <td className="py-4 text-sm text-gray-600">
                          {lead.budget || '—'}
                        </td>
                        <td className="py-4">
                          <InquiryStatusBadge status={lead.status} />
                        </td>
                        <td className="py-4">
                          <span className={`text-sm ${isUrgent ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                            {daysAgo} {daysAgo === 1 ? 'day' : 'days'}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex gap-2">
                            <AdminButton
                              href={`mailto:${lead.email}`}
                              variant="ghost"
                              size="sm"
                            >
                              Email
                            </AdminButton>
                          </div>
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
