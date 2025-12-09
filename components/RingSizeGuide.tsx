"use client";
import { useState } from "react";

export function RingSizeGuide() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button className="underline underline-offset-4" onClick={()=>setOpen(true)}>Ring size guide</button>
      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={()=>setOpen(false)} />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-ivory border rounded p-6 max-w-lg w-full">
            <div className="flex items-center justify-between mb-3">
              <div className="font-heading text-xl">Ring Size Guide</div>
              <button onClick={()=>setOpen(false)} aria-label="Close">×</button>
            </div>
            <p className="text-sm text-charcoal/80">Measure an existing ring or use a printable guide. For assistance, contact our atelier.</p>
          </div>
        </div>
      )}
    </div>
  );
}
















