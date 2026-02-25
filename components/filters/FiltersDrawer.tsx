"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { facets, parseQuery, toQuery, toggle, FacetKey } from "@/lib/filterSchema";

const REST: FacetKey[] = ["origin","carat","colour","clarity","certificate"];

type Props = {
  onClose?: () => void; // optional: close callback
  isOpen?: boolean; // optional: controlled open state
};

export default function FiltersDrawer({ onClose, isOpen }: Props){
  const [internalOpen, setInternalOpen] = useState(false);
  const router = useRouter();
  const sp = useSearchParams();
  const state = parseQuery(sp);

  // Use controlled state if provided, otherwise use internal state
  const open = isOpen !== undefined ? isOpen : internalOpen;
  const setOpen = isOpen !== undefined ? onClose || (() => {}) : setInternalOpen;

  const apply = ()=>{
    router.push(`/collection/engagement-rings${toQuery(state)}`);
    setOpen(false);
  };

  const getSectionTitle = (key: FacetKey) => {
    switch(key) {
      case 'origin': return 'Choose Your Origin';
      case 'carat': return 'Choose Your Carat';
      case 'colour': return 'Choose Your Colour';
      case 'clarity': return 'Choose Your Clarity';
      case 'certificate': return 'Choose Your Certificate';
      default: return key.charAt(0).toUpperCase() + key.slice(1);
    }
  };

  return (
    <>
      <div className="flex gap-3">
        <button 
          className="border border-[#D4AF37] rounded-full px-6 py-3 text-sm font-serif text-charcoal hover:bg-[#FAF9F6] transition-all duration-200" 
          onClick={()=>setOpen(true)}
        >
          Filters
        </button>
        <button 
          className="text-sm text-neutral-600 underline font-serif hover:text-charcoal transition-colors" 
          onClick={()=>router.push("/collection/engagement-rings")}
        >
          Clear
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm">
          <div className="absolute right-0 top-0 h-full w-[90%] sm:w-[480px] bg-white p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-serif text-2xl text-charcoal">Additional Filters</h3>
              <button 
                onClick={()=>setOpen(false)}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#D4AF37] transition-colors"
              >
                ✕
              </button>
            </div>
            
            {REST.map(key=>(
              <div key={key} className="mb-8">
                <h4 className="font-serif text-lg text-charcoal mb-4">{getSectionTitle(key)}</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {facets[key].map(opt=>{
                    const active = (state[key]||[]).includes(opt.id);
                    return (
                      <button 
                        key={opt.id}
                        onClick={()=>{ Object.assign(state, toggle(state,key,opt.id)); }}
                        aria-label={`Select ${opt.label} ${key}`}
                        className={`group flex flex-col items-center justify-center w-full h-20 rounded-full border transition-all duration-200 ease-in-out
                          ${active 
                            ? "border-[#D4AF37] bg-[#FAF9F6] shadow-md scale-105 ring-2 ring-[#D4AF37]/20" 
                            : "border-gray-200 bg-white hover:border-[#D4AF37] hover:shadow-sm hover:scale-105"
                          }
                        `}
                      >
                        <span className="text-sm font-serif text-charcoal text-center leading-tight">
                          {opt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            
            <div className="mt-8 flex gap-3 pt-6 border-t border-gray-100">
              <button 
                className="flex-1 border border-gray-200 rounded-full px-6 py-3 text-sm font-serif text-charcoal hover:border-[#D4AF37] transition-colors" 
                onClick={()=>setOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="flex-1 rounded-full px-6 py-3 bg-[#D4AF37] text-white font-serif hover:bg-[#B8941F] transition-colors" 
                onClick={apply}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
