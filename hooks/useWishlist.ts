"use client";
import { useEffect, useState } from "react";
import { readWishlist, toggleSaved, type SavedItem } from "@/lib/storage";

export default function useWishlist() {
  const [items, setItems] = useState<SavedItem[]>([]);
  useEffect(() => { setItems(readWishlist()); }, []);
  const toggle = (item: SavedItem) => setItems(toggleSaved(item));
  const remove = (slug: string) => setItems(prev => prev.filter(i => i.slug !== slug) && (toggleSaved({slug, name:""} as any), readWishlist()));
  const has = (slug: string) => items.some(i => i.slug === slug);
  return { items, toggle, has, remove };
}



