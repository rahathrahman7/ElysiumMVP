"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MiniCartIcon } from "@/components/MiniCartIcon";
import { WishlistIcon } from "@/components/WishlistIcon";
import { SearchBar } from "@/components/ui/SearchBar";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  // Track if we've scrolled past the hero section
  // Transparent over hero; gold once below
  useEffect(() => {
    const hero = document.getElementById('site-hero');
    const handler = () => {
      const y = window.scrollY || window.pageYOffset;
      const threshold = (hero?.offsetHeight ?? 0) - 10;
      setScrolledPastHero(y > threshold);
    };
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler as any);
  }, []);

  // Logo should be visible only when navbar has white background
  // On homepage: show ONLY when scrolled (navbar is white)
  // On other pages: always show
  const showLogo = isHomePage ? scrolledPastHero : true;

  return (
    <header className={`${isHomePage ? 'fixed' : 'sticky'} top-0 left-0 right-0 z-40 border-b border-transparent ${scrolledPastHero ? 'bg-white/95 backdrop-blur-sm' : 'bg-transparent'}`}>
      <div className="container mx-auto px-6 h-20 flex items-center justify-between gap-6">
        <Link
          href="/"
          className={`eb-serif text-3xl tracking-wide flex-shrink-0 transition-all duration-500 text-elysium-brown ${
            showLogo
              ? 'opacity-100'
              : 'opacity-0 pointer-events-none'
          }`}
        >
          ELYSIUM
        </Link>

        {/* Desktop Search */}
        <div className="hidden lg:block flex-1 max-w-md mx-8">
          <SearchBar />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8">
          {[
            { href: "/products", label: "Collection" },
            { href: "/bespoke", label: "Bespoke" },
            { href: "/heroes", label: "Heroes" },
            { href: "/education", label: "Education" },
            { href: "/about", label: "About" },
            { href: "/contact", label: "Contact" }
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`navbar-link eb-serif text-[20px] tracking-wide transition-colors duration-300 relative group ${
                scrolledPastHero
                  ? 'text-elysium-brown hover:text-elysium-gold'
                  : 'text-elysium-brown hover:text-elysium-gold'
              }`}
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-px bg-elysium-gold transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center gap-4 flex-shrink-0">
          {/* Search toggle for medium screens */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="lg:hidden p-2 text-[var(--color-ink-soft)] hover:text-[var(--color-gold)] transition-colors duration-200 focus:outline-none focus:text-[var(--color-gold)]"
            aria-label="Toggle search"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="M21 21l-4.35-4.35"></path>
            </svg>
          </button>
          
          <Link
            href="/bespoke"
            className="eb-serif px-4 py-2 rounded-md border border-elysium-brown text-elysium-brown hover:bg-elysium-gold hover:border-elysium-gold hover:text-elysium-brown transition-all duration-300 text-[20px]"
          >
            BOOK APPOINTMENT
          </Link>
          <WishlistIcon />
          <MiniCartIcon />
        </div>

        {/* Mobile Icons & Menu */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 text-[var(--color-ink-soft)] hover:text-[var(--color-gold)] transition-colors duration-200 focus:outline-none focus:text-[var(--color-gold)]"
            aria-label="Toggle search"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="M21 21l-4.35-4.35"></path>
            </svg>
          </button>
          <WishlistIcon />
          <MiniCartIcon />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[var(--color-ink)] hover:text-[var(--color-gold)] transition-colors duration-200 focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      {searchOpen && (
        <div className="lg:hidden bg-elysium-light border-t border-elysium-dark/20 animate-slide-in-top">
          <div className="container mx-auto px-6 py-4">
            <SearchBar />
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-elysium-light border-t border-elysium-dark/20 animate-slide-in-top">
          <nav className="container mx-auto px-6 py-4 space-y-1">
            {[
              { href: "/products", label: "Collection" },
              { href: "/bespoke", label: "Bespoke" },
              { href: "/heroes", label: "Heroes" },
              { href: "/education", label: "Education" },
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact" },
              { href: "/wishlist", label: "Wishlist" }
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 px-2 text-elysium-dark hover:text-white hover:bg-elysium-dark rounded-lg transition-all duration-200 font-serif font-medium"
              >
                {item.label}
              </Link>
            ))}
            
            <div className="pt-4 mt-4 border-t border-elysium-dark/20">
              <Link
                href="/bespoke"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-3 px-4 bg-elysium-dark text-elysium-light hover:bg-elysium-dark/90 rounded-lg transition-all duration-200 font-serif font-medium"
              >
                BOOK APPOINTMENT
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}