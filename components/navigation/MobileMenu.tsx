"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface MenuItem {
  label: string;
  href?: string;
  children?: MenuItem[];
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [mounted, setMounted] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      // Reset expanded items when menu closes
      setExpandedItems(new Set());
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleExpand = (label: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(label)) {
        newSet.delete(label);
      } else {
        newSet.add(label);
      }
      return newSet;
    });
  };

  if (!mounted) return null;

  const menuItems: MenuItem[] = [
    { label: 'Home', href: '/' },
    { 
      label: 'Collection',
      children: [
        { label: 'All Jewellery', href: '/products' },
        { label: 'Engagement Rings', href: '/products?category=engagement' },
        { label: "Men's Wedding Bands", href: '/products?category=mens-rings' },
        { 
          label: 'Fine Jewellery',
          children: [
            { label: 'Earrings', href: '/shop?category=earrings' },
            { label: 'Bracelets', href: '/shop?category=bracelets' },
            { label: 'Necklaces', href: '/shop?category=necklaces' },
          ]
        },
      ]
    },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const renderMenuItem = (item: MenuItem, index: number, depth: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.label);
    const paddingLeft = 24 + (depth * 16); // Base 24px + 16px per depth level

    if (hasChildren) {
      return (
        <li key={item.label}>
          <button
            onClick={() => toggleExpand(item.label)}
            className="flex items-center justify-between w-full py-4 text-lg font-medium text-charcoal hover:bg-ivory hover:text-gold transition-all duration-200 active:bg-beige touch-manipulation animate-slide-in-right"
            style={{ 
              paddingLeft: `${paddingLeft}px`, 
              paddingRight: '24px',
              animationDelay: `${index * 50}ms`, 
              animationFillMode: 'both',
              fontSize: depth > 0 ? '15px' : '18px',
            }}
          >
            <span>{item.label}</span>
            <svg 
              className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <ul 
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            {item.children?.map((child, childIndex) => 
              renderMenuItem(child, index + childIndex + 1, depth + 1)
            )}
          </ul>
        </li>
      );
    }

    return (
      <li key={item.href || item.label}>
        <Link
          href={item.href || '#'}
          onClick={onClose}
          className="block py-4 text-lg font-medium text-charcoal hover:bg-ivory hover:text-gold transition-all duration-200 active:bg-beige touch-manipulation animate-slide-in-right"
          style={{ 
            paddingLeft: `${paddingLeft}px`, 
            paddingRight: '24px',
            animationDelay: `${index * 50}ms`, 
            animationFillMode: 'both',
            fontSize: depth > 0 ? '15px' : '18px',
          }}
        >
          {item.label}
        </Link>
      </li>
    );
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <Image
            src="/logo/image.png"
            alt="Elysium London"
            width={120}
            height={30}
            className="h-8 w-auto"
          />
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-gray-500 hover:text-charcoal transition-colors touch-manipulation"
            aria-label="Close menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Menu Items */}
        <nav className="py-6">
          <ul className="space-y-1">
            {menuItems.map((item, index) => renderMenuItem(item, index))}
          </ul>
        </nav>

        {/* Footer Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100 bg-gray-50">
          <div className="space-y-3">
            <Link
              href="/wishlist"
              onClick={onClose}
              className="flex items-center justify-center w-full py-3 text-sm font-medium text-charcoal border border-gray-200 rounded-lg hover:bg-white transition-colors touch-manipulation active:scale-95"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              Wishlist
            </Link>
            <Link
              href="/contact"
              onClick={onClose}
              className="flex items-center justify-center w-full py-3 text-sm font-medium text-white bg-gold rounded-lg hover:bg-gold/90 transition-colors touch-manipulation active:scale-95"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Book Consultation
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}