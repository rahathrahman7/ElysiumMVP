export type SavedItem = {
  slug: string;
  name?: string;
  price?: number | string;
  imageSrc?: string;
};

const WKEY = "ely:wishlist";
const RKEY = "ely:recent:v2";
const RKEY_LEGACY = "ely:recent";

export function readWishlist(): SavedItem[] {
  try { return JSON.parse(localStorage.getItem(WKEY) || "[]"); } catch { return []; }
}
export function writeWishlist(items: SavedItem[]) {
  localStorage.setItem(WKEY, JSON.stringify(items));
}

function migrateRecent(): SavedItem[] {
  try {
    const raw = localStorage.getItem(RKEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return (Array.isArray(parsed) ? parsed : [])
        .map((i: SavedItem | string) =>
          typeof i === "string" ? { slug: i } : { slug: i.slug }
        )
        .filter((i: SavedItem) => Boolean(i.slug));
    }
    const legacy = JSON.parse(localStorage.getItem(RKEY_LEGACY) || "[]");
    const slugs = (Array.isArray(legacy) ? legacy : [])
      .map((i: SavedItem) => ({ slug: i.slug }))
      .filter((i: SavedItem) => Boolean(i.slug));
    if (slugs.length) {
      localStorage.setItem(RKEY, JSON.stringify(slugs));
      localStorage.removeItem(RKEY_LEGACY);
    }
    return slugs;
  } catch {
    return [];
  }
}

export function readRecent(): SavedItem[] {
  return migrateRecent();
}
export function writeRecent(items: SavedItem[]) {
  const slim = items.map((i) => ({ slug: i.slug })).filter((i) => i.slug);
  localStorage.setItem(RKEY, JSON.stringify(slim));
}

export function upsertRecent(item: SavedItem, cap = 12) {
  if (!item?.slug) return;
  const list = readRecent().filter((i) => i.slug !== item.slug);
  list.unshift({ slug: item.slug });
  writeRecent(list.slice(0, cap));
}

export function isSaved(slug: string) {
  return readWishlist().some(i => i.slug === slug);
}
export function toggleSaved(item: SavedItem) {
  const list = readWishlist();
  const idx = list.findIndex(i => i.slug === item.slug);
  if (idx >= 0) { list.splice(idx, 1); }
  else { list.unshift(item); }
  writeWishlist(list);
  return list;
}
