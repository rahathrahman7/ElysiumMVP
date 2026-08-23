"use client";
import { useEffect, useState } from "react";
import { readRecent, upsertRecent, type SavedItem } from "@/lib/storage";

type LiveProduct = {
  slug: string;
  title?: string;
  images?: { url?: string }[] | string[];
  basePriceGBP?: number;
};

function primaryImage(p: LiveProduct): string | undefined {
  const imgs = p.images || [];
  if (!imgs.length) return undefined;
  const first = imgs[0];
  return typeof first === "string" ? first : first?.url;
}

export default function useRecentlyViewed(current?: SavedItem) {
  const [items, setItems] = useState<SavedItem[]>([]);

  useEffect(() => {
    if (current?.slug) upsertRecent({ slug: current.slug });

    const slugs = readRecent()
      .map((i) => i.slug)
      .filter(Boolean);

    if (!slugs.length) {
      setItems([]);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/products?limit=500");
        const data = await res.json();
        const products: LiveProduct[] = data?.products || [];
        const bySlug = new Map(products.map((p) => [p.slug, p]));
        const hydrated: SavedItem[] = [];
        for (const slug of slugs) {
          if (current?.slug && slug === current.slug) continue;
          const live = bySlug.get(slug);
          if (!live) continue;
          const price = live.basePriceGBP;
          hydrated.push({
            slug,
            name: live.title || slug,
            imageSrc: primaryImage(live),
            price: price && price > 0 ? price : undefined,
          });
        }
        if (!cancelled) setItems(hydrated);
      } catch {
        if (!cancelled) setItems([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [current?.slug]);

  return items;
}
