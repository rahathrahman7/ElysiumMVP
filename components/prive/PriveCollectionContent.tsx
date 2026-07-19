"use client";

import { useState } from "react";
import { PriveNotifyModal } from "@/components/prive/PriveNotifyModal";

export function PriveCollectionContent() {
  const [showModal, setShowModal] = useState(false);

  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      <section className="py-24 md:py-32">
        <div className="max-w-[800px] mx-auto px-6 md:px-12 text-center">
          <div className="w-24 h-24 mx-auto mb-8 border border-[#D4AF37]/30 flex items-center justify-center">
            <svg className="w-12 h-12 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <span className="text-[#D4AF37] text-xs uppercase tracking-[0.3em] font-medium">
            Coming Soon
          </span>

          <h1
            className="font-serif text-[#6D3D0D] text-4xl md:text-5xl mt-4 mb-6"
            style={{ letterSpacing: "-0.02em" }}
          >
            Privé <span className="text-[#D4AF37]">Collection</span>
          </h1>

          <p className="text-[#6D3D0D]/60 text-lg leading-relaxed mb-10 max-w-lg mx-auto">
            An exclusive curation of exceptional pieces, reserved for those who seek something truly rare.
          </p>

          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#6D3D0D] text-white font-light tracking-wider uppercase text-sm transition-all duration-300 hover:bg-[#D4AF37]"
          >
            Be the first to know
          </button>

          <div className="flex items-center justify-center gap-4 mt-12">
            <div className="h-[1px] w-16 bg-[#D4AF37]/30" />
            <svg className="w-4 h-4 text-[#D4AF37]/50" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 3.22l-.61-.6a5.5 5.5 0 00-7.78 7.77L10 18.78l8.39-8.4a5.5 5.5 0 00-7.78-7.77l-.61.61z" />
            </svg>
            <div className="h-[1px] w-16 bg-[#D4AF37]/30" />
          </div>
        </div>
      </section>

      {showModal && <PriveNotifyModal onClose={() => setShowModal(false)} />}
    </main>
  );
}
