"use client";
import { useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { 
  DiamondShapeIcon,
  type DiamondShape
} from '@/components/icons/DiamondIcons';

interface DiamondShapeItem {
  shape: DiamondShape;
  name: string;
  description: string;
  href: string;
  popular?: boolean;
}

const diamondShapes: DiamondShapeItem[] = [
  {
    shape: 'round',
    name: 'Round Brilliant',
    description: 'Classic and most popular cut',
    href: '/diamonds?shape=round',
    popular: true,
  },
  {
    shape: 'oval',
    name: 'Oval',
    description: 'Elegant elongated brilliance',
    href: '/diamonds?shape=oval',
    popular: true,
  },
  {
    shape: 'princess',
    name: 'Princess',
    description: 'Modern square cut',
    href: '/diamonds?shape=princess',
  },
  {
    shape: 'pear',
    name: 'Pear',
    description: 'Unique teardrop shape',
    href: '/diamonds?shape=pear',
  },
  {
    shape: 'radiant',
    name: 'Radiant',
    description: 'Brilliant rectangular cut',
    href: '/diamonds?shape=radiant',
  },
  {
    shape: 'emerald',
    name: 'Emerald',
    description: 'Step-cut elegance',
    href: '/diamonds?shape=emerald',
  },
  {
    shape: 'marquise',
    name: 'Marquise',
    description: 'Regal pointed oval',
    href: '/diamonds?shape=marquise',
  },
  {
    shape: 'heart',
    name: 'Heart',
    description: 'Symbol of love',
    href: '/diamonds?shape=heart',
  },
  {
    shape: 'cushion',
    name: 'Cushion',
    description: 'Vintage pillow cut',
    href: '/diamonds?shape=cushion',
  },
];

interface DiamondShapesDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export default function DiamondShapesDropdown({ 
  isOpen, 
  onClose,
  className = "" 
}: DiamondShapesDropdownProps) {
  return (
    <div
      className={clsx(
        "absolute top-full left-0 w-80 bg-white/95 backdrop-blur-xl shadow-2xl border border-elysium-whisper transition-all duration-300 z-50",
        isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none",
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-elysium-whisper">
        <div className="flex items-center gap-3">
          <DiamondShapeIcon shape="princess" size={20} className="text-elysium-gold" />
          <h3 className="font-serif text-lg text-elysium-charcoal">Diamond Shapes</h3>
        </div>
        <p className="text-xs text-elysium-smoke mt-1 tracking-wide">
          Discover our curated selection of certified diamonds
        </p>
      </div>

      {/* Popular Shapes Section */}
      <div className="p-4 border-b border-elysium-whisper/50">
        <h4 className="text-xs uppercase tracking-widest text-elysium-smoke font-medium mb-3">
          Most Popular
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {diamondShapes.filter(shape => shape.popular).map((item) => (
            <Link
              key={item.shape}
              href={item.href}
              onClick={onClose}
              className={clsx(
                "group flex items-center gap-3 p-3 rounded-none",
                "hover:bg-elysium-gold/5 transition-all duration-300",
                "border border-transparent hover:border-elysium-gold/20"
              )}
            >
              <DiamondShapeIcon
                shape={item.shape}
                size={18}
                className="text-elysium-charcoal group-hover:text-elysium-gold transition-colors"
              />
              <div>
                <div className="text-sm font-medium text-elysium-charcoal group-hover:text-elysium-gold transition-colors">
                  {item.name}
                </div>
                <div className="text-xs text-elysium-smoke leading-tight">
                  {item.description}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* All Shapes Grid */}
      <div className="p-4">
        <h4 className="text-xs uppercase tracking-widest text-elysium-smoke font-medium mb-3">
          All Shapes
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {diamondShapes.map((item) => (
            <Link
              key={item.shape}
              href={item.href}
              onClick={onClose}
              className={clsx(
                "group flex flex-col items-center gap-2 p-3 rounded-none",
                "hover:bg-elysium-gold/5 transition-all duration-300",
                "border border-transparent hover:border-elysium-gold/20"
              )}
              title={item.description}
            >
              <DiamondShapeIcon
                shape={item.shape}
                size={24}
                className="text-elysium-charcoal group-hover:text-elysium-gold transition-colors"
              />
              <span className="text-xs text-elysium-charcoal group-hover:text-elysium-gold transition-colors text-center leading-tight">
                {item.name}
              </span>
              {item.popular && (
                <span className="text-[10px] bg-elysium-gold text-black px-2 py-0.5 rounded-none font-medium">
                  POPULAR
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="p-4 bg-elysium-ivory border-t border-elysium-whisper">
        <Link
          href="/diamonds"
          onClick={onClose}
          className={clsx(
            "block w-full py-3 text-center font-medium tracking-wide transition-all duration-300",
            "bg-elysium-brown text-white hover:bg-elysium-gold hover:text-elysium-brown hover:scale-105"
          )}
        >
          Browse All Diamonds
        </Link>
      </div>
    </div>
  );
}

// Dropdown trigger component for the navigation
interface DiamondShapesTriggerProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export function DiamondShapesTrigger({ 
  isOpen, 
  onToggle, 
  className = "" 
}: DiamondShapesTriggerProps) {
  return (
    <button
      onClick={onToggle}
      className={clsx(
        "group relative flex items-center gap-2 px-4 py-2 text-sm font-medium tracking-wide transition-all duration-300",
        "hover:text-elysium-gold",
        isOpen ? "text-elysium-gold" : "text-elysium-charcoal",
        className
      )}
    >
      <DiamondShapeIcon
        shape="princess"
        size={16}
        className="transition-transform duration-300 group-hover:scale-110"
      />
      <span>Diamonds</span>
      <svg
        className={clsx(
          "w-4 h-4 transition-transform duration-300",
          isOpen && "rotate-180"
        )}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>

      {/* Active/Hover Underline */}
      <span
        className={clsx(
          "absolute bottom-0 left-0 h-px bg-elysium-gold transition-all duration-300",
          isOpen ? "w-full" : "w-0 group-hover:w-full"
        )}
      />
    </button>
  );
}
