"use client";

import Link from 'next/link';
import clsx from 'clsx';

interface EducationMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

// Diamond guide links
const diamondTopics = [
  { label: "The 4Cs", href: "/education/diamonds#the-4cs" },
  { label: "Popular Shapes", href: "/education/diamonds#shapes" },
  { label: "Certification", href: "/education/diamonds#certification" },
];

// Clarity grades for the quick-preview scale
const clarityGrades = ["FL/IF", "VVS", "VS", "SI"];

// Metal types with colour indicators
const metalTypes = [
  { label: "Yellow Gold", href: "/education/metals", color: "#D4AF37" },
  { label: "Rose Gold", href: "/education/metals", color: "#B76E79" },
  { label: "White Gold", href: "/education/metals", color: "#C0C0C0" },
  { label: "Platinum", href: "/education/metals", color: "#8C8C8C" },
];

// Column header — matches Collections mega menu style
function ColumnHeader({ label }: { label: string }) {
  return (
    <div className="mb-5">
      <h4 className="text-[10px] text-[#6D3D0D]/40 uppercase tracking-[0.25em] font-light mb-2">
        {label}
      </h4>
      <div className="w-8 h-px bg-[#D4AF37]/40" />
    </div>
  );
}

export default function EducationMegaMenu({
  isOpen,
  onClose,
}: EducationMegaMenuProps) {
  return (
    <div
      className={clsx(
        "absolute top-full left-1/2 -translate-x-1/2 w-[620px] bg-white shadow-2xl border border-[#6D3D0D]/8 transition-all duration-300 z-50",
        isOpen
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-4 pointer-events-none"
      )}
    >
      <div className="px-10 py-8">
        {/* Centered Header */}
        <div className="text-center mb-8">
          <p className="text-[10px] text-[#D4AF37] uppercase tracking-[0.3em] font-light mb-1.5">
            Learn
          </p>
          <h3
            className="font-serif text-xl text-[#6D3D0D]"
            style={{ letterSpacing: "-0.01em" }}
          >
            Education
          </h3>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-2 gap-10">
          {/* Column 1: Diamond Guide */}
          <div>
            <ColumnHeader label="Diamond Guide" />

            {/* Topic links */}
            <div className="space-y-2.5 mb-4">
              {diamondTopics.map((topic) => (
                <Link
                  key={topic.label}
                  href={topic.href}
                  onClick={onClose}
                  className="group flex items-center gap-2"
                >
                  <svg
                    className="w-3.5 h-3.5 text-[#D4AF37]/40 group-hover:text-[#D4AF37] transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                    />
                  </svg>
                  <span className="text-xs text-[#6D3D0D] group-hover:text-[#D4AF37] transition-colors duration-300">
                    {topic.label}
                  </span>
                </Link>
              ))}
            </div>

            {/* Clarity mini-scale */}
            <div className="mb-5">
              <p className="text-[9px] text-[#6D3D0D]/35 uppercase tracking-[0.2em] mb-2">
                Clarity Scale
              </p>
              <div className="flex items-center gap-1.5">
                {clarityGrades.map((grade, i) => (
                  <span
                    key={grade}
                    className={clsx(
                      "text-[10px] px-2 py-0.5 border tracking-wide",
                      i === 0
                        ? "border-[#D4AF37]/40 text-[#D4AF37] bg-[#D4AF37]/5"
                        : "border-[#6D3D0D]/10 text-[#6D3D0D]/50"
                    )}
                  >
                    {grade}
                  </span>
                ))}
              </div>
            </div>

            <Link
              href="/education/diamonds"
              onClick={onClose}
              className="inline-block text-[10px] text-[#D4AF37] hover:text-[#6D3D0D] transition-colors tracking-[0.15em] uppercase"
            >
              Explore Diamonds &rarr;
            </Link>
          </div>

          {/* Column 2: Metal Guide */}
          <div>
            <ColumnHeader label="Metal Guide" />

            {/* Metal types with colour dots */}
            <div className="space-y-3 mb-4">
              {metalTypes.map((metal) => (
                <Link
                  key={metal.label}
                  href={metal.href}
                  onClick={onClose}
                  className="group flex items-center gap-3"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0 ring-1 ring-[#6D3D0D]/10"
                    style={{ backgroundColor: metal.color }}
                  />
                  <span className="text-xs text-[#6D3D0D] group-hover:text-[#D4AF37] transition-colors duration-300">
                    {metal.label}
                  </span>
                </Link>
              ))}
            </div>

            {/* Gold vs Platinum link */}
            <Link
              href="/education/metals#comparison"
              onClick={onClose}
              className="group flex items-center gap-2 mb-5 py-2 px-3 -mx-3 bg-[#FAF7F2] hover:bg-[#D4AF37]/5 transition-colors"
            >
              <svg
                className="w-3.5 h-3.5 text-[#D4AF37]/60 group-hover:text-[#D4AF37] transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                />
              </svg>
              <span className="text-[11px] text-[#6D3D0D]/70 group-hover:text-[#D4AF37] transition-colors duration-300">
                Gold vs Platinum
              </span>
            </Link>

            <Link
              href="/education/metals"
              onClick={onClose}
              className="inline-block text-[10px] text-[#D4AF37] hover:text-[#6D3D0D] transition-colors tracking-[0.15em] uppercase"
            >
              Explore Metals &rarr;
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-5 border-t border-[#6D3D0D]/6 flex items-center justify-center">
          <Link
            href="/education"
            onClick={onClose}
            className="text-[11px] text-[#6D3D0D]/50 hover:text-[#D4AF37] transition-colors tracking-[0.15em] uppercase"
          >
            Visit Education Hub
          </Link>
        </div>
      </div>
    </div>
  );
}

// Trigger component for the navigation
interface EducationTriggerProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export function EducationTrigger({
  isOpen,
  onToggle,
  className = "",
}: EducationTriggerProps) {
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
      <span>Education</span>
      <svg
        className={clsx(
          "w-4 h-4 transition-transform duration-300",
          isOpen && "rotate-180"
        )}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
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
