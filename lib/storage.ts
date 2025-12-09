export type SavedItem = {
  slug: string;
  name: string;
  price?: number | string;
  imageSrc?: string;
};

const WKEY = "ely:wishlist";
const RKEY = "ely:recent";

export function readWishlist(): SavedItem[] {
  try { return JSON.parse(localStorage.getItem(WKEY) || "[]"); } catch { return []; }
}
export function writeWishlist(items: SavedItem[]) {
  localStorage.setItem(WKEY, JSON.stringify(items));
}

export function readRecent(): SavedItem[] {
  try { return JSON.parse(localStorage.getItem(RKEY) || "[]"); } catch { return []; }
}
export function writeRecent(items: SavedItem[]) {
  localStorage.setItem(RKEY, JSON.stringify(items));
}

export function upsertRecent(item: SavedItem, cap = 12) {
  const list = readRecent().filter(i => i.slug !== item.slug);
  list.unshift(item);
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









