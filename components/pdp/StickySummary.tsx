"use client";
import React, { useEffect, useState } from "react";

type Props = {
  name: string;
  priceFormatted: string;
  selections: Partial<{
    origin: string;
    carat: string;
    colour: string;
    clarity: string;
    certificate: string;
    metal: string;
    ringSize: string;
    engraving: string | null;
  }>;
  canAdd: boolean;
  onAdd: () => void;
  appointmentHref?: string;
  isEntryLevel: boolean;
  isNaturalDiamond: boolean;
};

export default function StickySummary({
  name,
  priceFormatted,
  selections,
  canAdd,
  onAdd,
  appointmentHref = "/contact",
  isEntryLevel,
  isNaturalDiamond,
}: Props) {
  const showBuyNow = isEntryLevel && !isNaturalDiamond;
  const showInquire = !isEntryLevel || isNaturalDiamond;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      // Show after scrolling just 200px
      setVisible(y > 200);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="
        fixed inset-x-0 bottom-0 z-40
        bg-white/85 backdrop-blur-md border-t border-neutral-200
        shadow-[0_-8px_24px_rgba(0,0,0,0.08)]
        transition-all duration-200
      "
      role="region"
      aria-label="Build summary"
    >
      <div className="mx-auto max-w-5xl px-4 py-3 md:py-4">
        <div className="flex items-start gap-3 md:items-center md:gap-6">
          {/* Left: name + chips */}
          <div className="min-w-0 flex-1">
            <div className="truncate font-serif text-base md:text-lg text-neutral-900">{name}</div>
            <div className="mt-1 flex flex-wrap gap-1 text-[11px] md:text-xs text-neutral-700">
              {Object.entries(selections)
                .filter(([, v]) => Boolean(v))
                .map(([k, v]) => (
                  <span
                    key={k}
                    className="rounded-full bg-[var(--ivory)] border border-neutral-200 px-2 py-0.5"
                  >
                    {k.replace(/([A-Z])/g, " $1")}: <strong className="ml-1">{String(v)}</strong>
                  </span>
                ))}
            </div>
          </div>

          {/* Price */}
          <div className="shrink-0 text-right">
            {isNaturalDiamond ? (
              <div className="text-sm text-neutral-900">Price upon request</div>
            ) : (
              <>
                <div className="text-xs text-neutral-600">From</div>
                <div className="text-base font-semibold text-neutral-900">{priceFormatted}</div>
              </>
            )}
          </div>

          {/* CTAs */}
          <div className="flex shrink-0 items-center gap-2">
            {showBuyNow && (
              <button
                type="button"
                onClick={onAdd}
                disabled={!canAdd}
                className={`rounded-full px-4 py-2 text-sm font-medium text-white transition
                  ${canAdd ? "bg-[#753600] hover:bg-[#753600]/90" : "bg-neutral-300 cursor-not-allowed"}
                `}
              >
                Add to Bag
              </button>
            )}
            {showInquire && (
              <a
                href={appointmentHref}
                className="rounded-full px-4 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 transition"
              >
                Inquire
              </a>
            )}
            <a
              href={appointmentHref}
              className="rounded-full border border-[var(--gold)] px-4 py-2 text-sm font-medium text-neutral-900 bg-white hover:bg-[color-mix(in_srgb,var(--gold)_10%,#fff)]"
            >
              Book Appointment
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
