"use client";
import { useSearchParams } from "next/navigation";
import { parseQuery, FacetKey } from "@/lib/filterSchema";

export default function useSelectedCount(keys: FacetKey[]) {
  const sp = useSearchParams();
  const state = parseQuery(sp);
  return keys.reduce((sum, k) => sum + (state[k]?.length || 0), 0);
}














