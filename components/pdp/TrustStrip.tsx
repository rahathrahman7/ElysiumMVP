"use client";
export default function TrustStrip(){
  const items = [
    { label:"GIA / IGI Certified" },
    { label:"Free Resizing" },
    { label:"Insured Shipping" },
    { label:"Secure Checkout" },
  ];
  return (
    <div className="mt-8 py-5 border-t border-[#6D3D0D]/10">
      <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
        {items.map(i => (
          <li key={i.label} className="flex items-center gap-2">
            <span className="text-[#D4AF37]/70">◆</span>
            <span className="font-serif text-[10px] uppercase tracking-[0.1em] text-[#6D3D0D]/50">{i.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}









