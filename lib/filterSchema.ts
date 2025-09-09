export type FacetKey = "style"|"shape"|"metal"|"origin"|"carat"|"colour"|"clarity"|"certificate";
export type Option = { id:string; label:string; icon?:string }; // icon is a public path to PNG/SVG
export type Facets = Record<FacetKey, Option[]>;

export const facets: Facets = {
  style: [
    { id:"solitaire", label:"Solitaire", icon:"/icons/styles/solitaire.svg" },
    { id:"halo",      label:"Halo",      icon:"/icons/styles/halo.svg" },
    { id:"three-stone", label:"Three-Stone", icon:"/icons/styles/three-stone.svg" },
    { id:"hidden-halo", label:"Hidden Halo", icon:"/icons/styles/hidden-halo.svg" },
  ],
  shape: [
    { id:"round",    label:"Round",    icon:"/icons/cuts/round.svg" },
    { id:"oval",     label:"Oval",     icon:"/icons/cuts/oval.svg" },
    { id:"marquise", label:"Marquise", icon:"/icons/cuts/marquise.svg" },
    { id:"pear",     label:"Pear",     icon:"/icons/cuts/pear.svg" },
    { id:"princess", label:"Princess", icon:"/icons/cuts/princess.svg" },
    { id:"emerald",  label:"Emerald",  icon:"/icons/cuts/emerald.svg" },
    { id:"cushion",  label:"Cushion",  icon:"/icons/cuts/cushion.svg" },
    { id:"asscher",  label:"Asscher",  icon:"/icons/cuts/asscher.svg" },
    { id:"radiant",  label:"Radiant",  icon:"/icons/cuts/radiant.svg" },
    { id:"heart",    label:"Heart",    icon:"/icons/cuts/heart.svg" },
  ],
  metal: [
    { id:"yellow", label:"18k Yellow", icon:"/icons/metals/yellow.png" },
    { id:"white",  label:"18k White",  icon:"/icons/metals/white.png" },
    { id:"rose",   label:"18k Rose",   icon:"/icons/metals/rose.png" },
    { id:"platinum", label:"Platinum", icon:"/icons/metals/platinum.png" },
  ],
  origin: [
    { id:"natural", label:"Natural" },
    { id:"lab",     label:"Lab Grown" },
  ],
  carat: [
    { id:"1-1.5",   label:"1.0–1.5 ct" },
    { id:"1.5-2",   label:"1.5–2.0 ct" },
    { id:"2-2.5",   label:"2.0–2.5 ct" },
    { id:"2.5-3",   label:"2.5–3.0 ct" },
    { id:"3plus",   label:"3.0 ct +" },
  ],
  colour: [
    { id:"D", label:"D" }, { id:"E", label:"E" }, { id:"F", label:"F" }
  ],
  clarity: [
    { id:"IF", label:"IF" }, { id:"VVS1", label:"VVS1" },
    { id:"VVS2", label:"VVS2" }, { id:"VS1", label:"VS1" }
  ],
  certificate: [
    { id:"GIA", label:"GIA" }, { id:"IGI", label:"IGI" }
  ]
};

// query <-> state helpers
export type FilterState = Partial<Record<FacetKey, string[]>>;

export function parseQuery(searchParams: URLSearchParams): FilterState {
  const state: FilterState = {};
  (Object.keys(facets) as FacetKey[]).forEach(k=>{
    const v = searchParams.get(k);
    if (v) state[k] = v.split(",").filter(Boolean);
  });
  return state;
}
export function toQuery(state: FilterState): string {
  const sp = new URLSearchParams();
  (Object.entries(state) as [FacetKey,string[]|undefined][])
    .forEach(([k, arr])=>{
      if (arr && arr.length) sp.set(k, arr.join(","));
    });
  const s = sp.toString();
  return s ? `?${s}` : "";
}

export function toggle(state: FilterState, key:FacetKey, id:string): FilterState {
  const next = { ...state };
  const list = new Set(next[key] || []);
  if (list.has(id)) list.delete(id); else list.add(id);
  next[key] = Array.from(list);
  return next;
}








