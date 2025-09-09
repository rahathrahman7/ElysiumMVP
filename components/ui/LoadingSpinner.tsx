"use client";

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: 'gold' | 'white' | 'charcoal';
}

export default function LoadingSpinner({ 
  size = 'md', 
  className = "",
  color = 'gold' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  const colorClasses = {
    gold: 'border-gold',
    white: 'border-white',
    charcoal: 'border-charcoal'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className={`w-full h-full border-2 ${colorClasses[color]} border-t-transparent rounded-full animate-spin`} />
    </div>
  );
}

export function LoadingOverlay({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
      <div className="bg-white rounded-2xl p-8 shadow-xl max-w-sm mx-4 text-center animate-scale-in">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-charcoal font-medium">{message}</p>
      </div>
    </div>
  );
}

export function LoadingButton({ 
  loading = false, 
  children, 
  className = "",
  ...props 
}: { 
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) {
  return (
    <button
      disabled={loading}
      className={`relative ${className} ${loading ? 'opacity-75' : ''}`}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size="sm" color="white" />
        </div>
      )}
      <span className={loading ? 'opacity-0' : 'opacity-100'}>
        {children}
      </span>
    </button>
  );
}