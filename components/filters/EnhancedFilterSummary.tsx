"use client";
import { useState, useEffect } from "react";

interface FilterItem {
  key: string;
  value: string;
  count?: number;
}

interface EnhancedFilterSummaryProps {
  items: FilterItem[];
  onClear?: (key: string) => void;
  onClearAll?: () => void;
  className?: string;
  showAnimation?: boolean;
}

export default function EnhancedFilterSummary({
  items,
  onClear,
  onClearAll,
  className = "",
  showAnimation = true
}: EnhancedFilterSummaryProps) {
  const [isVisible, setIsVisible] = useState(false);
  const activeItems = items.filter(item => item.value);
  const totalActiveFilters = activeItems.reduce((sum, item) => sum + (item.count || 1), 0);

  useEffect(() => {
    if (activeItems.length > 0) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [activeItems.length]);

  if (activeItems.length === 0 && !isVisible) {
    return null;
  }

  return (
    <div className={[
      "filter-summary bg-[var(--surface-glass)] backdrop-blur-md border border-[var(--border-subtle)] rounded-[var(--radius-2xl)] p-4 transition-all duration-300",
      activeItems.length > 0 ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2",
      showAnimation && "animate-fade-in-up",
      className
    ].join(" ")}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-serif text-sm font-medium text-[var(--color-ink)]">
            Active Filters
          </h3>
          {totalActiveFilters > 0 && (
            <div className="selection-count-badge min-w-6 h-6 bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] text-white text-xs font-bold rounded-full flex items-center justify-center px-2">
              {totalActiveFilters}
            </div>
          )}
        </div>
        
        {activeItems.length > 0 && (
          <button
            onClick={onClearAll}
            className="clear-button text-xs font-medium text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors duration-200 focus:outline-none focus:text-[var(--color-gold)]"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Filter Tags */}
      {activeItems.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeItems.map((item, index) => (
            <div
              key={item.key}
              className={[
                "filter-tag inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--color-ivory)] border border-[var(--border-default)] rounded-full text-sm font-medium transition-all duration-200 group",
                "hover:bg-[var(--surface-elevated)] hover:border-[var(--color-gold)]/50 hover:shadow-sm",
                showAnimation && `animate-fade-in-left`
              ].join(" ")}
              style={{ animationDelay: showAnimation ? `${index * 0.1}s` : '0s' }}
            >
              <span className="text-[var(--color-ink)]">
                <span className="text-[var(--color-ink-soft)] font-normal">{item.key}:</span>
                {' '}
                <span className="font-medium">{item.value}</span>
              </span>
              
              {onClear && (
                <button
                  onClick={() => onClear(item.key)}
                  className="ml-1 w-4 h-4 rounded-full bg-[var(--color-ink-soft)]/20 hover:bg-[var(--color-gold)] text-[var(--color-ink-soft)] hover:text-white transition-all duration-200 flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/50 focus:bg-[var(--color-gold)] focus:text-white"
                  aria-label={`Remove ${item.key} filter`}
                >
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {activeItems.length === 0 && (
        <div className="text-center py-4 text-[var(--color-ink-soft)]">
          <div className="w-8 h-8 mx-auto mb-2 opacity-50">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
              <line x1="9" y1="9" x2="15" y2="15"></line>
              <line x1="15" y1="9" x2="9" y2="15"></line>
            </svg>
          </div>
          <p className="text-sm">No active filters</p>
        </div>
      )}
    </div>
  );
}