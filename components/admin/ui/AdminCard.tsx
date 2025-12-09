import { ReactNode } from 'react';

interface AdminCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function AdminCard({ children, className = '', hover = false }: AdminCardProps) {
  return (
    <div
      className={`bg-white border border-[rgba(109,61,13,0.08)] shadow-sm p-6 ${
        hover ? 'hover:shadow-md transition-shadow duration-300' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: ReactNode;
}

export function StatCard({ title, value, change, changeType = 'neutral', icon }: StatCardProps) {
  const changeColors = {
    positive: 'text-emerald-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  };

  return (
    <AdminCard hover>
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-sans text-sm font-medium text-gray-600 uppercase tracking-wide">
          {title}
        </h3>
        {icon && <div className="text-[#D4AF37]">{icon}</div>}
      </div>
      <div className="text-3xl font-serif text-[#753600] mb-2">{value}</div>
      {change && (
        <p className={`text-sm font-medium ${changeColors[changeType]}`}>{change}</p>
      )}
    </AdminCard>
  );
}
