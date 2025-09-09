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
};

export default function StickySummary({
  name,
  priceFormatted,
  selections,
  canAdd,
  onAdd,
  appointmentHref = "/contact",
}: Props) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // hydrate dismissed state once
    const hid = sessionStorage.getItem("ely:hideSticky");
    if (hid === "1") setDismissed(true);

    const onScroll = () => {
      if (sessionStorage.getItem("ely:hideSticky") === "1") {
        setVisible(false);
        return;
      }
      const y = window.scrollY || 0;
      setVisible(y > 320);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("ely:hideSticky", "1");
    setVisible(false);
  };

  if (!visible || dismissed) return null;

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
            <div className="text-xs text-neutral-600">From</div>
            <div className="text-base font-semibold text-neutral-900">{priceFormatted}</div>
          </div>

          {/* CTAs */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={onAdd}
              disabled={!canAdd}
              className={`rounded-full px-4 py-2 text-sm font-medium text-white transition
                ${canAdd ? "bg-black hover:bg-neutral-900" : "bg-neutral-300 cursor-not-allowed"}
              `}
            >
              Add to Bag
            </button>
            <a
              href={appointmentHref}
              className="rounded-full border border-[var(--gold)] px-4 py-2 text-sm font-medium text-neutral-900 bg-white hover:bg-[color-mix(in_srgb,var(--gold)_10%,#fff)]"
            >
              Book Appointment
            </a>
            <button
              type="button"
              aria-label="Hide summary"
              onClick={dismiss}
              className="ml-1 hidden h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 hover:bg-white md:flex"
              title="Hide"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
