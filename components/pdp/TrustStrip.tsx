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
      <ul className="
        grid grid-cols-2 gap-x-6 gap-y-4 justify-items-center
        md:flex md:flex-wrap md:items-center md:justify-center
      ">
        {items.map(i => (
          <li
            key={i.label}
            className="flex flex-col items-center justify-center gap-1 text-center"
          >
            <span className="text-[#D4AF37]/70 text-xs leading-none">◆</span>
            <span className="font-serif text-[10px] uppercase tracking-[0.1em] text-[#6D3D0D]/50 leading-snug">
              {i.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}









