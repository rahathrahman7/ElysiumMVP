"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/productTypes";
import { resolvePrimary } from "@/lib/imageResolver";

// Lazy load products to avoid importing large array at build time
let cachedProducts: Product[] | null = null;
const loadProducts = async (): Promise<Product[]> => {
  if (!cachedProducts) {
    const mod = await import('@/lib/products');
    cachedProducts = mod.getAllProducts();
  }
  return cachedProducts;
};

interface SearchBarProps {
  className?: string;
}

export function SearchBar({ className = "" }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Search products based on query
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    // Use async loading to avoid importing large products array at build time
    const searchProducts = async () => {
      const allProducts = await loadProducts();
      const searchQuery = query.toLowerCase().trim();
      
      const filteredProducts = allProducts.filter(product => {
        const matchesTitle = product.title.toLowerCase().includes(searchQuery);
        const matchesDescription = product.description?.toLowerCase().includes(searchQuery);
        const matchesMetal = (product as unknown as { metal?: string }).metal?.toLowerCase().includes(searchQuery);
        const matchesStyle = (product as unknown as { style?: string }).style?.toLowerCase().includes(searchQuery);
        const matchesShape = product.shape?.toLowerCase().includes(searchQuery);
        
        return matchesTitle || matchesDescription || matchesMetal || matchesStyle || matchesShape;
      }).slice(0, 6); // Limit to 6 results

      setResults(filteredProducts);
      setSelectedIndex(-1);
    };

    searchProducts();
  }, [query]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => prev > -1 ? prev - 1 : -1);
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          window.location.href = `/products/${results[selectedIndex].slug}`;
        } else if (results.length > 0) {
          window.location.href = `/products/${results[0].slug}`;
        }
        break;
      case "Escape":
        setIsOpen(false);
        setQuery("");
        inputRef.current?.blur();
        break;
    }
  };

  // Close search when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search rings..."
          className="search-input w-full pl-4 pr-12 py-2.5 border border-[var(--line)] rounded-md bg-white/40 text-black placeholder-black/50 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-[var(--ring)] transition-all duration-200"
          aria-label="Search products"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          role="combobox"
          aria-autocomplete="list"
        />
        
        <button
          type="submit"
          className="search-button absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-black/70 hover:text-black transition-colors duration-200 focus:outline-none"
          aria-label="Search"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="M21 21l-4.35-4.35"></path>
          </svg>
        </button>
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (query.length >= 2 || results.length > 0) && (
        <div 
          className="search-results absolute top-full left-0 right-0 mt-2 bg-white backdrop-blur-md border border-neutral-200 rounded-xl shadow-xl max-h-96 overflow-y-auto z-50 animate-scale-in"
          role="listbox"
        >
          {results.length > 0 ? (
            <>
              {results.map((product, index) => (
                <Link
                  key={product.slug}
                  href={`/products/${product.slug}`}
                  className={`search-result-item flex items-center px-4 py-3 hover:bg-[var(--color-ivory)] transition-colors duration-150 cursor-pointer ${
                    index === selectedIndex ? 'bg-[var(--color-ivory)]' : ''
                  } ${index === 0 ? 'rounded-t-[var(--radius-xl)]' : ''} ${
                    index === results.length - 1 ? 'rounded-b-[var(--radius-xl)]' : ''
                  }`}
                  onClick={() => {
                    setIsOpen(false);
                    setQuery("");
                  }}
                  role="option"
                  aria-selected={index === selectedIndex}
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-[var(--color-ivory)] mr-3">
                    {product.images?.[0] && (
                      <Image
                        src={resolvePrimary(product)}
                        alt={product.title}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-[var(--color-ink)] truncate">
                      {product.title}
                    </h4>
                    <div className="flex items-center mt-1 text-xs text-[var(--color-ink-soft)] space-x-2">
                      {product.metal && (
                        <span className="capitalize">{product.metal}</span>
                      )}
                      {product.style && product.metal && (
                        <span>•</span>
                      )}
                      {product.style && (
                        <span className="capitalize">{product.style}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-sm font-medium text-[var(--color-ink-soft)]">
                    {new Intl.NumberFormat("en-GB", {
                      style: "currency",
                      currency: "GBP",
                      maximumFractionDigits: 0,
                    }).format(product.basePriceGBP / 100)}
                  </div>
                </Link>
              ))}
              
              {/* View All Results Link */}
              <div className="border-t border-[var(--border-subtle)] p-3">
                <Link
                  href={`/products?search=${encodeURIComponent(query)}`}
                  className="block w-full text-center py-2 text-sm font-medium text-[var(--color-gold)] hover:text-[var(--color-gold-dark)] transition-colors duration-200"
                  onClick={() => {
                    setIsOpen(false);
                    setQuery("");
                  }}
                >
                  View all results for "{query}" →
                </Link>
              </div>
            </>
          ) : query.length >= 2 ? (
            <div className="px-4 py-8 text-center text-[var(--color-ink-soft)]">
              <div className="mb-2">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto opacity-50">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="M21 21l-4.35-4.35"></path>
                </svg>
              </div>
              <p className="text-sm">No results found for "{query}"</p>
              <p className="text-xs mt-1">Try different keywords or browse our collection</p>
            </div>
          ) : (
            <div className="px-4 py-6 text-center text-[var(--color-ink-soft)]">
              <p className="text-sm">Start typing to search...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}