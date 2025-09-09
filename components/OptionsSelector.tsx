"use client";
import { useState } from "react";
import type { Product } from "@/types/product";

export function OptionsSelector({ product }: { product: Product }) {
  const [metal, setMetal] = useState(product.options.metals?.[0]?.name ?? "");
  const [stone, setStone] = useState(product.options.stones?.[0]?.name ?? "");
  const [size, setSize] = useState(product.ringSizes?.[0] ?? "");
  return (
    <div className="space-y-3">
      {product.options.metals?.length ? (
        <label className="block">
          <span className="text-sm text-charcoal/70">Metal</span>
          <select className="mt-1 w-full border rounded px-3 py-2" value={metal} onChange={(e)=>setMetal(e.target.value)}>
            {product.options.metals.map((m)=> <option key={m.name} value={m.name}>{m.name}</option>)}
          </select>
        </label>
      ) : null}
      {product.options.stones?.length ? (
        <label className="block">
          <span className="text-sm text-charcoal/70">Stone</span>
          <select className="mt-1 w-full border rounded px-3 py-2" value={stone} onChange={(e)=>setStone(e.target.value)}>
            {product.options.stones.map((s)=> <option key={s.name} value={s.name}>{s.name}</option>)}
          </select>
        </label>
      ) : null}
      {product.ringSizes?.length ? (
        <label className="block">
          <span className="text-sm text-charcoal/70">Ring Size</span>
          <select className="mt-1 w-full border rounded px-3 py-2" value={size} onChange={(e)=>setSize(e.target.value)}>
            {product.ringSizes.map((r)=> <option key={r} value={r}>{r}</option>)}
          </select>
        </label>
      ) : null}
    </div>
  );
}










