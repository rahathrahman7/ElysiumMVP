import Link from 'next/link';
import { AdminCard } from '../ui/AdminCard';
import { InquiryStatusBadge } from '../ui/AdminBadge';
import { AdminButton } from '../ui/AdminButton';
import { BespokeLead } from '@prisma/client';

interface PendingInquiriesProps {
  inquiries: BespokeLead[];
}

export function PendingInquiries({ inquiries }: PendingInquiriesProps) {
  const getDaysWaiting = (date: Date) => {
    const now = new Date();
    const created = new Date(date);
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyColor = (days: number) => {
    if (days >= 3) return 'text-red-600';
    if (days >= 2) return 'text-amber-600';
    return 'text-gray-600';
  };

  return (
    <AdminCard>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-serif text-[#753600]">Pending Inquiries</h2>
          <p className="text-sm text-gray-600 mt-1">Bespoke consultation requests needing response</p>
        </div>
        <Link
          href="/admin/inquiries"
          className="text-sm text-[#D4AF37] hover:text-[#753600] font-medium transition-colors"
        >
          View All →
        </Link>
      </div>

      {inquiries.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-600">All caught up! No pending inquiries.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inquiry) => {
            const daysWaiting = getDaysWaiting(inquiry.createdAt);
            const urgencyColor = getUrgencyColor(daysWaiting);

            return (
              <div
                key={inquiry.id}
                className="border border-gray-200 p-4 hover:border-[#D4AF37] transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{inquiry.name}</h3>
                    <p className="text-sm text-gray-600">{inquiry.email}</p>
                    {inquiry.phone && <p className="text-sm text-gray-500">{inquiry.phone}</p>}
                  </div>
                  <InquiryStatusBadge status={inquiry.status} />
                </div>

                {inquiry.budget && (
                  <p className="text-sm text-gray-700 mb-2">
                    <span className="font-medium">Budget:</span> {inquiry.budget}
                  </p>
                )}

                {inquiry.notes && (
                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">{inquiry.notes}</p>
                )}

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <span className={`text-sm font-medium ${urgencyColor}`}>
                    {daysWaiting} {daysWaiting === 1 ? 'day' : 'days'} waiting
                  </span>
                  <div className="flex gap-2">
                    <AdminButton
                      href={`/admin/inquiries?id=${inquiry.id}`}
                      variant="outline"
                      size="sm"
                    >
                      View
                    </AdminButton>
                    <AdminButton
                      href={`mailto:${inquiry.email}`}
                      variant="primary"
                      size="sm"
                    >
                      Email
                    </AdminButton>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminCard>
  );
}
