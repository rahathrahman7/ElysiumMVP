"use client";
import { useState, PropsWithChildren } from "react";

export default function AccordionSection({
  title,
  defaultOpen = true,
  children,
  className = "",
}: PropsWithChildren<{ title: string; defaultOpen?: boolean; className?: string }>) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className={`rounded-2xl border border-neutral-200 bg-white/80 backdrop-blur-sm ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3"
        aria-expanded={open}
      >
        <h3 className="font-serif text-lg">{title}</h3>
        <span
          className={`transition-transform text-neutral-500 ${open ? "rotate-0" : "-rotate-90"}`}
          aria-hidden
        >
          ▾
        </span>
      </button>
      {open && <div className="px-4 pb-4 pt-1">{children}</div>}
    </section>
  );
}









