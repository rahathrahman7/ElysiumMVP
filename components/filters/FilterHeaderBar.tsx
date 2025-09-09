"use client";
import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { facets, parseQuery, toQuery, toggle, FacetKey } from "@/lib/filterSchema";

type Props = {
  total: number; // filtered list length
  onOpenFilters?: () => void; // optional: open drawer
};

export default function FilterHeaderBar({ total, onOpenFilters }: Props){
  const router = useRouter();
  const sp = useSearchParams();
  const state = parseQuery(sp);

  const activePills = useMemo(()=>{
    const pills:{ key:FacetKey; id:string; label:string }[] = [];
    (Object.keys(facets) as FacetKey[]).forEach(key=>{
      const active = state[key] || [];
      active.forEach(id=>{
        const opt = facets[key].find(o=>o.id===id);
        if (opt) pills.push({ key, id, label: opt.label });
      });
    });
    return pills;
  }, [state]);

  const count = activePills.length;

  function remove(key:FacetKey, id:string){
    const next = toggle(state, key, id);
    router.push(`${location.pathname}${toQuery(next)}`, { scroll:false });
  }

  function clearAll(){
    router.push(location.pathname, { scroll:false });
  }

  function onSortChange(e:React.ChangeEvent<HTMLSelectElement>){
    const next = new URLSearchParams(sp.toString());
    const val = e.target.value;
    if (val) next.set("sort", val); else next.delete("sort");
    router.push(`${location.pathname}${next.toString() ? `?${next.toString()}` : ""}`, { scroll:false });
  }

  return (
    <div className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-neutral-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="h-14 flex items-center gap-3 justify-between">
          {/* Left: count + pills */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <span className="text-sm text-neutral-700">{total} item{total===1?"":"s"}</span>
              <div className="hidden sm:flex items-center gap-2 flex-wrap">
                {activePills.map(p=>(
                  <button
                    key={`${p.key}:${p.id}`}
                    aria-label={`Remove ${p.label}`}
                    onClick={()=>remove(p.key, p.id)}
                    className="group inline-flex items-center gap-2 px-3 h-8 rounded-full border text-xs
                               border-[#D4AF37] bg-[#FAF9F6] hover:bg-white transition"
                  >
                    <span className="font-serif">{p.label}</span>
                    <span className="text-neutral-500 group-hover:text-neutral-800">×</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2 shrink-0">
            <select
              defaultValue={sp.get("sort") || ""}
              onChange={onSortChange}
              className="h-9 rounded-lg border border-neutral-300 bg-white px-2 text-sm"
              aria-label="Sort products"
            >
              <option value="">Sort: Best sellers</option>
              <option value="new">New in</option>
              <option value="price-asc">Price ↑</option>
              <option value="price-desc">Price ↓</option>
            </select>

            <button
              onClick={()=> onOpenFilters ? onOpenFilters() : window.dispatchEvent(new CustomEvent("open-filters"))}
              className="relative h-9 rounded-full border px-3 text-sm border-[#D4AF37] bg-white hover:bg-[#FAF9F6] transition"
            >
              Filters
              {count>0 && (
                <span className="ml-2 inline-flex items-center justify-center text-[11px] w-5 h-5 rounded-full bg-[#D4AF37] text-white">
                  {count}
                </span>
              )}
            </button>

            <button onClick={clearAll} className="text-sm text-neutral-600 underline">
              Clear
            </button>
          </div>
        </div>

        {/* Pills visible on mobile below the bar */}
        <div className="sm:hidden pb-3 -mt-2 flex flex-wrap gap-2">
          {activePills.map(p=>(
            <button
              key={`${p.key}:${p.id}`}
              onClick={()=>remove(p.key, p.id)}
              className="inline-flex items-center gap-2 px-3 h-8 rounded-full border text-xs
                         border-[#D4AF37] bg-[#FAF9F6]"
            >
              <span className="font-serif">{p.label}</span>
              <span className="">×</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
