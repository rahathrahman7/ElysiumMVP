"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import DiamondShapesDropdown, { DiamondShapesTrigger } from '@/components/ui/DiamondShapesDropdown';

const navigationLinks = [
  { href: '/shop', label: 'Collections' },
  { href: '/heroes', label: 'Heroes' },
  { href: '/education', label: 'Education' },
  { href: '/bespoke', label: 'Bespoke' },
  { href: '/about', label: 'Our Story' },
];

export default function LuxuryHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDiamondDropdownOpen, setIsDiamondDropdownOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          <Link href="/" className="relative group">
            <div className="transition-all duration-300 group-hover:scale-105">
              <span className={clsx(
                "font-serif text-2xl font-bold tracking-[0.15em] transition-all duration-300",
                isHomePage 
                  ? (isScrolled ? "text-elysium-charcoal" : "text-white")
                  : "text-elysium-charcoal"
              )}>
                ELYSIUM
              </span>
            </div>
            <div className="absolute inset-0 bg-elysium-gold/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {/* Diamonds Dropdown */}
            <div className="relative">
              <DiamondShapesTrigger
                isOpen={isDiamondDropdownOpen}
                onToggle={() => setIsDiamondDropdownOpen(!isDiamondDropdownOpen)}
                className={clsx(
                  isHomePage
                    ? (isScrolled ? "text-elysium-charcoal" : "text-white")
                    : "text-elysium-charcoal"
                )}
              />
              <DiamondShapesDropdown
                isOpen={isDiamondDropdownOpen}
                onClose={() => setIsDiamondDropdownOpen(false)}
              />
            </div>

            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "relative px-4 py-2 text-sm font-medium tracking-wide transition-all duration-300 group overflow-hidden rounded-2xl",
                  "hover:text-white",
                  pathname === link.href
                    ? "text-elysium-gold"
                    : isHomePage
                    ? (isScrolled ? "text-elysium-charcoal hover:text-elysium-gold" : "text-white")
                    : "text-elysium-charcoal hover:text-elysium-gold"
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
                
                {/* Gold gradient effect when transparent over hero - matching "Explore Collection" button */}
                {isHomePage && !isScrolled && (
                  <>
                    <span className="absolute inset-0 bg-gradient-to-r from-elysium-gold to-amber-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 -z-10" />
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-2xl" />
                  </>
                )}
                
                {/* Regular hover glow for white navbar */}
                {(isScrolled || !isHomePage) && (
                  <span className="absolute inset-0 bg-elysium-gold/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
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
                  ? (isScrolled ? "text-elysium-charcoal" : "text-white")
                  : "text-elysium-charcoal"
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
                  ? (isScrolled ? "text-elysium-charcoal" : "text-white")
                  : "text-elysium-charcoal"
              )}
              aria-label="Shopping cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6" />
              </svg>
              {/* Cart badge - replace with actual cart count */}
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-elysium-gold text-white text-xs rounded-full flex items-center justify-center font-medium">
                2
              </span>
            </Link>

            {/* Wishlist Button */}
            <Link
              href="/wishlist"
              className={clsx(
                "p-2 rounded-full transition-all duration-300 hover:scale-110",
                "hover:bg-elysium-gold/10",
                isHomePage 
                  ? (isScrolled ? "text-elysium-charcoal" : "text-white")
                  : "text-elysium-charcoal"
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
                  ? (isScrolled ? "text-elysium-charcoal" : "text-white")
                  : "text-elysium-charcoal"
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
            "md:hidden overflow-hidden transition-all duration-500 ease-out",
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="py-6 space-y-4 bg-white/95 backdrop-blur-xl rounded-2xl mt-4 border border-elysium-whisper">
            {/* Mobile Diamonds Section */}
            <div className="px-6">
              <DiamondShapesTrigger
                isOpen={isDiamondDropdownOpen}
                onToggle={() => setIsDiamondDropdownOpen(!isDiamondDropdownOpen)}
                className="text-elysium-charcoal w-full justify-start"
              />
              {isDiamondDropdownOpen && (
                <div className="mt-3 pl-4 space-y-2">
                  {['round', 'oval', 'princess', 'pear', 'radiant'].map((shape) => (
                    <Link
                      key={shape}
                      href={`/diamonds/${shape}`}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsDiamondDropdownOpen(false);
                      }}
                      className="block py-2 text-sm text-elysium-smoke hover:text-elysium-gold transition-colors capitalize"
                    >
                      {shape} Diamonds
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {navigationLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={clsx(
                  "block px-6 py-3 text-elysium-charcoal font-medium tracking-wide transition-all duration-300",
                  "hover:text-elysium-gold hover:bg-elysium-gold/5 hover:translate-x-2",
                  pathname === link.href && "text-elysium-gold bg-elysium-gold/10"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Mobile CTA */}
            <div className="px-6 pt-4 border-t border-elysium-whisper">
              <Link
                href="/bespoke"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full py-3 px-6 bg-gradient-to-r from-elysium-gold to-amber-500 text-white text-center font-medium tracking-wide rounded-xl hover:scale-105 transition-transform duration-300"
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