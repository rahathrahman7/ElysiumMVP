export interface ProductOptionItem {
  name: string;
  priceDelta: number; // in pence
}

export interface ProductOptions {
  metals?: ProductOptionItem[];
  stones?: ProductOptionItem[];
  cuts?: ProductOptionItem[];
}

export interface ProductImage { url: string; alt?: string }

export interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  images: ProductImage[];
  basePriceGBP: number; // in pence
  options: ProductOptions;
  ringSizes?: string[];
  caratOptions?: string[];
  inStock: boolean;
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface ProductListItem extends Pick<Product, "_id" | "title" | "slug" | "images" | "basePriceGBP"> {
  blurb?: string;
  description?: string;
  isFeatured?: boolean;
  metals?: Array<{ name: string; hex?: string; imageUrl?: string; priceDeltaGBP?: number }>;
  styles?: string[];
  collections?: string[];
  galleryByMetal?: Record<string, string[]>;
  galleryByCaratAndMetal?: Record<string, Record<string, string[]>>;
}
















