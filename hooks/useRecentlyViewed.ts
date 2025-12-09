"use client";
import { useEffect, useState } from "react";
import { readRecent, upsertRecent, type SavedItem } from "@/lib/storage";

export default function useRecentlyViewed(current?: SavedItem) {
  const [items, setItems] = useState<SavedItem[]>([]);
  useEffect(() => {
    if (current?.slug) upsertRecent(current);
    setItems(readRecent());
  }, [current?.slug]);
  return items;
}









