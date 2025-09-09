"use client";
import { useSearchParams, useRouter } from "next/navigation";
import useSWR from "swr";
import ProductCard from "@/components/ui/ProductCard";
// revert to server-safe static grid (no client wrapper)

const fetcher = (url: string) => fetch(url).then(r=>r.json());

export function ShopGrid() {
  const params = useSearchParams();
  const router = useRouter();
  const query = params.toString();
  const { data } = useSWR(`/api/products?${query}`, fetcher);

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value); else next.delete(key);
    // Reset page when changing filters/sort
    if (key !== "page") next.delete("page");
    router.push(`/shop?${next.toString()}`);
  }

  const page = Number(params.get("page") || 1);
  const limit = Number(params.get("limit") || 12);
  const total = Number(data?.total || 0);
  const totalPages = total ? Math.max(1, Math.ceil(total / limit)) : 1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
      <aside className="space-y-3">
        <select className="w-full border rounded px-3 py-2" value={params.get("category") ?? ""} onChange={(e)=>updateParam("category", e.target.value)}>
          <option value="">All Categories</option>
          <option value="ring">Rings</option>
          <option value="necklace">Necklaces</option>
          <option value="earring">Earrings</option>
        </select>
        <select className="w-full border rounded px-3 py-2" value={params.get("metal") ?? ""} onChange={(e)=>updateParam("metal", e.target.value)}>
          <option value="">Any Metal</option>
          <option value="gold">Gold</option>
          <option value="platinum">Platinum</option>
        </select>
        <select className="w-full border rounded px-3 py-2" value={params.get("stone") ?? ""} onChange={(e)=>updateParam("stone", e.target.value)}>
          <option value="">Any Stone</option>
          <option value="diamond">Diamond</option>
          <option value="sapphire">Sapphire</option>
        </select>
        <select className="w-full border rounded px-3 py-2" value={params.get("price") ?? ""} onChange={(e)=>updateParam("price", e.target.value)}>
          <option value="">Any Price</option>
          <option value="0-200000">Under £2,000</option>
          <option value="200000-500000">£2,000 - £5,000</option>
          <option value="500000-9999999">Over £5,000</option>
        </select>
      </aside>
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-neutral-600">
            {total ? `${Math.min(total, (page-1)*limit + 1)}–${Math.min(total, page*limit)} of ${total}` : ``}
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm text-neutral-600">Sort</label>
            <select
              id="sort"
              className="border rounded px-3 py-2 text-sm"
              value={params.get("sort") ?? "newest"}
              onChange={(e)=>updateParam("sort", e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="mx-auto max-w-[1320px] px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-7 xl:gap-8">
            {(data?.products ?? []).map((p:any)=> (
              <ProductCard key={p._id} product={p} />
            ))}
            {!data?.products?.length && (
              <div className="col-span-full text-charcoal/70">No products yet. Connect Sanity to populate.</div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2">
          <button
            className="px-3 py-2 border rounded disabled:opacity-50"
            onClick={()=>updateParam("page", String(Math.max(1, page-1)))}
            disabled={page <= 1}
            aria-label="Previous page"
          >
            ← Prev
          </button>
          <span className="text-sm text-neutral-600">Page {page} of {totalPages}</span>
          <button
            className="px-3 py-2 border rounded disabled:opacity-50"
            onClick={()=>updateParam("page", String(Math.min(totalPages, page+1)))}
            disabled={page >= totalPages}
            aria-label="Next page"
          >
            Next →
          </button>
        </div>
      </section>
    </div>
  );
}


