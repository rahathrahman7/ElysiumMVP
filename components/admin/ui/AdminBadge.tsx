import { ReactNode } from 'react';
import { OrderStatus } from '@prisma/client';

interface AdminBadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

export function AdminBadge({ children, variant = 'default', className = '' }: AdminBadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-800 border-gray-200',
    success: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-100 text-amber-800 border-amber-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200'
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 border text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const statusConfig: Record<OrderStatus, { label: string; variant: 'default' | 'success' | 'warning' | 'error' | 'info' }> = {
    PENDING: { label: 'Pending', variant: 'warning' },
    PROCESSING: { label: 'Processing', variant: 'info' },
    PAYMENT_FAILED: { label: 'Payment Failed', variant: 'error' },
    PAID: { label: 'Paid', variant: 'success' },
    FULFILLED: { label: 'Fulfilled', variant: 'success' },
    SHIPPED: { label: 'Shipped', variant: 'info' },
    DELIVERED: { label: 'Delivered', variant: 'success' },
    CANCELLED: { label: 'Cancelled', variant: 'error' },
    REFUNDED: { label: 'Refunded', variant: 'warning' }
  };

  const config = statusConfig[status];

  return <AdminBadge variant={config.variant}>{config.label}</AdminBadge>;
}

interface InquiryStatusBadgeProps {
  status: string;
}

export function InquiryStatusBadge({ status }: InquiryStatusBadgeProps) {
  const statusConfig: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'error' | 'info' }> = {
    NEW: { label: 'New', variant: 'warning' },
    CONTACTED: { label: 'Contacted', variant: 'info' },
    QUOTED: { label: 'Quoted', variant: 'info' },
    NEGOTIATING: { label: 'Negotiating', variant: 'warning' },
    CONVERTED: { label: 'Converted', variant: 'success' },
    LOST: { label: 'Lost', variant: 'error' },
    ARCHIVED: { label: 'Archived', variant: 'default' }
  };

  const config = statusConfig[status] || { label: status, variant: 'default' as const };

  return <AdminBadge variant={config.variant}>{config.label}</AdminBadge>;
}
