"use client";

import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';

interface CollectionsMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

// Engagement ring styles
const ringStyles = [
  {
    label: "Toi et Moi",
    href: "/shop?category=ring&shape=toi-et-moi",
    image: "/products/Orabella/orabella-gold-front.jpeg",
  },
  {
    label: "Hidden Halo",
    href: "/shop?category=ring&style=hidden-halo",
    image: "/products/vow-and-veil/VV-gold-front.jpeg",
  },
  {
    label: "Trilogy",
    href: "/shop?category=ring&style=three-stone",
    image: "/products/Elara/Elara-gold-front.jpeg",
  },
];

// Fine Jewellery sub-categories
const fineJewelleryItems = [
  {
    label: "Earrings",
    href: "/fine-jewellery/earrings",
    image: "/products/Earrings/Eternal/eternal-gold-front.PNG",
  },
  {
    label: "Necklaces",
    href: "/fine-jewellery/necklaces",
    comingSoon: true,
  },
];

// Wedding band categories
const weddingBandItems = [
  {
    label: "Men's Wedding Bands",
    href: "/shop?category=mens-rings",
    image: "/products/mens-rings/Arden/Arden-gold.jpeg",
  },
  {
    label: "Women's Wedding Bands",
    href: "/shop?category=womens-rings",
    image: "/products/mens-rings/Arden/Arden-gold.jpeg",
  },
];

// Shared image frame style
const frameStyle = {
  backgroundColor: "#E8E2DA",
  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
};

// Column header component
function ColumnHeader({ label }: { label: string }) {
  return (
    <div className="mb-5">
      <h4 className="text-[10px] text-[#6D3D0D]/40 uppercase tracking-[0.25em] font-light mb-2">{label}</h4>
      <div className="w-12 h-px bg-[#D4AF37]/60" />
    </div>
  );
}

// Gem placeholder icon
function GemPlaceholder() {
  return (
    <svg className="w-5 h-5 text-[#D4AF37]/25" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5l-3 5 10 13L22 8l-3-5h-4M9 3l3 5m0 0l3-5M12 8L2 8m10 0l10 0" />
    </svg>
  );
}

// Thumbnail row — no margin; parent uses space-y for rhythm
function ThumbRow({
  href,
  image,
  label,
  comingSoon,
  onClose,
}: {
  href: string;
  image?: string;
  label: string;
  comingSoon?: boolean;
  onClose: () => void;
}) {
  const inner = (
    <>
      <div className="flex-shrink-0 p-[4px]" style={frameStyle}>
        <div className="relative w-12 h-12 overflow-hidden bg-white">
          {image ? (
            <Image
              src={image}
              alt={label}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              sizes="48px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <GemPlaceholder />
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-[#6D3D0D] group-hover:text-[#D4AF37] transition-colors duration-300">
          {label}
        </span>
        {comingSoon && (
          <span className="text-[9px] text-[#D4AF37]/50 italic mt-0.5">Coming Soon</span>
        )}
      </div>
    </>
  );

  if (comingSoon) {
    return (
      <div className="group flex items-center gap-3 px-2 py-1 rounded-sm cursor-default opacity-60">
        {inner}
      </div>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClose}
      className="group flex items-center gap-3 px-2 py-1 rounded-sm hover:bg-elysium-gold/5 transition-colors duration-200"
    >
      {inner}
    </Link>
  );
}

// Browse All link — pinned to column bottom via mt-auto
function BrowseAllLink({ href, label, onClose }: { href: string; label: string; onClose: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="mt-auto pt-5 text-[10px] text-[#D4AF37] hover:text-[#6D3D0D] transition-colors tracking-[0.15em] uppercase"
    >
      {label} &rarr;
    </Link>
  );
}

export default function CollectionsMegaMenu({
  isOpen,
  onClose,
}: CollectionsMegaMenuProps) {
  return (
    <div
      className={clsx(
        "absolute top-full left-1/2 -translate-x-1/2 w-[960px] bg-[#F5EFE6] shadow-2xl border border-elysium-whisper transition-all duration-300 z-50",
        isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
      )}
    >
      <div className="px-10 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h3 className="font-serif text-xl text-[#6D3D0D]" style={{ letterSpacing: '-0.01em' }}>Our Collections</h3>
        </div>

        {/* 3-Column Layout — each column is flex-col so Browse All pins to bottom */}
        <div className="grid grid-cols-3 divide-x divide-[#6D3D0D]/8">

          {/* Column 1: Engagement Rings */}
          <div className="pr-10 flex flex-col">
            <ColumnHeader label="Engagement Rings" />
            <div className="space-y-3 flex-1">
              {ringStyles.map((style) => (
                <ThumbRow
                  key={style.label}
                  href={style.href}
                  image={style.image}
                  label={style.label}
                  onClose={onClose}
                />
              ))}
            </div>
            <BrowseAllLink href="/shop?category=ring" label="Browse All Rings" onClose={onClose} />
          </div>

          {/* Column 2: Fine Jewellery */}
          <div className="px-10 flex flex-col">
            <ColumnHeader label="Fine Jewellery" />
            <div className="space-y-3 flex-1">

              {/* Featured Bracelets card */}
              <Link
                href="/fine-jewellery/bracelets"
                onClick={onClose}
                className="group block px-2 py-1 rounded-sm hover:bg-elysium-gold/5 transition-colors duration-200"
              >
                <div className="p-[6px] mb-2" style={{ backgroundColor: "#E8E2DA", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                  <div className="relative aspect-[16/9] overflow-hidden bg-white">
                    <Image
                      src="/products/Classic%204%20Claw%20Tennis%20Bracelet%20/3ct/classicTB3ct-gold.PNG"
                      alt="Bracelets"
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="400px"
                    />
                  </div>
                </div>
                <span className="text-xs text-[#6D3D0D] group-hover:text-[#D4AF37] transition-colors duration-300">
                  Bracelets
                </span>
              </Link>

              {fineJewelleryItems.map((item) => (
                <ThumbRow
                  key={item.label}
                  href={item.href}
                  image={item.image}
                  label={item.label}
                  comingSoon={item.comingSoon}
                  onClose={onClose}
                />
              ))}
            </div>
            <BrowseAllLink href="/fine-jewellery" label="Browse All Jewellery" onClose={onClose} />
          </div>

          {/* Column 3: Wedding Bands */}
          <div className="pl-10 flex flex-col">
            <ColumnHeader label="Wedding Bands" />
            <div className="space-y-3 flex-1">
              {weddingBandItems.map((item) => (
                <ThumbRow
                  key={item.label}
                  href={item.href}
                  image={item.image}
                  label={item.label}
                  onClose={onClose}
                />
              ))}
            </div>
            <BrowseAllLink href="/shop?category=wedding-bands" label="Browse All Bands" onClose={onClose} />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-5 border-t border-[#6D3D0D]/8">
          <Link
            href="/shop"
            onClick={onClose}
            className="block w-full py-2.5 text-center text-xs font-medium tracking-widest uppercase transition-all duration-300 bg-elysium-brown text-white hover:bg-elysium-gold hover:text-elysium-brown"
          >
            View All Collections
          </Link>
          <div className="mt-3 text-center">
            <Link
              href="/bespoke"
              onClick={onClose}
              className="text-[10px] text-[#6D3D0D]/50 hover:text-[#D4AF37] transition-colors tracking-[0.15em] uppercase"
            >
              Create Bespoke
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Trigger component for the navigation
interface CollectionsTriggerProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export function CollectionsTrigger({
  isOpen,
  onToggle,
  className = ""
}: CollectionsTriggerProps) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      className={clsx(
        "group relative flex items-center gap-1.5 px-4 py-2 text-sm font-medium tracking-wide transition-all duration-300",
        "hover:text-elysium-gold",
        isOpen ? "text-elysium-gold" : "",
        className
      )}
      aria-expanded={isOpen}
      aria-haspopup="true"
    >
      <span>Collections</span>
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
