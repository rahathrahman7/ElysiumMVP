"use client";
export default function TrustStrip(){
  const items = [
    { label:"GIA / IGI Certified" },
    { label:"Free Resizing" },
    { label:"Insured Shipping" },
    { label:"Secure Checkout" },
  ];
  return (
    <div className="mt-6 rounded-2xl border border-neutral-200 bg-white/70 backdrop-blur-sm px-4 py-3">
      <ul className="grid grid-cols-2 gap-2 text-xs text-neutral-700 sm:grid-cols-4">
        {items.map(i => (
          <li key={i.label} className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--gold)]" />
            <span className="font-medium">{i.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}









