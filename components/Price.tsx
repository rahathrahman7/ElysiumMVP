"use client";
import { useMemo, useState } from "react";
import type { ProductOptions } from "@/types/product";

export function Price({ basePriceGBP, options }: { basePriceGBP: number; options: ProductOptions }) {
  const [metal, setMetal] = useState(options.metals?.[0]?.name ?? "");
  const [stone, setStone] = useState(options.stones?.[0]?.name ?? "");
  const price = useMemo(() => {
    const metalDelta = options.metals?.find((m)=>m.name===metal)?.priceDelta ?? 0;
    const stoneDelta = options.stones?.find((s)=>s.name===stone)?.priceDelta ?? 0;
    return basePriceGBP + metalDelta + stoneDelta;
  }, [basePriceGBP, options, metal, stone]);
  return (
    <div className="text-xl">£{(price / 100).toFixed(2)}</div>
  );
}










