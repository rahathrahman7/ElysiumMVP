"use client";

import { useState, useEffect } from "react";
import { Product } from "@/lib/productTypes";
import { CompactProductVariants } from "./CompactProductVariants";
import { ProductActions } from "./ProductActions";
import LuxuryProductConfigurator from "../configurator/LuxuryProductConfigurator";
import StickySummary from "../pdp/StickySummary";
import Gallery from "../pdp/Gallery";
import TrustStrip from "../pdp/TrustStrip";
import ShareBuild from "../pdp/ShareBuild";
import WishHeart from "../common/WishHeart";
import RecentlyViewed from "../pdp/RecentlyViewed";
import ProductReviews from "../pdp/ProductReviews";
import { Breadcrumb } from "../ui/Breadcrumb";
import { resolveGallery } from "@/lib/imageResolver";
import useConfiguratorShare from "@/hooks/useConfiguratorShare";
import { generateProductJsonLd, generatePdpBreadcrumbJsonLd } from "@/lib/seo";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  // Client requirement: Default metals by category
  // - Engagement rings: default to 18k Yellow Gold
  // - Men's rings: default to Platinum
  const isMensRing = product.collections?.includes('mens-rings');
  const isEngagementRing = product.collections?.includes('engagement-rings');
  
  // Determine default metal based on product category
  let defaultMetal: MetalOption | undefined;
  if (isMensRing) {
    // Men's rings: default to Platinum
    defaultMetal = product.metals?.find(m => m.name.toLowerCase().includes('platinum')) || product.metals?.[0];
  } else if (isEngagementRing) {
    // Engagement rings: default to 18k Yellow Gold
    // Search for yellow gold (prefer 18k Yellow Gold, but accept any yellow gold variant)
    defaultMetal = product.metals?.find(m => {
      const name = m.name.toLowerCase();
      return name.includes('18k yellow gold') || name.includes('yellow gold');
    });
    // If no yellow gold found, fall back to first metal that's not platinum
    if (!defaultMetal) {
      defaultMetal = product.metals?.find(m => !m.name.toLowerCase().includes('platinum')) || product.metals?.[0];
    }
  } else {
    // Other products: default to first metal
    defaultMetal = product.metals?.[0];
  }
  
  const [selectedMetal, setSelectedMetal] = useState(defaultMetal || null);
  const [selectedOrigin, setSelectedOrigin] = useState(product.origins?.[0] || null); // Default to Natural (or null if no origins)
  const [selectedCarat, setSelectedCarat] = useState(product.carats?.[0] || null); // Default to 1ct (or null if no carats)
  const [selectedColour, setSelectedColour] = useState(product.colours?.[2] || null); // Default to F (or null if no colours)
  const [selectedClarity, setSelectedClarity] = useState(product.clarities?.[3] || null); // Default to VS1 (or null if no clarities)
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[2] || null); // Default to L (or null if no sizes)
  const [engravingSelected, setEngravingSelected] = useState(false);
  const [engravingText, setEngravingText] = useState("");
  const [useLuxuryConfigurator, setUseLuxuryConfigurator] = useState(false);
  const [previewMetalName, setPreviewMetalName] = useState<string | undefined>(undefined);

  // hydrate from URL (URL wins), and keep URL in sync when local changes happen
  const { build, setField, copyLink } = useConfiguratorShare({
    origin: selectedOrigin?.label,
    carat: selectedCarat?.label,
    colour: selectedColour?.label,
    clarity: selectedClarity?.label,
    metal: selectedMetal?.name,
    ringSize: selectedSize || undefined,
    engravingText: engravingText,
    engravingOn: engravingSelected,
  });

  // When hook's build changes, mirror into your local state (without breaking logic)
  useEffect(()=>{
    if (build.origin !== undefined) setSelectedOrigin(product.origins?.find(o => o.label === build.origin) || null);
    if (build.carat !== undefined) setSelectedCarat(product.carats?.find(c => c.label === build.carat) || null);
    if (build.colour !== undefined) setSelectedColour(product.colours?.find(c => c.label === build.colour) || null);
    if (build.clarity !== undefined) setSelectedClarity(product.clarities?.find(c => c.label === build.clarity) || null);
    if (build.metal !== undefined) setSelectedMetal(product.metals?.find(m => m.name === build.metal) || null);
    if (build.ringSize !== undefined) setSelectedSize(build.ringSize);
    if (build.engravingOn !== undefined) setEngravingSelected(!!build.engravingOn);
    if (build.engravingText !== undefined) setEngravingText((build.engravingText||"").slice(0,24));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [build]);

  // Derive current gallery images based on selected/preview metal or fallback to product.images
  const displayMetal = previewMetalName || selectedMetal?.name;
  const currentGalleryImages = resolveGallery(product, displayMetal).map(src => ({
    src,
    alt: product.title
  }));

  const totalPrice = product.basePriceGBP +
    (selectedMetal?.priceDeltaGBP || 0) +
    (selectedOrigin?.priceDeltaGBP || 0) +
    (selectedCarat?.priceDeltaGBP || 0) +
    (selectedColour?.priceDeltaGBP || 0) +
    (selectedClarity?.priceDeltaGBP || 0) +
    (engravingSelected ? (product.engravingFeeGBP || 0) : 0);

  // Prepare selections for StickySummary
  const selections = {
    origin: selectedOrigin?.label,
    carat: selectedCarat?.label,
    colour: selectedColour?.label,
    clarity: selectedClarity?.label,
    metal: selectedMetal?.name,
    ringSize: selectedSize || undefined,
    engraving: engravingSelected ? "Yes" : null,
  };

  // Check if natural diamond is selected
  const isNaturalDiamond = selectedOrigin?.label === 'Natural';

  // Check if current selection is a custom specification
  // Custom specification = when the selected combination doesn't match any standard tier
  // Standard tiers are: 1ct/F/VS1, 1.5ct/F/VS1, 2ct/F/VS1, 2.5ct/F/VS1, 3ct/F/VS1
  const standardTiers = [
    { carat: '1ct', colour: 'F', clarity: 'VS1' },
    { carat: '1.5ct', colour: 'F', clarity: 'VS1' },
    { carat: '2ct', colour: 'F', clarity: 'VS1' },
    { carat: '2.5ct', colour: 'F', clarity: 'VS1' },
    { carat: '3ct', colour: 'F', clarity: 'VS1' },
  ];
  
  const isCustomSpecification = selectedCarat && selectedColour && selectedClarity
    ? !standardTiers.some(tier => 
        tier.carat === selectedCarat.label &&
        tier.colour === selectedColour.label &&
        tier.clarity === selectedClarity.label
      )
    : true; // If any selection is missing, consider it custom

  // Check if it's the 1ct Natural tier (can be purchased directly)
  const is1ctNatural = Boolean(
    isNaturalDiamond &&
    selectedCarat?.label === '1ct' &&
    selectedColour?.label === 'F' &&
    selectedClarity?.label === 'VS1'
  );

  // New purchase flow logic:
  // - Natural 1ct/F/VS1 → Buy Now (can purchase directly)
  // - Natural anything else → Enquire (consultation required)
  // - Lab Grown + NOT custom spec → Buy Now
  // - Lab Grown + custom spec → Enquire
  const isEntryLevel = Boolean(
    is1ctNatural || (!isNaturalDiamond && !isCustomSpecification)
  );

  // Check if required fields are selected (ring size is required)
  const canAdd = Boolean(selectedSize);

  // Handle Add to Bag (placeholder for now)
  const handleAddToBag = () => {
    // TODO: Implement add to cart logic
    console.log("Adding to bag:", {
      product: product.slug,
      selections,
      totalPrice,
    });
  };

  // Generate structured data
  const productJsonLd = generateProductJsonLd(product);
  const breadcrumbJsonLd = generatePdpBreadcrumbJsonLd(product);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <main className="min-h-screen bg-white pb-20 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        {/* Breadcrumb Navigation */}
        <div className="mb-4 md:mb-6">
          <Breadcrumb 
            items={[
              { label: 'Home', href: '/' },
              { label: 'Collection', href: '/products' },
              { label: product.title, href: `/products/${product.slug}`, current: true }
            ]}
          />
        </div>
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-16">
          {/* Product Gallery - shows first on mobile */}
          <div className="order-1">
            <Gallery 
              images={currentGalleryImages} 
            />
            <TrustStrip />
          </div>

          {/* Product Info - shows second on mobile */}
          <div className="order-2">
            <div className="sticky top-8">
              {/* Quality Banner */}
              <div className="mb-4 md:mb-6">
                <div className="inline-flex items-center px-3 py-1 bg-gray-50 border border-gray-200 rounded-full">
                  <span className="text-xs font-serif font-medium text-[#6D3D0D] uppercase tracking-wide">
                    {product.qualityBanner}
                  </span>
                </div>
              </div>

              {/* Title & Blurb */}
              <div className="mb-6 md:mb-8">
                <div className="relative pr-12">
                  <h1 className="font-serif text-2xl sm:text-3xl lg:text-5xl uppercase tracking-[0.08em] lg:tracking-[0.12em] text-[#6D3D0D] mb-3 md:mb-4 leading-tight">
                    {product.title}
                  </h1>
                  <WishHeart 
                    item={{ 
                      slug: product.slug, 
                      name: product.title, 
                      price: totalPrice, 
                      imageSrc: product.images?.[0] 
                    }} 
                    className="absolute right-0 top-0 text-[#6D3D0D]/60 hover:text-[#6D3D0D]" 
                  />
                </div>
                <p className="font-serif text-lg text-[#6D3D0D]/70 leading-relaxed">
                  {product.blurb}
                </p>
              </div>

              {/* Price */}
              <div className="mb-6 md:mb-8">
                {isNaturalDiamond ? (
                  <div className="flex flex-col gap-1 md:gap-2">
                    <span className="font-serif text-xl md:text-2xl lg:text-3xl text-[#6D3D0D]">
                      Price upon request
                    </span>
                    <span className="font-serif text-xs md:text-sm text-[#6D3D0D]/60">
                      Natural diamonds require consultation for pricing
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1 md:gap-2">
                    <div className="flex items-baseline gap-2 md:gap-3">
                      <span className="font-serif text-2xl md:text-3xl lg:text-4xl text-[#6D3D0D]">
                        £{totalPrice.toLocaleString()}
                      </span>
                      <span className="font-serif text-xs md:text-sm text-[#6D3D0D]/60">
                        From £{product.basePriceGBP.toLocaleString()}
                      </span>
                    </div>
                    <span className="font-serif text-xs md:text-sm text-[#6D3D0D]/60">
                      Tax Included
                    </span>
                  </div>
                )}
              </div>

              {/* Configuration Toggle */}
              <div className="mb-4 md:mb-6 flex items-center justify-center space-x-2 md:space-x-4">
                <button
                  onClick={() => setUseLuxuryConfigurator(false)}
                  className={`px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-serif font-medium rounded-lg transition-all duration-300 ${
                    !useLuxuryConfigurator 
                      ? 'bg-elysium-gold text-white shadow-lg' 
                      : 'bg-gray-100 text-[#6D3D0D]/70 hover:bg-gray-200'
                  }`}
                >
                  Classic
                </button>
                <button
                  onClick={() => setUseLuxuryConfigurator(true)}
                  className={`px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-serif font-medium rounded-lg transition-all duration-300 ${
                    useLuxuryConfigurator 
                      ? 'bg-elysium-gold text-white shadow-lg' 
                      : 'bg-gray-100 text-[#6D3D0D]/70 hover:bg-gray-200'
                  }`}
                >
                  Premium
                </button>
              </div>

              {/* Configurator or Variants */}
              {useLuxuryConfigurator ? (
                <LuxuryProductConfigurator
                  product={product}
                  onConfigurationChange={(config) => {
                    if (config.metal) {
                      setSelectedMetal(config.metal);
                      setField("metal", config.metal.name);
                    }
                    if (config.size) {
                      setSelectedSize(config.size);
                      setField("ringSize", config.size);
                    }
                    if (config.engraving !== undefined) {
                      setEngravingText(config.engraving);
                      setField("engravingText", config.engraving);
                    }
                  }}
                />
              ) : (
                <CompactProductVariants
                  product={product}
                  selectedMetal={selectedMetal}
                  selectedOrigin={selectedOrigin}
                  selectedCarat={selectedCarat}
                  selectedColour={selectedColour}
                  selectedClarity={selectedClarity}
                  selectedSize={selectedSize}
                  engravingSelected={engravingSelected}
                  engravingText={engravingText}
                  onMetalChange={(v) => { setSelectedMetal(v); setField("metal", v?.name); }}
                  onOriginChange={(v) => { setSelectedOrigin(v); setField("origin", v?.label); }}
                  onCaratChange={(v) => { setSelectedCarat(v); setField("carat", v?.label); }}
                  onColourChange={(v) => { setSelectedColour(v); setField("colour", v?.label); }}
                  onClarityChange={(v) => { setSelectedClarity(v); setField("clarity", v?.label); }}
                  onSizeChange={(v) => { setSelectedSize(v); setField("ringSize", v || undefined); }}
                  onEngravingChange={(v) => { setEngravingSelected(v); setField("engravingOn", v); if(!v) setField("engravingText", ""); }}
                  onEngravingTextChange={(t) => { const s=t.slice(0,24); setEngravingText(s); setField("engravingText", s); }}
                  onMetalHover={(name)=> setPreviewMetalName(name)}
                />
              )}

              {/* Actions */}
              <div className="mt-6">
                <ProductActions
                  product={product}
                  isEntryLevel={isEntryLevel}
                  isNaturalDiamond={isNaturalDiamond}
                  onAddToBag={handleAddToBag}
                  canAddToBag={canAdd}
                />
              </div>

              {/* Share Build */}
              <div className="mt-6">
                <ShareBuild onShare={copyLink} />
              </div>

              {/* Description */}
              <div className="mt-12 pt-8 border-t border-[rgba(109,61,13,0.1)]">
                <h3 className="font-serif text-xl uppercase tracking-[0.08em] text-[#6D3D0D] mb-4">
                  Description
                </h3>
                <div className="font-serif text-[#6D3D0D]/80 leading-relaxed whitespace-pre-line">
                  {product.description}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Reviews */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductReviews productSlug={product.slug} />
      </div>

      {/* Recently Viewed */}
      <RecentlyViewed 
        current={{ 
          slug: product.slug, 
          name: product.title, 
          price: totalPrice, 
          imageSrc: product.images?.[0] 
        }} 
      />

      {/* Sticky Summary Bar */}
      <StickySummary
        name={product.title}
        priceFormatted={`£${totalPrice.toLocaleString()}`}
        selections={selections}
        canAdd={canAdd}
        onAdd={handleAddToBag}
        appointmentHref="/contact"
        isEntryLevel={isEntryLevel}
        isNaturalDiamond={isNaturalDiamond}
      />
      </main>
    </>
  );
}
