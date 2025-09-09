"use client";
import Link from "next/link";
import Image from "next/image";
import useWishlist from "@/hooks/useWishlist";

export default function WishlistPage(){
  const { items, remove } = useWishlist();
  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="font-serif text-3xl text-neutral-900 mb-3">Your Wishlist</h1>
        <p className="text-neutral-600">Save your favorite pieces for later</p>
      </div>
      
      {!items.length ? (
        <div className="text-center py-16">
          <div className="text-neutral-400 mb-4">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mx-auto">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" strokeWidth="1" fill="none"/>
            </svg>
          </div>
          <p className="text-neutral-700 mb-6">No items in your wishlist yet.</p>
          <Link href="/products" className="inline-flex items-center px-6 py-3 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-colors">
            Browse the collection
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
          {items.map(i => (
            <div key={i.slug}>
              <Link href={`/products/${i.slug}`} className="block hover:scale-[1.02] transition-transform">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm hover:shadow-md hover:border-neutral-300 transition-all duration-300">
                  {i.imageSrc ? (
                    <Image src={i.imageSrc} alt={i.name} fill className="object-cover transition-transform duration-300 hover:scale-105" />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center bg-neutral-50 text-neutral-400">
                      <span className="text-xs">Image</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-3 text-center">
                  <div className="font-medium text-sm text-neutral-900 hover:text-neutral-700 transition-colors">
                    {i.name}
                  </div>
                  {i.price && (
                    <div className="text-xs text-neutral-600 mt-1">
                      From {typeof i.price==="number" ? 
                        new Intl.NumberFormat("en-GB",{
                          style:"currency",
                          currency:"GBP",
                          maximumFractionDigits:0
                        }).format(i.price) : 
                        i.price
                      }
                    </div>
                  )}
                </div>
              </Link>
              
              <button
                type="button"
                onClick={() => remove(i.slug)}
                className="mt-3 w-full rounded-full border border-neutral-200 px-4 py-2 text-xs text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300 hover:text-neutral-800 transition-all duration-200"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
