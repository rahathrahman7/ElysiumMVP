"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

interface BreadcrumbItem {
  label: string;
  href: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  const pathname = usePathname();
  
  const breadcrumbItems = useMemo(() => {
    if (items) {
      return items;
    }
    
    // Auto-generate breadcrumbs based on pathname
    const pathSegments = pathname.split('/').filter(Boolean);
    const generatedItems: BreadcrumbItem[] = [
      { label: 'Home', href: '/' }
    ];
    
    // Build breadcrumb items from path segments
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      // Convert segment to readable label
      let label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
        
      // Handle special cases
      switch (segment) {
        case 'products':
          label = 'Collection';
          break;
        case 'bespoke':
          label = 'Bespoke';
          break;
        case 'education':
          label = 'Education';
          break;
        case 'about':
          label = 'About';
          break;
        case 'contact':
          label = 'Contact';
          break;
        case 'heroes':
          label = 'Heroes';
          break;
        case 'wishlist':
          label = 'Wishlist';
          break;
        case 'cart':
          label = 'Cart';
          break;
        case 'checkout':
          label = 'Checkout';
          break;
        case 'diamonds':
          label = 'Diamonds';
          break;
        case 'metals':
          label = 'Metals';
          break;
      }
      
      generatedItems.push({
        label,
        href: currentPath,
        current: isLast
      });
    });
    
    return generatedItems;
  }, [pathname, items]);
  
  // Don't render breadcrumbs on home page
  if (pathname === '/' || breadcrumbItems.length <= 1) {
    return null;
  }
  
  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`breadcrumb ${className}`}
    >
      <ol className="flex items-center space-x-2 text-sm text-[var(--color-ink-soft)]">
        {breadcrumbItems.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && (
              <svg 
                className="separator w-4 h-4 mx-2 text-[var(--border-strong)]" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
            
            {item.current ? (
              <span 
                className="text-[var(--color-ink)] font-medium cursor-default"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-[var(--color-gold)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/20 focus:rounded"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Utility hook for getting current page title from breadcrumb
export function usePageTitle(): string {
  const pathname = usePathname();
  
  return useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) return 'Home';
    
    const lastSegment = segments[segments.length - 1];
    
    // Convert slug to title
    const title = lastSegment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    // Handle special cases
    switch (segments[0]) {
      case 'products':
        if (segments.length === 1) return 'Collection';
        return title; // Product name
      case 'bespoke':
        return 'Bespoke Service';
      case 'education':
        if (segments.length === 1) return 'Education Hub';
        return `${title} Guide`;
      case 'about':
        return 'About ELYSIUM';
      case 'contact':
        return 'Contact Us';
      case 'heroes':
        return 'Heroes Collection';
      case 'wishlist':
        return 'Your Wishlist';
      case 'cart':
        return 'Shopping Cart';
      case 'checkout':
        return 'Checkout';
      default:
        return title;
    }
  }, [pathname]);
}