import { ReactNode, ButtonHTMLAttributes } from 'react';
import Link from 'next/link';

interface AdminButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  className?: string;
}

export function AdminButton({
  children,
  variant = 'primary',
  size = 'md',
  href,
  className = '',
  ...props
}: AdminButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4AF37] disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-[#D4AF37] text-[#753600] hover:bg-[#753600] hover:text-white',
    secondary: 'bg-[#753600] text-white hover:bg-[#D4AF37] hover:text-[#753600]',
    outline: 'border-2 border-[#753600] text-[#753600] hover:bg-[#753600] hover:text-white',
    ghost: 'text-[#753600] hover:bg-[#F8F6F2]',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
