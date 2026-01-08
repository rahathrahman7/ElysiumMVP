import { getSanityClient } from "@/lib/sanity/client";
import { env } from "@/lib/env";
import type { Product, ProductListItem } from "@/types/product";
// Removed top-level import to prevent build-time compilation of large products.ts file

export async function getFeaturedProducts(): Promise<ProductListItem[]> {
  if (!env.SANITY_PROJECT_ID) return [];
  const sanityClient = getSanityClient();
  if (!sanityClient) return [];
  const query = `*[_type=="product" && featured==true]{
    _id, title, "slug": slug.current, "images": images(){"url": asset->url}, basePriceGBP
  } | order(_createdAt desc)[0...3]`;
  return await sanityClient.fetch(query);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!env.SANITY_PROJECT_ID) return null;
  const sanityClient = getSanityClient();
  if (!sanityClient) return null;
  const query = `*[_type=="product" && slug.current==$slug][0]{
    _id, title, "slug": slug.current, description, "images": images(){"url": asset->url}, basePriceGBP,
    options{ metals[]{name, priceDelta}, stones[]{name, priceDelta}, cuts[]{name, priceDelta} },
    ringSizes, caratOptions, inStock, featured, seoTitle, seoDescription
  }`;
  return await sanityClient.fetch(query, { slug });
}

export async function getProductsFiltered(params: Record<string, string | undefined>) {
  // Parse sort & pagination params first
  const sortParam = (params.sort || "newest") as string;
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const limit = Math.min(48, Math.max(1, parseInt(params.limit || "12", 10)));
  const start = (page - 1) * limit;
  const end = start + limit;

  // Try Sanity first
  if (env.SANITY_PROJECT_ID) {
    const sanityClient = getSanityClient();
    if (sanityClient) {
      try {
        // Map sort to GROQ order
        const sortToGroq: Record<string, string> = {
          newest: "_createdAt desc",
          oldest: "_createdAt asc",
          price_asc: "basePriceGBP asc",
          price_desc: "basePriceGBP desc",
        };
        const order = sortToGroq[sortParam] || sortToGroq.newest;

        // Count total
        const totalQuery = `count(*[_type=="product"])`;
        const total = await sanityClient.fetch<number>(totalQuery);

        // Page of products
        const pageQuery = `*[_type=="product"]{ _id, title, blurb, "slug": slug.current, "images": images(){"url": asset->url}, basePriceGBP, isFeatured } | order(${order})[${start}...${end}]`;
        const products = await sanityClient.fetch<ProductListItem[]>(pageQuery);
        return { products, total, page, limit };
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn("Sanity fetch failed, falling back to local data:", error);
        }
      }
    }
  }

  // Fallback to local products data - lazy import to avoid build-time compilation
  const { getAllProducts } = await import('@/lib/products');
  const localProducts = getAllProducts();
  
  // Apply category filter if specified
  let filteredProducts = localProducts;
  if (params.category) {
    filteredProducts = localProducts.filter(p => 
      p.collections?.includes(params.category || '') ||
      (params.category === 'ring' && p.collections?.includes('engagement-rings')) ||
      (params.category === 'mens-rings' && p.collections?.includes('mens-rings'))
    );
  }

  if (params.shape) {
    const shape = (params.shape || '').toLowerCase();
    filteredProducts = filteredProducts.filter(p => (p.shape || '').toLowerCase() === shape);
  }

  if (params.collection) {
    const collection = (params.collection || '').toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.collections?.some(c => c.toLowerCase() === collection)
    );
  }

  // Apply metal filter if specified
  if (params.metal) {
    filteredProducts = filteredProducts.filter(p => 
      p.metals?.some(m => m.name.toLowerCase().includes(params.metal?.toLowerCase() || ''))
    );
  }

  // Apply sorting
  if (sortParam === "price_asc") {
    filteredProducts.sort((a, b) => a.basePriceGBP - b.basePriceGBP);
  } else if (sortParam === "price_desc") {
    filteredProducts.sort((a, b) => b.basePriceGBP - a.basePriceGBP);
  }
  // For newest/oldest, we'll keep the original order since we don't have creation dates

  // Apply pagination
  const total = filteredProducts.length;
  const paginatedProducts = filteredProducts.slice(start, start + limit);

  // Convert to expected format - transform images to ProductImage format
  const products: ProductListItem[] = paginatedProducts.map(p => ({
    _id: p.slug,
    title: p.title,
    blurb: p.blurb,
    description: p.description,
    slug: p.slug,
    images: p.images?.map(img => ({ url: img })) || [],
    basePriceGBP: p.basePriceGBP,
    isFeatured: p.isFeatured,
    metals: p.metals,
    styles: p.styles,
    collections: p.collections
  }));

  return { products, total, page, limit };
}
