import type { FilterState } from "./filterSchema";
import { Product } from "@/lib/productTypes";

export function productMatches(p: Product, fs: FilterState): boolean {
  // Implement tolerant matching against your product fields:
  // p.shape, p.style, p.metalOptions, p.originOptions, p.caratRange, p.colourOptions, p.clarityOptions, p.certificates
  const by = <T extends string>(vals: T[]|undefined, want?: string[]) =>
    !want?.length || (vals||[]).some(v => want.includes(v));

  const okShape   = by([p.shape], fs.shape);
  const okStyle   = by(p.styles, fs.style);
  const okMetal   = by(p.metals?.map(m=>m.name.toLowerCase().includes('yellow') ? 'yellow' : m.name.toLowerCase().includes('white') ? 'white' : m.name.toLowerCase().includes('rose') ? 'rose' : m.name.toLowerCase().includes('platinum') ? 'platinum' : ''), fs.metal);
  const okOrigin  = by(p.origins?.map(o=>o.label.toLowerCase().includes('natural') ? 'natural' : o.label.toLowerCase().includes('lab') ? 'lab' : ''), fs.origin);
  const okColour  = by(p.colours?.map(c=>c.label), fs.colour);
  const okClarity = by(p.clarities?.map(c=>c.label), fs.clarity);
  const okCert    = by(p.certificates?.map(c=>c.label), fs.certificate);

  const caratOk = (() => {
    if (!fs.carat?.length) return true;
    if (!p.caratBuckets || !p.caratBuckets.length) return true;
    return p.caratBuckets.some(b => fs.carat!.includes(b));
  })();

  return okShape && okStyle && okMetal && okOrigin && okColour && okClarity && okCert && caratOk;
}

export function applyFilters(products: Product[], fs: FilterState): Product[] {
  return products.filter(p => productMatches(p, fs));
}
