import catalog from "../../public/data/tmc-review-catalog.json";

export type TmcCatalogEntry = {
  handle: string;
  tmcName?: string;
  suggested?: string;
  category?: string;
  tmcPriceAud?: string;
};

const byHandle: Map<string, TmcCatalogEntry> = (() => {
  const map = new Map<string, TmcCatalogEntry>();
  const rows = catalog as TmcCatalogEntry[];
  for (const row of rows) {
    if (row?.handle) map.set(row.handle, row);
  }
  return map;
})();

export function getTmcCatalogEntry(handle: string): TmcCatalogEntry | null {
  return byHandle.get(handle) ?? null;
}
