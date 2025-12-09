"use client";

import { useState } from "react";

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
}

export function AccordionItem({ title, children }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left font-serif uppercase tracking-wide text-sm text-charcoal hover:text-charcoal/80 transition-colors"
      >
        <span>{title}</span>
        <span className="text-charcoal/60 text-lg transition-transform duration-200">
          {isOpen ? "−" : "+"}
        </span>
      </button>
      {isOpen && (
        <div className="mt-3 font-sans text-sm text-charcoal/80 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}














