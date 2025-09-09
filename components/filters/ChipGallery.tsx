"use client";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { facets, parseQuery, toQuery, toggle, FacetKey } from "@/lib/filterSchema";

type Props = {
  primary?: FacetKey[]; // default: ["style","shape","metal"]
};

export default function ChipGallery({ primary = ["style","shape","metal"] }: Props){
  const router = useRouter();
  const sp = useSearchParams();
  const state = parseQuery(sp);

  function onToggle(key: FacetKey, id: string){
    const next = toggle(state, key, id);
    router.push(`/collection/engagement-rings${toQuery(next)}`, { scroll: false });
  }

  const getSectionTitle = (key: FacetKey) => {
    switch(key) {
      case 'style': return 'Choose Your Style';
      case 'shape': return 'Choose Your Shape';
      case 'metal': return 'Choose Your Metal';
      default: return key.charAt(0).toUpperCase() + key.slice(1);
    }
  };

  return (
    <div className="space-y-12">
      {primary.map(key => (
        <div key={key} className="space-y-6">
          <h3 className="font-serif text-2xl text-charcoal text-center">{getSectionTitle(key)}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 justify-items-center">
            {facets[key].map(opt => {
              const active = (state[key]||[]).includes(opt.id);
              return (
                <button
                  key={opt.id}
                  onClick={()=>onToggle(key,opt.id)}
                  aria-label={`Select ${opt.label} ${key}`}
                  className={`group flex flex-col items-center justify-center w-24 h-28 rounded-full border transition-all duration-200 ease-in-out
                    ${active
                      ? "border-[#D4AF37] bg-[#FAF9F6] shadow-md scale-105 ring-2 ring-[#D4AF37]/20"
                      : "border-gray-200 bg-white hover:border-[#D4AF37] hover:shadow-sm hover:scale-105"
                    }
                  `}
                >
                  {opt.icon ? (
                    opt.icon.includes('/metals/') ? (
                      <div 
                        className="w-10 h-10 rounded-full border-2 border-gray-300 mb-3 transition-all duration-200 group-hover:border-[#D4AF37]"
                        style={{
                          backgroundColor: opt.id === 'yellow' ? '#FFD700' : 
                                        opt.id === 'white' ? '#FAF9F6' : 
                                        opt.id === 'rose' ? '#B76E79' : 
                                        opt.id === 'platinum' ? '#E5E4E2' : '#ccc'
                        }}
                      />
                    ) : (
                      <div className="mb-3 transition-transform duration-200 group-hover:scale-110">
                        <Image 
                          src={opt.icon} 
                          alt={opt.label} 
                          width={40} 
                          height={40} 
                          className="rounded"
                        />
                      </div>
                    )
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-gray-200 mb-3" />
                  )}
                  <span className="text-xs font-serif text-charcoal text-center leading-tight">
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
