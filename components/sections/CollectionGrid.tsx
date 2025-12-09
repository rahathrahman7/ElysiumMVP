"use client";
import { Product } from '@/lib/productTypes';
import LuxuryProductCard from '@/components/ui/LuxuryProductCard';

interface CollectionGridProps {
  products: Product[];
  title?: string;
  className?: string;
}

export default function CollectionGrid({ products, title, className = "" }: CollectionGridProps) {
  return (
    <div className={`space-y-8 ${className}`}>
      {title && (
        <div className="text-center">
          <h2 className="font-serif text-3xl sm:text-4xl text-neutral-900 leading-tight">
            {title}
          </h2>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {products.map((product) => (
          <LuxuryProductCard key={product.slug} product={product} />
        ))}
        {products.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-sm text-neutral-600">No items match those filters. Try removing some options.</p>
          </div>
        )}
      </div>
    </div>
  );
}










