"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useCartStore } from '@/lib/state/cart';
import DiamondShapesDropdown, { DiamondShapesTrigger } from '@/components/ui/DiamondShapesDropdown';
import CollectionsMegaMenu, { CollectionsTrigger } from '@/components/ui/CollectionsMegaMenu';
import EducationMegaMenu, { EducationTrigger } from '@/components/ui/EducationMegaMenu';
import { DiamondShapeIcon } from '@/components/icons/DiamondIcons';

// Desktop navigation links (Collections & Education have their own mega-menus)
const navigationLinks = [
  { href: '/heroes', label: 'Heroes', icon: 'star' },
  { href: '/bespoke', label: 'Bespoke', icon: 'pen' },
  { href: '/about', label: 'Our Story', icon: 'heart' },
];

// Mobile menu items with nested structure
interface MobileMenuItem {
  label: string;
  href?: string;
  icon?: string;
  children?: MobileMenuItem[];
}

const mobileMenuItems: MobileMenuItem[] = [
  { 
    label: 'Diamonds', 
    icon: 'diamond',
    children: [
      { label: 'Round Diamonds', href: '/shop?shape=round' },
      { label: 'Oval Diamonds', href: '/shop?shape=oval' },
      { label: 'Princess Diamonds', href: '/shop?shape=princess' },
      { label: 'Pear Diamonds', href: '/shop?shape=pear' },
      { label: 'Radiant Diamonds', href: '/shop?shape=radiant' },
      { label: 'Emerald Diamonds', href: '/shop?shape=emerald' },
      { label: 'Marquise Diamonds', href: '/shop?shape=marquise' },
      { label: 'Cushion Diamonds', href: '/shop?shape=cushion' },
      { label: 'Heart Diamonds', href: '/shop?shape=heart' },
      { label: 'Browse All', href: '/shop' },
    ]
  },
  { 
    label: 'Collections', 
    icon: 'grid',
    children: [
      { label: 'Ready to Wear Engagement Rings', href: '/shop?category=ring' },
      { label: "Men's Wedding Bands", href: '/shop?category=mens-rings' },
      { 
        label: 'Fine Jewellery',
        href: '/fine-jewellery',
        children: [
          { label: 'Earrings', href: '/fine-jewellery/earrings' },
          { label: 'Necklaces', href: '/fine-jewellery/necklaces' },
          { label: 'Bracelets', href: '/fine-jewellery/bracelets' },
        ]
      },
    ]
  },
  { label: 'Heroes', href: '/heroes', icon: 'star' },
  { 
    label: 'Education', 
    icon: 'book',
    children: [
      { label: 'Diamond Education', href: '/education/diamonds' },
      { label: 'Metal Education', href: '/education/metals' },
    ]
  },
  { label: 'Bespoke', href: '/bespoke', icon: 'pen' },
  { label: 'Our Story', href: '/about', icon: 'heart' },
];

// Icon component for mobile menu
const NavIcon = ({ type }: { type?: string }) => {
  if (!type) return null;
  const iconClass = "w-4 h-4 mr-3 flex-shrink-0";
  switch (type) {
    case 'diamond':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3L2 9l10 12 10-12-10-6z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2 9h20" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v6" />
        </svg>
      );
    case 'grid':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      );
    case 'star':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      );
    case 'book':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    case 'pen':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      );
    case 'heart':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      );
    default:
      return null;
  }
};

function CartBadge() {
  const count = useCartStore((s) => s.items.length);
  if (count === 0) return null;
  return (
    <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1 bg-elysium-gold text-white text-xs rounded-full flex items-center justify-center font-medium">
      {count > 99 ? "99+" : count}
    </span>
  );
}

export default function LuxuryHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDiamondDropdownOpen, setIsDiamondDropdownOpen] = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const [isEducationOpen, setIsEducationOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());
  
  const collectionsDropdownRef = useRef<HTMLDivElement>(null);
  const educationDropdownRef = useRef<HTMLDivElement>(null);

  const toggleMenu = (label: string) => {
    setExpandedMenus(prev => {
      const newSet = new Set(prev);
      if (newSet.has(label)) {
        newSet.delete(label);
      } else {
        newSet.add(label);
      }
      return newSet;
    });
  };

  // Recursive menu item renderer for mobile menu
  const renderMobileMenuItem = (item: MobileMenuItem, depth: number = 0): React.ReactNode => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus.has(item.label);
    const paddingLeft = 24 + (depth * 16);
    
    if (hasChildren) {
      return (
        <div key={item.label}>
          <button
            onClick={() => toggleMenu(item.label)}
            className={clsx(
              "flex items-center justify-between w-full py-3 text-[#45321e] font-medium tracking-wide transition-all duration-300",
              "hover:text-elysium-gold hover:bg-elysium-gold/5",
              isExpanded && "text-elysium-gold bg-elysium-gold/10"
            )}
            style={{ paddingLeft: `${paddingLeft}px`, paddingRight: '24px' }}
          >
            <div className="flex items-center">
              {depth === 0 && <NavIcon type={item.icon} />}
              {item.label}
            </div>
            <svg 
              className={clsx("w-4 h-4 transition-transform duration-200", isExpanded && "rotate-180")}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div className={clsx(
            "overflow-hidden transition-all duration-300 ease-in-out",
            isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          )}>
            {item.children?.map(child => renderMobileMenuItem(child, depth + 1))}
          </div>
        </div>
      );
    }
    
    // Render as link for items without children
    return (
      <Link
        key={item.href || item.label}
        href={item.href || '#'}
        onClick={() => {
          setIsMobileMenuOpen(false);
          setExpandedMenus(new Set());
        }}
        className={clsx(
          "flex items-center py-3 text-[#45321e] font-medium tracking-wide transition-all duration-300",
          "hover:text-elysium-gold hover:bg-elysium-gold/5",
          pathname === item.href && "text-elysium-gold bg-elysium-gold/10"
        )}
        style={{ paddingLeft: `${paddingLeft}px`, paddingRight: '24px' }}
      >
        {depth === 0 && <NavIcon type={item.icon} />}
        {item.label}
      </Link>
    );
  };
  const diamondDropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close diamond dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (diamondDropdownRef.current && !diamondDropdownRef.current.contains(event.target as Node)) {
        setIsDiamondDropdownOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDiamondDropdownOpen(false);
      }
    };

    if (isDiamondDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isDiamondDropdownOpen]);

  // Close collections dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (collectionsDropdownRef.current && !collectionsDropdownRef.current.contains(event.target as Node)) {
        setIsCollectionsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsCollectionsOpen(false);
      }
    };

    if (isCollectionsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isCollectionsOpen]);

  // Close education dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (educationDropdownRef.current && !educationDropdownRef.current.contains(event.target as Node)) {
        setIsEducationOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsEducationOpen(false);
      }
    };

    if (isEducationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isEducationOpen]);

  // Close dropdowns when route changes
  useEffect(() => {
    setIsDiamondDropdownOpen(false);
    setIsCollectionsOpen(false);
    setIsEducationOpen(false);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isHomePage
          ? isScrolled
            ? "bg-white/95 backdrop-blur-xl shadow-2xl shadow-black/5 border-b border-elysium-whisper"
            : "bg-transparent"
          : "bg-white/95 backdrop-blur-xl shadow-2xl shadow-black/5 border-b border-elysium-whisper"
      )}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className={clsx("relative transition-all duration-300", isHomePage && !isScrolled ? "opacity-0 pointer-events-none" : "opacity-100")}>
            <div className="group transition-all duration-300 hover:scale-105">
              <span
                className="font-serif text-2xl font-bold tracking-[0.15em] transition-all duration-300"
                style={{
                  color: isHomePage
                    ? (isScrolled ? "var(--elysium-brown)" : "white")
                    : "var(--elysium-brown)"
                }}
              >
                ELYSIUM
              </span>
            </div>
            <div className="absolute inset-0 bg-elysium-gold/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {/* Diamonds Dropdown */}
            <div className="relative" ref={diamondDropdownRef}>
              <DiamondShapesTrigger
                isOpen={isDiamondDropdownOpen}
                onToggle={() => {
                  setIsDiamondDropdownOpen(!isDiamondDropdownOpen);
                  setIsCollectionsOpen(false);
                  setIsEducationOpen(false);
                }}
                className={clsx(
                  isHomePage
                    ? (isScrolled ? "text-[#45321e]" : "text-white")
                    : "text-[#45321e]"
                )}
              />
              <DiamondShapesDropdown
                isOpen={isDiamondDropdownOpen}
                onClose={() => setIsDiamondDropdownOpen(false)}
              />
            </div>

            {/* Collections Mega Menu */}
            <div className="relative" ref={collectionsDropdownRef}>
              <CollectionsTrigger
                isOpen={isCollectionsOpen}
                onToggle={() => {
                  setIsCollectionsOpen(!isCollectionsOpen);
                  setIsDiamondDropdownOpen(false);
                  setIsEducationOpen(false);
                }}
                className={clsx(
                  isHomePage
                    ? (isScrolled ? "text-[#45321e]" : "text-white")
                    : "text-[#45321e]"
                )}
              />
              <CollectionsMegaMenu
                isOpen={isCollectionsOpen}
                onClose={() => setIsCollectionsOpen(false)}
              />
            </div>

            {/* Education Mega Menu */}
            <div className="relative" ref={educationDropdownRef}>
              <EducationTrigger
                isOpen={isEducationOpen}
                onToggle={() => {
                  setIsEducationOpen(!isEducationOpen);
                  setIsDiamondDropdownOpen(false);
                  setIsCollectionsOpen(false);
                }}
                className={clsx(
                  isHomePage
                    ? (isScrolled ? "text-[#45321e]" : "text-white")
                    : "text-[#45321e]"
                )}
              />
              <EducationMegaMenu
                isOpen={isEducationOpen}
                onClose={() => setIsEducationOpen(false)}
              />
            </div>

            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "relative px-4 py-2 text-sm font-medium tracking-wide transition-all duration-300 group overflow-hidden rounded-2xl",
                  pathname === link.href
                    ? "text-elysium-gold"
                    : isHomePage
                    ? (isScrolled ? "text-[#45321e]" : "text-white")
                    : "text-[#45321e]"
                )}
              >
                {link.label}
                
                {/* Gold Underline - Only show when navbar is white (scrolled) */}
                {(isScrolled || !isHomePage) && (
                  <span
                    className={clsx(
                      "absolute bottom-0 left-0 h-px bg-elysium-gold transition-all duration-300",
                      pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                    )}
                  />
                )}
                
                {/* Glassmorphism effect for transparent navbar */}
                {isHomePage && !isScrolled && (
                  <span className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <button
              className={clsx(
                "p-2 rounded-full transition-all duration-300 hover:scale-110",
                "hover:bg-elysium-gold/10",
                isHomePage 
                  ? (isScrolled ? "text-[#45321e]" : "text-white")
                  : "text-[#45321e]"
              )}
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Cart Button with Badge */}
            <Link
              href="/cart"
              className={clsx(
                "relative p-2 rounded-full transition-all duration-300 hover:scale-110",
                "hover:bg-elysium-gold/10",
                isHomePage 
                  ? (isScrolled ? "text-[#45321e]" : "text-white")
                  : "text-[#45321e]"
              )}
              aria-label="Shopping cart"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 32 32"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M29.46 10.14A2.94 2.94 0 0 0 27.1 9H10.22L8.76 6.35A2.67 2.67 0 0 0 6.41 5H3a1 1 0 0 0 0 2h3.41a.68.68 0 0 1 .6.31l1.65 3 .86 9.32a3.84 3.84 0 0 0 4 3.38h10.37a3.92 3.92 0 0 0 3.85-2.78l2.17-7.82a2.58 2.58 0 0 0-.45-2.27zM28 11.86l-2.17 7.83A1.93 1.93 0 0 1 23.89 21H13.48a1.89 1.89 0 0 1-2-1.56L10.73 11H27.1a1 1 0 0 1 .77.35.59.59 0 0 1 .13.51z"
                />
                <circle cx="14" cy="26" r="2" fill="currentColor" />
                <circle cx="24" cy="26" r="2" fill="currentColor" />
              </svg>
              <CartBadge />
            </Link>

            {/* Wishlist Button */}
            <Link
              href="/wishlist"
              className={clsx(
                "p-2 rounded-full transition-all duration-300 hover:scale-110",
                "hover:bg-elysium-gold/10",
                isHomePage 
                  ? (isScrolled ? "text-[#45321e]" : "text-white")
                  : "text-[#45321e]"
              )}
              aria-label="Wishlist"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={clsx(
                "md:hidden p-2 rounded-full transition-all duration-300",
                "hover:bg-elysium-gold/10",
                isHomePage 
                  ? (isScrolled ? "text-[#45321e]" : "text-white")
                  : "text-[#45321e]"
              )}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={clsx(
            "md:hidden transition-all duration-500 ease-out",
            isMobileMenuOpen ? "max-h-[85vh] opacity-100 overflow-y-auto" : "max-h-0 opacity-0 overflow-hidden"
          )}
        >
          <div className="py-6 bg-white/95 backdrop-blur-xl rounded-2xl mt-4 border border-elysium-whisper">
            {/* Mobile Menu Items with Dropdowns */}
            <div className="space-y-1">
              {mobileMenuItems.map(item => renderMobileMenuItem(item, 0))}
            </div>
            
            {/* Mobile CTA */}
            <div className="px-6 pt-4 border-t border-elysium-whisper">
              <Link
                href="/bespoke"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full py-3 px-6 bg-elysium-brown text-white text-center font-medium tracking-wide rounded-xl hover:bg-elysium-gold hover:text-elysium-brown hover:scale-105 transition-all duration-300"
              >
                Book Consultation
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Elegant bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-elysium-gold/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </header>
  );
}
