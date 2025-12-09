// Product types - separated from large data array to optimize build performance
// Components should import types from here, not from products.ts

export type MetalOption = {
  name: string;
  hex?: string;        // swatch colour
  priceDeltaGBP: number;
};

export type OriginOption = { 
  label: "Natural"|"Lab Grown"; 
  priceDeltaGBP: number 
};

export type CaratOption = { 
  label: string; 
  carat: number; 
  priceDeltaGBP: number 
};

export type ColourOption = { 
  label: "D"|"E"|"F"; 
  priceDeltaGBP: number 
};

export type ClarityOption = {
  label: "IF" | "VVS1" | "VVS2" | "VS1";
  priceDeltaGBP: number;
};

export type CertOption = { 
  label: "GIA"|"IGI"; 
  priceDeltaGBP: number 
};

export type WidthOption = {
  label: string;
  width: number;
  priceDeltaGBP: number;
};

export type Product = {
  slug: string;
  title: string;
  blurb: string;
  description: string;
  images: string[];    // place hero images in /public/products/
  basePriceGBP: number;
  metals?: MetalOption[];
  widths?: WidthOption[];  // For men's rings
  origins?: OriginOption[];
  carats?: CaratOption[];
  colours?: ColourOption[];
  clarities?: ClarityOption[];
  certificates?: CertOption[];
  engravingFeeGBP?: number;
  engravingMaxChars?: number;
  sizes?: string[];
  qualityBanner: string; // "D/E/F • VS1+ • IGI/GIA"
  isFeatured?: boolean;
  collections?: string[];
  galleryByMetal?: Record<string, string[]>; // Metal-aware image galleries
  // Filtering fields
  shape?: string;
  styles?: string[];
  caratBuckets?: string[];
  // SEO fields
  seoTitle?: string;
  seoDescription?: string;
};

// HEX swatches requested by client
export const METAL_HEX = {
  yellow18k: "#FFD700",
  rose18k:   "#B76E79",
  white18k:  "#FAF9F6",
  platinum:  "#E5E4E2",
};
