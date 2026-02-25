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
}

const diamondShapes: DiamondShapeItem[] = [
  { shape: 'round',    name: 'Round Brilliant', description: 'Classic and most popular cut',  href: '/shop?shape=round'    },
  { shape: 'oval',     name: 'Oval',            description: 'Elegant elongated brilliance',  href: '/shop?shape=oval'     },
  { shape: 'princess', name: 'Princess',        description: 'Modern square cut',             href: '/shop?shape=princess' },
  { shape: 'pear',     name: 'Pear',            description: 'Unique teardrop shape',         href: '/shop?shape=pear'     },
  { shape: 'radiant',  name: 'Radiant',         description: 'Brilliant rectangular cut',     href: '/shop?shape=radiant'  },
  { shape: 'emerald',  name: 'Emerald',         description: 'Step-cut elegance',             href: '/shop?shape=emerald'  },
  { shape: 'marquise', name: 'Marquise',        description: 'Regal pointed oval',            href: '/shop?shape=marquise' },
  { shape: 'heart',    name: 'Heart',           description: 'Symbol of love',                href: '/shop?shape=heart'    },
  { shape: 'cushion',  name: 'Cushion',         description: 'Vintage pillow cut',            href: '/shop?shape=cushion'  },
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
        "absolute top-full left-0 w-[340px] bg-[#F5EFE6] shadow-2xl border border-elysium-whisper transition-all duration-300 z-50",
        isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none",
        className
      )}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-elysium-whisper">
        <h3 className="font-serif text-base text-elysium-charcoal tracking-wide">Diamond Shapes</h3>
        <p className="text-[11px] text-elysium-smoke mt-0.5 tracking-wider uppercase">
          Select your preferred cut
        </p>
      </div>

      {/* Shapes Grid */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-1">
          {diamondShapes.map((item) => (
            <Link
              key={item.shape}
              href={item.href}
              onClick={onClose}
              className={clsx(
                "group flex flex-col items-center gap-2.5 py-4 px-2",
                "hover:bg-elysium-gold/5 transition-all duration-200",
                "border border-transparent hover:border-elysium-gold/20"
              )}
              title={item.description}
            >
              <DiamondShapeIcon
                shape={item.shape}
                size={30}
                className="text-[#6D3D0D] group-hover:text-elysium-gold transition-colors duration-200"
              />
              <span className="text-[11px] tracking-wide text-elysium-charcoal/80 group-hover:text-elysium-gold transition-colors duration-200 text-center leading-tight font-medium">
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="px-4 pb-4">
        <Link
          href="/shop"
          onClick={onClose}
          className={clsx(
            "block w-full py-2.5 text-center text-xs font-medium tracking-widest uppercase transition-all duration-300",
            "bg-elysium-brown text-white hover:bg-elysium-gold hover:text-elysium-brown"
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
  const handleToggle = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle();
  };

  return (
    <button
      onClick={handleToggle}
      onTouchEnd={handleToggle}
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
