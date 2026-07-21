/** Minimal product shape used by SEO helpers — works for both catalog Product types. */
type SeoProductLike = {
  title: string;
  description?: string;
  slug: string;
  images?: Array<string | { url: string; alt?: string }>;
  basePriceGBP: number;
  inStock?: boolean;
};

function imageUrls(images?: SeoProductLike["images"]): string[] {
  if (!images?.length) return [];
  return images
    .map((img) => (typeof img === "string" ? img : img.url))
    .filter((url): url is string => Boolean(url))
    .slice(0, 5);
}

export const defaultSEO = {
  titleTemplate: "%s | ELYSIUM",
  defaultTitle: "ELYSIUM — Fine Jewellery",
  description: "Luxury jewellery crafted in our London atelier.",
  openGraph: {
    type: "website",
    siteName: "ELYSIUM",
  },
};

export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ELYSIUM",
    description: "Luxury jewellery crafted in our London atelier",
    url: "https://elysium.com",
    logo: "https://elysium.com/brand/elysium-mark.svg",
    address: {
      "@type": "PostalAddress",
      addressLocality: "London",
      addressCountry: "GB"
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "English"
    }
  };
}

export function generateProductJsonLd(product: SeoProductLike) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: imageUrls(product.images),
    offers: {
      "@type": "Offer",
      priceCurrency: "GBP",
      price: (product.basePriceGBP).toFixed(2),
      availability: product.inStock === false
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
    },
  } as const;
}

export function generatePdpBreadcrumbJsonLd(product: Pick<SeoProductLike, "title" | "slug">) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: "Shop", item: "/shop" },
      { "@type": "ListItem", position: 3, name: product.title, item: `/product/${product.slug}` },
    ],
  } as const;
}
