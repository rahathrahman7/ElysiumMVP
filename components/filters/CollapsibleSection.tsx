"use client";
import { useState, useId } from "react";

export default function CollapsibleSection({
  title,
  selectedCount = 0,
  defaultOpen = false,
  children,
}: {
  title: string;
  selectedCount?: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  
  return (
    <section className="bg-white border border-neutral-100 rounded-2xl shadow-sm">
      <button
        aria-controls={id}
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        className="w-full px-8 py-6 flex items-center justify-between rounded-2xl hover:bg-neutral-50/50 transition-all duration-300 group"
      >
        <div className="flex items-center gap-4">
          <h3 className="font-serif text-2xl text-neutral-900 font-light tracking-wide">{title}</h3>
          {selectedCount > 0 && (
            <span className="inline-flex items-center justify-center h-6 min-w-[1.5rem] px-2.5 rounded-full text-xs font-medium text-white bg-gradient-to-r from-[#D4AF37] to-[#B8941F] shadow-sm">
              {selectedCount}
            </span>
          )}
        </div>
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-100 group-hover:bg-neutral-200 transition-colors duration-300">
          <span
            className={`transition-transform duration-500 text-neutral-500 text-lg ${open ? "rotate-180" : ""}`}
            aria-hidden
          >
            ▾
          </span>
        </div>
      </button>

      <div
        id={id}
        className={`overflow-hidden transition-all duration-700 ease-in-out ${
          open ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-8 pb-8 pt-2">
          {children}
        </div>
      </div>
    </section>
  );
}
