"use client";
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import LuxuryHeader from '@/components/ui/LuxuryHeader';

interface ConditionalLayoutProps {
  children: ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  if (isHomePage) {
    // Homepage: Keep the floating header behavior
    return (
      <>
        <LuxuryHeader />
        <main id="main-content" className="min-h-[70vh] fade-in" tabIndex={-1}>
          {children}
        </main>
      </>
    );
  }

  // Other pages: Fixed header at top with content below
  return (
    <>
      <LuxuryHeader />
      <main id="main-content" className="min-h-[70vh] fade-in pt-20" tabIndex={-1}>
        {children}
      </main>
    </>
  );
}