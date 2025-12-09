import type { Product } from "@/types/product";

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

export function generateProductJsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images?.map((i) => i.url).slice(0, 5),
    offers: {
      "@type": "Offer",
      priceCurrency: "GBP",
      price: (product.basePriceGBP).toFixed(2),
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  } as const;
}

export function generatePdpBreadcrumbJsonLd(product: Product) {
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















