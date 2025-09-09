import { getSanityClient } from "@/lib/sanity/client";
import { env } from "@/lib/env";
import type { Product, ProductListItem } from "@/types/product";

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
  // Basic filtering with sort & pagination; expand per real taxonomy
  if (!env.SANITY_PROJECT_ID) return { products: [], total: 0 };
  const sanityClient = getSanityClient();
  if (!sanityClient) return { products: [], total: 0 };

  // Parse sort & pagination params
  const sortParam = (params.sort || "newest") as string;
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const limit = Math.min(48, Math.max(1, parseInt(params.limit || "12", 10)));
  const start = (page - 1) * limit;
  const end = start + limit;

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
  const pageQuery = `*[_type=="product"]{ _id, title, "slug": slug.current, "images": images(){"url": asset->url}, basePriceGBP } | order(${order})[${start}...${end}]`;
  const products = await sanityClient.fetch<ProductListItem[]>(pageQuery);
  return { products, total, page, limit };
}


