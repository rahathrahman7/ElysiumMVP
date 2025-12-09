"use client";
import Image from "next/image";
import { useState } from "react";

export function ProductGallery({ images, title }: { images: { url: string }[]; title: string }) {
  const [index, setIndex] = useState(0);
  const active = images?.[index];
  return (
    <div>
      <div className="aspect-square bg-beige/40 border rounded overflow-hidden">
        {active && (
          <Image src={active.url} alt={title} width={1000} height={1000} className="h-full w-full object-cover" />
        )}
      </div>
      <div className="mt-3 grid grid-cols-5 gap-2">
        {images?.slice(0,5).map((img, i) => (
          <button key={i} className={`aspect-square border rounded overflow-hidden ${i===index?"ring-2 ring-gold":""}`} onClick={()=>setIndex(i)}>
            <Image src={img.url} alt="thumb" width={200} height={200} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
















