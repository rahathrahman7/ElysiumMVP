import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ProductDetail } from "@/components/products/ProductDetail";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  // Lazy import to avoid loading large products array during build compilation
  const { getProductBySlug } = await import('@/lib/products');
  const product = getProductBySlug(slug);
  
  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const title = product.seoTitle || `${product.title} — Radiant Solitaire in 18k Gold & Platinum | ELYSIUM London`;
  const description = product.seoDescription || product.description;
  const image = product.images?.[0] || "/products/Clarion/rsol-gold-front.jpeg";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  // Lazy import to avoid loading large products array during build compilation
  const { getProductBySlug } = await import('@/lib/products');
  const product = getProductBySlug(slug);
  
  if (!product) {
    console.error(`[ProductPage] Product not found for slug: "${slug}"`);
    notFound();
  }

  return <ProductDetail product={product} />;
}
