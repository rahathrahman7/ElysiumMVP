

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

export type Product = {
  slug: string;
  title: string;
  blurb: string;
  description: string;
  images: string[];    // place hero images in /public/products/
  basePriceGBP: number;
  metals?: MetalOption[];
  origins?: OriginOption[];
  carats?: CaratOption[];
  colours?: ColourOption[];
  clarities?: ClarityOption[];
  certificates?: CertOption[];
  engravingFeeGBP?: number;
  engravingMaxChars?: number; // NEW
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

// Helper function to generate comprehensive ring sizes
export function generateRingSizes(): string[] {
  // F to Z with half sizes, then Z+1..Z+4
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const startIndex = letters.indexOf("F");
  const endIndex = letters.indexOf("Z");
  const sizes: string[] = [];
  for (let i = startIndex; i <= endIndex; i++) {
    const L = letters[i];
    sizes.push(L);
    if (i !== endIndex) sizes.push(`${L} 1/2`);
  }
  sizes.push("Z+1","Z+2","Z+3","Z+4");
  return sizes;
}

export const products: Product[] = [
  {
    slug: "celeste-six-claw-solitaire",
    title: "Celeste — Six-Claw Solitaire",
    blurb: "Timeless round solitaire secured by six graceful eagle-claw prongs.",
    description:
      "Celeste is a timeless solitaire engagement ring, featuring a brilliant round-cut center stone secured by six graceful eagle-claw prongs. Metals: 18k Yellow, 18k Rose, 18k White, Platinum, Two-Tone Rose/Silver, Two-Tone Yellow/Silver. Diamonds: D–F colour, VS1+ clarity. Certification: GIA or IGI.",
    images: [
      "/products/Celeste/Celeste-gold-front.jpeg",
      "/products/Celeste/Celeste-gold-side.jpeg",
      "/products/Celeste/Celeste-gold-back.jpeg"
    ],
    basePriceGBP: 3350,
    metals: [
      { name: "18k Yellow Gold", hex: METAL_HEX.yellow18k, priceDeltaGBP: 0 },
      { name: "18k Rose Gold",   hex: METAL_HEX.rose18k,   priceDeltaGBP: 0 },
      { name: "18k White Gold",  hex: METAL_HEX.white18k,  priceDeltaGBP: 0 },
      { name: "Platinum",        hex: METAL_HEX.platinum,  priceDeltaGBP: 75 },
      { name: "Two-Tone Rose/Silver", hex: "#B76E79", priceDeltaGBP: 50 },
      { name: "Two-Tone Yellow/Silver", hex: "#D4AF37", priceDeltaGBP: 50 }
    ],
    origins: [
      { label: "Natural",   priceDeltaGBP: 0 },
      { label: "Lab Grown", priceDeltaGBP: 0 }
    ],
    carats: [
      { label: "1ct",   carat: 1.0, priceDeltaGBP: 0 },
      { label: "1.5ct", carat: 1.5, priceDeltaGBP: 2000 },
      { label: "2ct",   carat: 2.0, priceDeltaGBP: 5000 },
      { label: "2.5ct", carat: 2.5, priceDeltaGBP: 8000 },
      { label: "3ct+",  carat: 3.0, priceDeltaGBP: 12000 }
    ],
    colours: [
      { label: "D", priceDeltaGBP: 500 },
      { label: "E", priceDeltaGBP: 250 },
      { label: "F", priceDeltaGBP: 0 }
    ],
    clarities: [
      { label: "IF",   priceDeltaGBP: 1000 },
      { label: "VVS1", priceDeltaGBP: 500 },
      { label: "VVS2", priceDeltaGBP: 250 },
      { label: "VS1",  priceDeltaGBP: 0 }
    ],
    certificates: [
      { label: "GIA", priceDeltaGBP: 300 },
      { label: "IGI", priceDeltaGBP: 0 }
    ],
    engravingFeeGBP: 15,
    engravingMaxChars: 24,
    sizes: generateRingSizes(),
    qualityBanner: "D–F colour • VS1+ clarity • GIA/IGI certified",
    isFeatured: true,
    collections: ["engagement-rings", "solitaire", "six-claw", "eagle-claw", "round", "two-tone", "celeste"],
    shape: "round",
    styles: ["solitaire", "six-claw", "eagle-claw", "two-tone"],
    caratBuckets: ["1-1.5", "1.5-2", "2-2.5", "2.5-3", "3plus"],
    galleryByMetal: {
      "18k Yellow Gold": [
        "/products/Celeste/Celeste-gold-front.jpeg",
        "/products/Celeste/Celeste-gold-side.jpeg",
        "/products/Celeste/Celeste-gold-back.jpeg"
      ],
      "18k Rose Gold": [
        "/products/Celeste/Celeste-rose-front.jpeg",
        "/products/Celeste/Celeste-rose-side.jpeg",
        "/products/Celeste/Celeste-rose-back.jpeg"
      ],
      "18k White Gold": [
        "/products/Celeste/Celeste-silver-front.jpeg",
        "/products/Celeste/Celeste-silver-side.jpeg",
        "/products/Celeste/Celeste-silver-back.jpeg"
      ],
      "Platinum": [
        "/products/Celeste/Celeste-silver-front.jpeg",
        "/products/Celeste/Celeste-silver-side.jpeg",
        "/products/Celeste/Celeste-silver-back.jpeg"
      ],
      "Two-Tone Rose/Silver": [
        "/products/Celeste/Celeste-rose-silver-front.jpeg",
        "/products/Celeste/Celeste-rose-silver-side.jpeg",
        "/products/Celeste/Celeste-rose-silver-back.jpeg"
      ],
      "Two-Tone Yellow/Silver": [
        "/products/Celeste/Celeste-gold-silver-front.jpeg",
        "/products/Celeste/Celeste-gold-silver-side.jpeg",
        "/products/Celeste/Celeste-gold-silver-back.jpeg"
      ]
    }
  },
  {
    slug: "luna-low-set-solitaire",
    title: "Luna — Low-Set Solitaire",
    blurb: "Contemporary low-set round solitaire with open bridge & hidden halo. Flush-fit friendly.",
    description:
      "Luna is a contemporary solitaire that blends elegance with everyday practicality. Designed with a low-set round center stone, its open bridge and hidden halo create a delicate floating effect, allowing the ring to sit close to the finger while fitting perfectly flush with a matching wedding band. Metals: 18k Yellow, 18k Rose, 18k White, Platinum. Diamonds: D–F colour, VS1+ clarity. Certification: GIA or IGI.",
    images: [
      "/products/Luna/Luna-gold-front.jpeg",
      "/products/Luna/Luna-gold-side.jpeg",
      "/products/Luna/Luna-gold=back.jpeg"
    ],
    basePriceGBP: 3250,
    metals: [
      { name: "18k Yellow Gold", hex: METAL_HEX.yellow18k, priceDeltaGBP: 0 },
      { name: "18k Rose Gold",   hex: METAL_HEX.rose18k,   priceDeltaGBP: 0 },
      { name: "18k White Gold",  hex: METAL_HEX.white18k,  priceDeltaGBP: 0 },
      { name: "Platinum",        hex: METAL_HEX.platinum,  priceDeltaGBP: 75 }
    ],
    origins: [
      { label: "Natural",   priceDeltaGBP: 0 },
      { label: "Lab Grown", priceDeltaGBP: 0 }
    ],
    carats: [
      { label: "1ct",   carat: 1.0, priceDeltaGBP: 0 },
      { label: "1.5ct", carat: 1.5, priceDeltaGBP: 2000 },
      { label: "2ct",   carat: 2.0, priceDeltaGBP: 5000 },
      { label: "2.5ct", carat: 2.5, priceDeltaGBP: 8000 },
      { label: "3ct+",  carat: 3.0, priceDeltaGBP: 12000 }
    ],
    colours: [
      { label: "D", priceDeltaGBP: 500 },
      { label: "E", priceDeltaGBP: 250 },
      { label: "F", priceDeltaGBP: 0 }
    ],
    clarities: [
      { label: "IF",   priceDeltaGBP: 1000 },
      { label: "VVS1", priceDeltaGBP: 500 },
      { label: "VVS2", priceDeltaGBP: 250 },
      { label: "VS1",  priceDeltaGBP: 0 }
    ],
    certificates: [
      { label: "GIA", priceDeltaGBP: 300 },
      { label: "IGI", priceDeltaGBP: 0 }
    ],
    engravingFeeGBP: 15,
    engravingMaxChars: 24,
    sizes: generateRingSizes(),
    qualityBanner: "D–F colour • VS1+ clarity • GIA/IGI certified",
    isFeatured: true,
    collections: ["engagement-rings", "solitaire", "low-set", "hidden-halo", "round", "flush-fit", "luna"],
    shape: "round",
    styles: ["solitaire", "low-set", "hidden-halo", "flush-fit"],
    caratBuckets: ["1-1.5", "1.5-2", "2-2.5", "2.5-3", "3plus"],
    galleryByMetal: {
      "18k Yellow Gold": [
        "/products/Luna/Luna-gold-front.jpeg",
        "/products/Luna/Luna-gold-side.jpeg",
        "/products/Luna/Luna-gold=back.jpeg"
      ],
      "18k Rose Gold": [
        "/products/Luna/Luna-rose-front.jpeg",
        "/products/Luna/Luna-Rose-Side.jpeg",
        "/products/Luna/Luna-rose-back.jpeg"
      ],
      "18k White Gold": [
        "/products/Luna/Luna-silver-front.jpeg",
        "/products/Luna/Luna-silver-side.jpeg",
        "/products/Luna/Luna-silver-back.jpeg"
      ],
      "Platinum": [
        "/products/Luna/Luna-silver-front.jpeg",
        "/products/Luna/Luna-silver-side.jpeg",
        "/products/Luna/Luna-silver-back.jpeg"
      ]
    }
  },
  {
    slug: "seraphina-signature-six-claw",
    title: "Seraphina — Signature Six-Claw",
    blurb: "Signature six-claw solitaire with a round-cut centre and pavé band.",
    description:
      "Seraphina is a signature six-claw solitaire, showcasing a round-cut center stone paired with a delicately pavé-set band that extends two-thirds of the way around. Metals: 18k Yellow, 18k Rose, 18k White, Platinum, and Two-Tone (Yellow + White or Rose + White). Diamonds: D–F colour, VS1+ clarity. Certification: GIA or IGI.",
    images: [
      "/products/Seraphina/Seraphina-gold-front.jpeg",
      "/products/Seraphina/Seraphina-gold-side.jpeg",
      "/products/Seraphina/Seraphina-gold-back.jpeg"
    ],
    basePriceGBP: 3450,
    metals: [
      { name: "18k Yellow Gold", hex: METAL_HEX.yellow18k, priceDeltaGBP: 0 },
      { name: "18k Rose Gold",   hex: METAL_HEX.rose18k,   priceDeltaGBP: 0 },
      { name: "18k White Gold",  hex: METAL_HEX.white18k,  priceDeltaGBP: 0 },
      { name: "Platinum",        hex: METAL_HEX.platinum,  priceDeltaGBP: 75 },
      { name: "Two-Tone: Yellow + White", hex: "#D4AF37", priceDeltaGBP: 50 },
      { name: "Two-Tone: Rose + White",   hex: "#B76E79", priceDeltaGBP: 50 }
    ],
    origins: [
      { label: "Natural",   priceDeltaGBP: 0 },
      { label: "Lab Grown", priceDeltaGBP: 0 }
    ],
    carats: [
      { label: "1ct",   carat: 1.0, priceDeltaGBP: 0 },
      { label: "1.5ct", carat: 1.5, priceDeltaGBP: 2000 },
      { label: "2ct",   carat: 2.0, priceDeltaGBP: 5000 },
      { label: "2.5ct", carat: 2.5, priceDeltaGBP: 8000 },
      { label: "3ct+",  carat: 3.0, priceDeltaGBP: 12000 }
    ],
    colours: [
      { label: "D", priceDeltaGBP: 500 },
      { label: "E", priceDeltaGBP: 250 },
      { label: "F", priceDeltaGBP: 0 }
    ],
    clarities: [
      { label: "IF",   priceDeltaGBP: 1000 },
      { label: "VVS1", priceDeltaGBP: 500 },
      { label: "VVS2", priceDeltaGBP: 250 },
      { label: "VS1",  priceDeltaGBP: 0 }
    ],
    certificates: [
      { label: "GIA", priceDeltaGBP: 300 },
      { label: "IGI", priceDeltaGBP: 0 }
    ],
    engravingFeeGBP: 15,
    engravingMaxChars: 24,
    sizes: generateRingSizes(),
    qualityBanner: "D–F colour • VS1+ clarity • GIA/IGI certified",
    isFeatured: true,
    collections: ["engagement-rings", "solitaire", "six-claw", "pave", "round", "two-tone", "seraphina"],
    shape: "round",
    styles: ["solitaire", "six-claw", "pave", "two-tone"],
    caratBuckets: ["1-1.5", "1.5-2", "2-2.5", "2.5-3", "3plus"],
    galleryByMetal: {
      "18k Yellow Gold": [
        "/products/Seraphina/Seraphina-gold-front.jpeg",
        "/products/Seraphina/Seraphina-gold-side.jpeg",
        "/products/Seraphina/Seraphina-gold-back.jpeg"
      ],
      "18k Rose Gold": [
        "/products/Seraphina/Seraphina-rose-front.jpeg",
        "/products/Seraphina/Seraphina-rose-side.jpeg",
        "/products/Seraphina/Seraphina-rose-back.jpeg"
      ],
      "18k White Gold": [
        "/products/Seraphina/Seraphina-silver-front.jpeg",
        "/products/Seraphina/Seraphina-silver-side.jpeg",
        "/products/Seraphina/Seraphina-silver-back.jpeg"
      ],
      "Platinum": [
        "/products/Seraphina/Seraphina-silver-front.jpeg",
        "/products/Seraphina/Seraphina-silver-side.jpeg",
        "/products/Seraphina/Seraphina-silver-back.jpeg"
      ],
      "Two-Tone: Yellow + White": [
        "/products/Seraphina/Seraphina-gold-silver-front.jpeg",
        "/products/Seraphina/Seraphina-gold-silver-side.jpeg",
        "/products/Seraphina/Seraphina-gold-silver-back.jpeg"
      ],
      "Two-Tone: Rose + White": [
        "/products/Seraphina/Seraphina-rose-silver-front.jpeg",
        "/products/Seraphina/Seraphina-rose-silver-side.jpeg",
        "/products/Seraphina/Seraphina-rose-silver-back.jpeg"
      ]
    }
  },
  {
    slug: "vow-veil",
    title: "Vow & Veil — Toi et Moi",
    blurb: "Elegant Toi et Moi design with round and pear stones on a curved band.",
    description:
      "Elegant in its individuality, the Vow & Veil engagement ring pairs a round and pear-cut center stone in a gracefully sculpted, curved band for a distinctive silhouette. For perfect harmony, both stones are configured together — when you choose carat, colour, clarity or certificate, that choice applies to both the round and pear stones.",
    images: [
      "/products/Vow and Veil/VV-gold-front.jpeg",
      "/products/Vow and Veil/VV-gold-side.jpeg",
      "/products/Vow and Veil/VV-gold-back.jpeg"
    ],
    basePriceGBP: 4050,
    metals: [
      { name: "18k Yellow Gold", hex: METAL_HEX.yellow18k, priceDeltaGBP: 0 },
      { name: "18k Rose Gold",   hex: METAL_HEX.rose18k,   priceDeltaGBP: 0 },
      { name: "18k White Gold",  hex: METAL_HEX.white18k,  priceDeltaGBP: 0 },
      { name: "Platinum",        hex: METAL_HEX.platinum,  priceDeltaGBP: 75 }
    ],
    origins: [
      { label: "Natural",   priceDeltaGBP: 0 },
      { label: "Lab Grown", priceDeltaGBP: 0 }
    ],
    carats: [
      { label: "1ct",   carat: 1.0, priceDeltaGBP: 0 },
      { label: "1.5ct", carat: 1.5, priceDeltaGBP: 2000 },
      { label: "2ct",   carat: 2.0, priceDeltaGBP: 5000 },
      { label: "2.5ct", carat: 2.5, priceDeltaGBP: 8000 },
      { label: "3ct+",  carat: 3.0, priceDeltaGBP: 12000 }
    ],
    colours: [
      { label: "D", priceDeltaGBP: 500 },
      { label: "E", priceDeltaGBP: 250 },
      { label: "F", priceDeltaGBP: 0 }
    ],
    clarities: [
      { label: "IF",   priceDeltaGBP: 1000 },
      { label: "VVS1", priceDeltaGBP: 500 },
      { label: "VVS2", priceDeltaGBP: 250 },
      { label: "VS1",  priceDeltaGBP: 0 }
    ],
    certificates: [
      { label: "GIA", priceDeltaGBP: 300 },
      { label: "IGI", priceDeltaGBP: 0 }
    ],
    engravingFeeGBP: 25,
    engravingMaxChars: 24,
    sizes: generateRingSizes(),
    qualityBanner: "D/E/F colour • VS1+ clarity • IGI/GIA certified",
    isFeatured: true,
    collections: ["engagement-rings", "round", "pear", "toi-et-moi", "curved-band", "vow-veil"],
    shape: "toi-et-moi",
    styles: ["toi-et-moi", "curved-band"],
    caratBuckets: ["1-1.5", "1.5-2", "2-2.5", "2.5-3", "3plus"],
    galleryByMetal: {
      "18k Yellow Gold": [
        "/products/Vow and Veil/VV-gold-front.jpeg",
        "/products/Vow and Veil/VV-gold-side.jpeg",
        "/products/Vow and Veil/VV-gold-back.jpeg"
      ],
      "18k Rose Gold": [
        "/products/Vow and Veil/VV-rose-front.jpeg",
        "/products/Vow and Veil/VV-rose-back.jpeg"
      ],
      "18k White Gold": [
        "/products/Vow and Veil/VV-silver-front.jpeg",
        "/products/Vow and Veil/VV-silver-side.jpeg",
        "/products/Vow and Veil/VV-silver-back.jpeg"
      ],
      "Platinum": [
        "/products/Vow and Veil/VV-silver-front.jpeg",
        "/products/Vow and Veil/VV-silver-side.jpeg",
        "/products/Vow and Veil/VV-silver-back.jpeg"
      ]
    }
  },
  {
    slug: "elara-trilogy",
    title: "Elara — Trilogy",
    blurb: "Timeless trilogy design with round center and pear sides in sculpted trellis setting.",
    description:
      "Elara is a timeless trilogy design, showcasing a brilliant round center stone flanked by two pear-cut side stones, all gracefully nestled within a sculpted trellis setting.",
    images: [
      "/products/Elara/Elara-gold-front.jpeg",
      "/products/Elara/Elara-gold-side.jpeg",
      "/products/Elara/Elara-gold-back.jpeg"
    ],
    basePriceGBP: 3950,
    metals: [
      { name: "18k Yellow Gold", hex: METAL_HEX.yellow18k, priceDeltaGBP: 0 },
      { name: "18k Rose Gold",   hex: METAL_HEX.rose18k,   priceDeltaGBP: 0 },
      { name: "18k White Gold",  hex: METAL_HEX.white18k,  priceDeltaGBP: 0 },
      { name: "Platinum",        hex: METAL_HEX.platinum,  priceDeltaGBP: 75 }
    ],
    origins: [
      { label: "Natural",   priceDeltaGBP: 0 },
      { label: "Lab Grown", priceDeltaGBP: 0 }
    ],
    carats: [
      { label: "1ct",   carat: 1.0, priceDeltaGBP: 0 },
      { label: "1.5ct", carat: 1.5, priceDeltaGBP: 2000 },
      { label: "2ct",   carat: 2.0, priceDeltaGBP: 5000 },
      { label: "2.5ct", carat: 2.5, priceDeltaGBP: 8000 },
      { label: "3ct+",  carat: 3.0, priceDeltaGBP: 12000 }
    ],
    colours: [
      { label: "D", priceDeltaGBP: 500 },
      { label: "E", priceDeltaGBP: 250 },
      { label: "F", priceDeltaGBP: 0 }
    ],
    clarities: [
      { label: "IF",   priceDeltaGBP: 1000 },
      { label: "VVS1", priceDeltaGBP: 500 },
      { label: "VVS2", priceDeltaGBP: 250 },
      { label: "VS1",  priceDeltaGBP: 0 }
    ],
    certificates: [
      { label: "GIA", priceDeltaGBP: 300 },
      { label: "IGI", priceDeltaGBP: 0 }
    ],
    engravingFeeGBP: 25,
    engravingMaxChars: 24,
    sizes: generateRingSizes(),
    qualityBanner: "D/E/F colour • VS1+ clarity • IGI/GIA certified",
    isFeatured: true,
    collections: ["engagement-rings", "round", "trilogy", "trellis", "elara"],
    shape: "round",
    styles: ["trilogy", "trellis"],
    caratBuckets: ["1-1.5", "1.5-2", "2-2.5", "2.5-3", "3plus"],
    galleryByMetal: {
      "18k Yellow Gold": [
        "/products/Elara/Elara-gold-front.jpeg",
        "/products/Elara/Elara-gold-side.jpeg",
        "/products/Elara/Elara-gold-back.jpeg"
      ],
      "18k Rose Gold": [
        "/products/Elara/Elara-rose-front.jpeg",
        "/products/Elara/Elara-rose-side.jpeg",
        "/products/Elara/Elara-rose-back.jpeg"
      ],
      "18k White Gold": [
        "/products/Elara/Elara-silver-front.jpeg",
        "/products/Elara/Elara-silver-side.jpeg",
        "/products/Elara/Elara-silver-back.jpeg"
      ],
      "Platinum": [
        "/products/Elara/Elara-silver-front.jpeg",
        "/products/Elara/Elara-silver-side.jpeg",
        "/products/Elara/Elara-silver-back.jpeg"
      ]
    }
  },
  {
    slug: "aveline-radiant-solitaire",
    title: "Aveline — Radiant Solitaire",
    blurb: "Radiant solitaire with hidden halo featuring four talon-tipped claws.",
    description:
      "Stunning in its simplicity, the Aveline engagement ring is a classic radiant solitaire design featuring four talon-tipped claws and a hidden halo.",
    images: [
      "/products/Aveline/Aveline-gold-front.jpeg",
      "/products/Aveline/Aveline-gold-side.jpeg",
      "/products/Aveline/Aveline-gold-back.jpeg"
    ],
    basePriceGBP: 3450,
    metals: [
      { name: "18k Yellow Gold", hex: METAL_HEX.yellow18k, priceDeltaGBP: 0 },
      { name: "18k Rose Gold",   hex: METAL_HEX.rose18k,   priceDeltaGBP: 0 },
      { name: "18k White Gold",  hex: METAL_HEX.white18k,  priceDeltaGBP: 0 },
      { name: "Platinum",        hex: METAL_HEX.platinum,  priceDeltaGBP: 75 }
    ],
    origins: [
      { label: "Natural",   priceDeltaGBP: 0 },
      { label: "Lab Grown", priceDeltaGBP: 0 }
    ],
    carats: [
      { label: "1ct",   carat: 1.0, priceDeltaGBP: 0 },
      { label: "1.5ct", carat: 1.5, priceDeltaGBP: 2000 },
      { label: "2ct",   carat: 2.0, priceDeltaGBP: 5000 },
      { label: "2.5ct", carat: 2.5, priceDeltaGBP: 8000 },
      { label: "3ct+",  carat: 3.0, priceDeltaGBP: 12000 }
    ],
    colours: [
      { label: "D", priceDeltaGBP: 500 },
      { label: "E", priceDeltaGBP: 250 },
      { label: "F", priceDeltaGBP: 0 }
    ],
    clarities: [
      { label: "IF",   priceDeltaGBP: 1000 },
      { label: "VVS1", priceDeltaGBP: 500 },
      { label: "VVS2", priceDeltaGBP: 250 },
      { label: "VS1",  priceDeltaGBP: 0 }
    ],
    certificates: [
      { label: "GIA", priceDeltaGBP: 300 },
      { label: "IGI", priceDeltaGBP: 0 }
    ],
    engravingFeeGBP: 25,
    engravingMaxChars: 24,
    sizes: generateRingSizes(),
    qualityBanner: "D/E/F colour • VS1+ clarity • IGI/GIA certified",
    isFeatured: true,
    collections: ["engagement-rings", "radiant", "solitaire", "hidden-halo", "aveline"],
    shape: "radiant",
    styles: ["solitaire", "hidden-halo"],
    caratBuckets: ["1-1.5", "1.5-2", "2-2.5", "2.5-3", "3plus"],
    galleryByMetal: {
      "18k Yellow Gold": [
        "/products/Aveline/Aveline-gold-front.jpeg",
        "/products/Aveline/Aveline-gold-side.jpeg",
        "/products/Aveline/Aveline-gold-back.jpeg"
      ],
      "18k Rose Gold": [
        "/products/Aveline/Aveline-rose-front.jpeg",
        "/products/Aveline/Aveline-rose-side.jpeg",
        "/products/Aveline/Aveline-rose-back.jpeg"
      ],
      "18k White Gold": [
        "/products/Aveline/Aveline-silver-side.jpeg",
        "/products/Aveline/Aveline-silver-back.jpeg"
      ],
      "Platinum": [
        "/products/Aveline/Aveline-silver-side.jpeg",
        "/products/Aveline/Aveline-silver-back.jpeg"
      ]
    }
  },
  {
    slug: "orabella-toi-et-moi",
    title: "Orabella — Toi et Moi",
    blurb: "Toi et Moi design featuring pear-cut and radiant-cut stones in perfect harmony.",
    description:
      "Orabella is a captivating toi et moi design, featuring a striking duo of pear-cut and radiant-cut stones brought together in perfect harmony.",
    images: [
      "/products/Orabella/orabella-gold-front.jpeg",
      "/products/Orabella/orabella-gold-side.jpeg",
      "/products/Orabella/orabella-gold-back.jpeg"
    ],
    basePriceGBP: 3750,
    metals: [
      { name: "18k Yellow Gold", hex: METAL_HEX.yellow18k, priceDeltaGBP: 0 },
      { name: "18k Rose Gold",   hex: METAL_HEX.rose18k,   priceDeltaGBP: 0 },
      { name: "18k White Gold",  hex: METAL_HEX.white18k,  priceDeltaGBP: 0 },
      { name: "Platinum",        hex: METAL_HEX.platinum,  priceDeltaGBP: 75 }
    ],
    origins: [
      { label: "Natural",   priceDeltaGBP: 0 },
      { label: "Lab Grown", priceDeltaGBP: 0 }
    ],
    carats: [
      { label: "1ct",   carat: 1.0, priceDeltaGBP: 0 },
      { label: "1.5ct", carat: 1.5, priceDeltaGBP: 2000 },
      { label: "2ct",   carat: 2.0, priceDeltaGBP: 5000 },
      { label: "2.5ct", carat: 2.5, priceDeltaGBP: 8000 },
      { label: "3ct+",  carat: 3.0, priceDeltaGBP: 12000 }
    ],
    colours: [
      { label: "D", priceDeltaGBP: 500 },
      { label: "E", priceDeltaGBP: 250 },
      { label: "F", priceDeltaGBP: 0 }
    ],
    clarities: [
      { label: "IF",   priceDeltaGBP: 1000 },
      { label: "VVS1", priceDeltaGBP: 500 },
      { label: "VVS2", priceDeltaGBP: 250 },
      { label: "VS1",  priceDeltaGBP: 0 }
    ],
    certificates: [
      { label: "GIA", priceDeltaGBP: 300 },
      { label: "IGI", priceDeltaGBP: 0 }
    ],
    engravingFeeGBP: 25,
    engravingMaxChars: 24,
    sizes: generateRingSizes(),
    qualityBanner: "D/E/F colour • VS1+ clarity • IGI/GIA certified",
    isFeatured: true,
    collections: ["engagement-rings", "toi-et-moi", "pear", "radiant", "orabella"],
    shape: "toi-et-moi",
    styles: ["toi-et-moi"],
    caratBuckets: ["1-1.5", "1.5-2", "2-2.5", "2.5-3", "3plus"],
    galleryByMetal: {
      "18k Yellow Gold": [
        "/products/Orabella/orabella-gold-front.jpeg",
        "/products/Orabella/orabella-gold-side.jpeg",
        "/products/Orabella/orabella-gold-back.jpeg"
      ],
      "18k Rose Gold": [
        "/products/Orabella/orabella-rose-front.jpeg",
        "/products/Orabella/orabella-rose-side.jpeg",
        "/products/Orabella/orabella-rose-back.jpeg"
      ],
      "18k White Gold": [
        "/products/Orabella/orabella-silver-back.jpeg"
      ],
      "Platinum": [
        "/products/Orabella/orabella-silver-back.jpeg"
      ]
    }
  },
  {
    slug: "clarion-engagement-ring",
    title: "Clarion Engagement Ring",
    blurb: "Radiant solitaire with four-claw setting in classic elegance.",
    description:
      "The Clarion engagement ring is a classic solitaire design, showcasing an exquisite radiant-cut center stone held in a sleek four-claw setting.",
    images: [
      "/products/Clarion/rsol-gold-front.jpeg",
      "/products/Clarion/rsol-gold-side.jpeg",
      "/products/Clarion/rsol-gold-back.jpeg"
    ],
    basePriceGBP: 3450,
    metals: [
      { name: "18k Yellow Gold", hex: METAL_HEX.yellow18k, priceDeltaGBP: 0 },
      { name: "18k Rose Gold",   hex: METAL_HEX.rose18k,   priceDeltaGBP: 0 },
      { name: "18k White Gold",  hex: METAL_HEX.white18k,  priceDeltaGBP: 0 },
      { name: "Platinum",        hex: METAL_HEX.platinum,  priceDeltaGBP: 75 }
    ],
    origins: [
      { label: "Natural",   priceDeltaGBP: 0 },
      { label: "Lab Grown", priceDeltaGBP: 0 }
    ],
    carats: [
      { label: "1ct",   carat: 1.0, priceDeltaGBP: 0 },
      { label: "1.5ct", carat: 1.5, priceDeltaGBP: 2000 },
      { label: "2ct",   carat: 2.0, priceDeltaGBP: 5000 },
      { label: "2.5ct", carat: 2.5, priceDeltaGBP: 8000 },
      { label: "3ct+",  carat: 3.0, priceDeltaGBP: 12000 }
    ],
    colours: [
      { label: "D", priceDeltaGBP: 500 },
      { label: "E", priceDeltaGBP: 250 },
      { label: "F", priceDeltaGBP: 0 }
    ],
    clarities: [
      { label: "IF",   priceDeltaGBP: 1000 },
      { label: "VVS1", priceDeltaGBP: 500 },
      { label: "VVS2", priceDeltaGBP: 250 },
      { label: "VS1",  priceDeltaGBP: 0 }
    ],
    certificates: [
      { label: "GIA", priceDeltaGBP: 300 },
      { label: "IGI", priceDeltaGBP: 0 }
    ],
    engravingFeeGBP: 25,
    engravingMaxChars: 24,
    sizes: generateRingSizes(),
    qualityBanner: "D/E/F colour • VS1+ clarity • IGI/GIA certified",
    isFeatured: true,
    collections: ["engagement-rings", "radiant", "solitaire", "clarion"],
    shape: "radiant",
    styles: ["solitaire"],
    caratBuckets: ["1-1.5", "1.5-2", "2-2.5", "2.5-3", "3plus"],
    galleryByMetal: {
      "18k Yellow Gold": [
        "/products/Clarion/rsol-gold-front.jpeg",
        "/products/Clarion/rsol-gold-side.jpeg",
        "/products/Clarion/rsol-gold-back.jpeg"
      ],
      "18k Rose Gold": [
        "/products/Clarion/rsol-rose-front.jpeg",
        "/products/Clarion/rsol-rose-side.jpeg",
        "/products/Clarion/rsol-rose-back.jpeg"
      ],
      "18k White Gold": [
        "/products/Clarion/rsol-silver-front.jpeg",
        "/products/Clarion/rsol-silver-side.jpeg",
        "/products/Clarion/rsol-silver-back.jpeg"
      ],
      "Platinum": [
        "/products/Clarion/rsol-silver-front.jpeg",
        "/products/Clarion/rsol-silver-side.jpeg",
        "/products/Clarion/rsol-silver-back.jpeg"
      ]
    }
  },
  {
    slug: "ovalis-oval-solitaire",
    title: "Ovalis — Oval Solitaire",
    blurb: "Oval-cut centre stone with refined talon-tipped claws.",
    description:
      "Elegant in its simplicity, the Ovalis engagement ring showcases a captivating oval-cut centre stone secured by four refined talon-tipped claws on a slender band.",
    images: [
      "/products/Ovalis/ovalis-front.jpeg",
      "/products/Ovalis/ovalis-side.jpeg",
      "/products/Ovalis/ovalis-back.jpeg"
    ],
    basePriceGBP: 3200,
    metals: [
      { name: "Platinum",        hex: METAL_HEX.platinum, priceDeltaGBP: 75 },
      { name: "18k White Gold",  hex: METAL_HEX.white18k, priceDeltaGBP:   0 },
      { name: "18k Yellow Gold", hex: METAL_HEX.yellow18k,priceDeltaGBP:   0 },
      { name: "18k Rose Gold",   hex: METAL_HEX.rose18k,  priceDeltaGBP:   0 },
    ],
    origins: [
      { label: "Natural",   priceDeltaGBP: 0 },
      { label: "Lab Grown", priceDeltaGBP: 0 }
    ],
    carats: [
      { label: "1ct",   carat: 1.0, priceDeltaGBP: 0 },
      { label: "1.5ct", carat: 1.5, priceDeltaGBP: 2000 },
      { label: "2ct",   carat: 2.0, priceDeltaGBP: 5000 },
      { label: "2.5ct", carat: 2.5, priceDeltaGBP: 8000 },
      { label: "3ct+",  carat: 3.0, priceDeltaGBP: 12000 }
    ],
    colours: [
      { label: "D", priceDeltaGBP: 500 },
      { label: "E", priceDeltaGBP: 250 },
      { label: "F", priceDeltaGBP: 0 }
    ],
    clarities: [
      { label: "IF",   priceDeltaGBP: 1000 },
      { label: "VVS1", priceDeltaGBP: 500 },
      { label: "VVS2", priceDeltaGBP: 250 },
      { label: "VS1",  priceDeltaGBP: 0 },
    ],
    certificates: [
      { label: "GIA", priceDeltaGBP: 300 },
      { label: "IGI", priceDeltaGBP: 0 }
    ],
    engravingFeeGBP: 25,
    engravingMaxChars: 24,
    sizes: generateRingSizes(),
    qualityBanner: "D/E/F colour • VS1+ clarity • IGI/GIA certified",
    isFeatured: true,
    collections: ["engagement-rings", "oval", "solitaire", "ovalis"],
    shape: "oval",
    styles: ["solitaire"],
    caratBuckets: ["1-1.5", "1.5-2", "2-2.5", "2.5-3", "3plus"],
    galleryByMetal: {
      "18k Yellow Gold": [
        "/products/Ovalis/ovalis-front.jpeg",
        "/products/Ovalis/ovalis-side.jpeg",
        "/products/Ovalis/ovalis-back.jpeg"
      ],
      "18k Rose Gold": [
        "/products/Ovalis/ovalis-rose-front.jpeg",
        "/products/Ovalis/ovalis-rose-side.jpeg",
        "/products/Ovalis/ovalis-rose-back.jpeg"
      ],
      "18k White Gold": [
        "/products/Ovalis/ovalis-plat-front.jpeg",
        "/products/Ovalis/ovalis-plat-side.jpeg",
        "/products/Ovalis/ovalis-plat-back.jpeg"
      ],
      "Platinum": [
        "/products/Ovalis/ovalis-plat-front.jpeg",
        "/products/Ovalis/ovalis-plat-side.jpeg",
        "/products/Ovalis/ovalis-plat-back.jpeg"
      ]
    }
  },
  {
    slug: "eterna-oval-solitaire-hidden-halo",
    title: "Oval Solitaire w Hidden Halo",
    blurb:
      "Renowned for its timeless elegance, the Eterna engagement ring features a classic four-talon claw oval solitaire design, enhanced by a dazzling hidden halo.",
    description:
      "Renowned for its timeless elegance, the Eterna engagement ring features a classic four-talon claw oval solitaire design, enhanced by a dazzling hidden halo.",
    images: [
      "/products/Eterna/eterna-front.jpeg",
      "/products/Eterna/eterna-side.jpeg",
      "/products/Eterna/eterna-back.jpeg"
    ],
    basePriceGBP: 3450,
    metals: [
      { name: "Platinum",        hex: METAL_HEX.platinum, priceDeltaGBP: 75 },
      { name: "18k White Gold",  hex: METAL_HEX.white18k,  priceDeltaGBP: 0 },
      { name: "18k Yellow Gold", hex: METAL_HEX.yellow18k, priceDeltaGBP: 0 },
      { name: "18k Rose Gold",   hex: METAL_HEX.rose18k,   priceDeltaGBP: 0 }
    ],
    origins: [
      { label: "Natural",   priceDeltaGBP: 0 },
      { label: "Lab Grown", priceDeltaGBP: 0 }
    ],
    carats: [
      { label: "1ct",   carat: 1.0, priceDeltaGBP: 0 },
      { label: "1.5ct", carat: 1.5, priceDeltaGBP: 2000 },
      { label: "2ct",   carat: 2.0, priceDeltaGBP: 5000 },
      { label: "2.5ct", carat: 2.5, priceDeltaGBP: 8000 },
      { label: "3ct+",  carat: 3.0, priceDeltaGBP: 12000 }
    ],
    colours: [
      { label: "D", priceDeltaGBP: 500 },
      { label: "E", priceDeltaGBP: 250 },
      { label: "F", priceDeltaGBP: 0 }
    ],
    clarities: [
      { label: "IF",   priceDeltaGBP: 1000 },
      { label: "VVS1", priceDeltaGBP: 500 },
      { label: "VVS2", priceDeltaGBP: 250 },
      { label: "VS1",  priceDeltaGBP: 0 }
    ],
    certificates: [
      { label: "GIA", priceDeltaGBP: 300 },
      { label: "IGI", priceDeltaGBP: 0 }
    ],
    sizes: generateRingSizes(),
    engravingFeeGBP: 25,
    engravingMaxChars: 24,
    qualityBanner: "D/E/F colour • VS1+ clarity • IGI/GIA certified",
    isFeatured: true,
    collections: ["engagement-rings", "oval", "solitaire", "eterna"],
    shape: "oval",
    styles: ["solitaire", "hidden-halo"],
    caratBuckets: ["1-1.5", "1.5-2", "2-2.5", "2.5-3", "3plus"],
    galleryByMetal: {
      "18k Yellow Gold": [
        "/products/Eterna/eterna-front.jpeg",
        "/products/Eterna/eterna-side.jpeg",
        "/products/Eterna/eterna-back.jpeg"
      ],
      "18k Rose Gold": [
        "/products/Eterna/eterna-rose-front.jpeg",
        "/products/Eterna/eterna-rose-side.jpeg",
        "/products/Eterna/eterna-rose-back.jpeg"
      ],
      "18k White Gold": [
        "/products/Eterna/eterna-plat-front.jpeg",
        "/products/Eterna/eterna-plat-side.jpeg",
        "/products/Eterna/eterna-plat-back.jpeg"
      ],
      "Platinum": [
        "/products/Eterna/eterna-plat-front.jpeg",
        "/products/Eterna/eterna-plat-side.jpeg",
        "/products/Eterna/eterna-plat-back.jpeg"
      ]
    }
  },
  {
    slug: "nova-oval-solitaire-round-marquise",
    title: "Oval Solitaire w Round & Marquise",
    blurb:
      "The beloved Nova design showcases a dazzling oval-cut centre stone, complemented by a refined band adorned with two pairs of round and marquise-cut side stones.",
    description:
      "The beloved Nova design showcases a dazzling oval-cut centre stone, complemented by a refined band adorned with two pairs of round and marquise-cut side stones.",
    images: [
      "/products/nova/nova-front.jpeg",
      "/products/nova/nova-side.jpeg",
      "/products/nova/nova-back.jpeg"
    ],
    basePriceGBP: 3750,
    metals: [
      { name: "Platinum",        hex: METAL_HEX.platinum, priceDeltaGBP: 75 },
      { name: "18k White Gold",  hex: METAL_HEX.white18k,  priceDeltaGBP: 0 },
      { name: "18k Yellow Gold", hex: METAL_HEX.yellow18k, priceDeltaGBP: 0 },
      { name: "18k Rose Gold",   hex: METAL_HEX.rose18k,   priceDeltaGBP: 0 }
    ],
    origins: [
      { label: "Natural",   priceDeltaGBP: 0 },
      { label: "Lab Grown", priceDeltaGBP: 0 }
    ],
    carats: [
      { label: "1ct",   carat: 1.0, priceDeltaGBP: 0 },
      { label: "1.5ct", carat: 1.5, priceDeltaGBP: 2000 },
      { label: "2ct",   carat: 2.0, priceDeltaGBP: 5000 },
      { label: "2.5ct", carat: 2.5, priceDeltaGBP: 8000 },
      { label: "3ct+",  carat: 3.0, priceDeltaGBP: 12000 }
    ],
    colours: [
      { label: "D", priceDeltaGBP: 500 },
      { label: "E", priceDeltaGBP: 250 },
      { label: "F", priceDeltaGBP: 0 }
    ],
    clarities: [
      { label: "IF",   priceDeltaGBP: 1000 },
      { label: "VVS1", priceDeltaGBP: 500 },
      { label: "VVS2", priceDeltaGBP: 250 },
      { label: "VS1",  priceDeltaGBP: 0 }
    ],
    certificates: [
      { label: "GIA", priceDeltaGBP: 300 },
      { label: "IGI", priceDeltaGBP: 0 }
    ],
    sizes: generateRingSizes(),
    engravingFeeGBP: 25,
    engravingMaxChars: 24,
    qualityBanner: "D/E/F colour • VS1+ clarity • IGI/GIA certified",
    isFeatured: true,
    collections: ["engagement-rings", "oval", "solitaire", "nova"],
    shape: "oval",
    styles: ["solitaire", "three-stone"],
    caratBuckets: ["1-1.5", "1.5-2", "2-2.5", "2.5-3", "3plus"],
    galleryByMetal: {
      "18k Yellow Gold": [
        "/products/nova/nova-front.jpeg",
        "/products/nova/nova-side.jpeg",
        "/products/nova/nova-back.jpeg"
      ],
      "18k Rose Gold": [
        "/products/nova/nova-rose-front.jpeg",
        "/products/nova/nova-rose-side.jpeg",
        "/products/nova/nova-rose-back.jpeg"
      ],
      "18k White Gold": [
        "/products/nova/nova-plat-front.jpeg",
        "/products/nova/nova-plat-side.jpeg",
        "/products/nova/nova-plat-back.jpeg"
      ],
      "Platinum": [
        "/products/nova/nova-plat-front.jpeg",
        "/products/nova/nova-plat-side.jpeg",
        "/products/nova/nova-plat-back.jpeg"
      ]
    }
  }
];

export function getAllProducts(){ return products; }
export function getProductBySlug(slug: string){ return products.find(p => p.slug === slug); }
