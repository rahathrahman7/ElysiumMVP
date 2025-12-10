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
  // Client requirement: Default to 18k Yellow Gold for all rings except men's rings
  const isMensRing = product.collections?.includes('mens-rings');
  const defaultMetalIndex = isMensRing ? 1 : 0; // Men's rings: Rose Gold, Others: Yellow Gold
  const [selectedMetal, setSelectedMetal] = useState(product.metals?.[defaultMetalIndex] || null);
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

  // Check if current config is entry-level (1ct, F, VS1, Lab-grown)
  const isEntryLevel = Boolean(
    selectedCarat?.label === '1ct' &&
    selectedColour?.label === 'F' &&
    selectedClarity?.label === 'VS1' &&
    selectedOrigin?.label !== 'Natural'
  );

  // Check if natural diamond is selected
  const isNaturalDiamond = selectedOrigin?.label === 'Natural';

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
                  <span className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                    {product.qualityBanner}
                  </span>
                </div>
              </div>

              {/* Title & Blurb */}
              <div className="mb-6 md:mb-8">
                <div className="relative">
                  <h1 className="font-serif text-2xl sm:text-3xl lg:text-5xl uppercase tracking-[0.08em] lg:tracking-[0.12em] text-gray-900 mb-3 md:mb-4 leading-tight">
                    {product.title}
                  </h1>
                  <WishHeart 
                    item={{ 
                      slug: product.slug, 
                      name: product.title, 
                      price: totalPrice, 
                      imageSrc: product.images?.[0] 
                    }} 
                    className="absolute right-0 top-0 text-neutral-600 hover:text-neutral-900" 
                  />
                </div>
                <p className="font-sans text-lg text-gray-700 leading-relaxed">
                  {product.blurb}
                </p>
              </div>

              {/* Price */}
              <div className="mb-6 md:mb-8">
                {isNaturalDiamond ? (
                  <div className="flex flex-col gap-1 md:gap-2">
                    <span className="font-serif text-xl md:text-2xl lg:text-3xl text-gray-900">
                      Price upon request
                    </span>
                    <span className="font-sans text-xs md:text-sm text-gray-600">
                      Natural diamonds require consultation for pricing
                    </span>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-2 md:gap-3">
                    <span className="font-serif text-2xl md:text-3xl lg:text-4xl text-gray-900">
                      £{totalPrice.toLocaleString()}
                    </span>
                    <span className="font-sans text-xs md:text-sm text-gray-600">
                      From £{product.basePriceGBP.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Configuration Toggle */}
              <div className="mb-4 md:mb-6 flex items-center justify-center space-x-2 md:space-x-4">
                <button
                  onClick={() => setUseLuxuryConfigurator(false)}
                  className={`px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium rounded-lg transition-all duration-300 ${
                    !useLuxuryConfigurator 
                      ? 'bg-elysium-gold text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Classic
                </button>
                <button
                  onClick={() => setUseLuxuryConfigurator(true)}
                  className={`px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium rounded-lg transition-all duration-300 ${
                    useLuxuryConfigurator 
                      ? 'bg-elysium-gold text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
              <ProductActions
                product={product}
                isEntryLevel={isEntryLevel}
                isNaturalDiamond={isNaturalDiamond}
                onAddToBag={handleAddToBag}
                canAddToBag={canAdd}
              />

              {/* Share Build */}
              <div className="mt-6">
                <ShareBuild onShare={copyLink} />
              </div>

              {/* Description */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="font-serif text-xl uppercase tracking-[0.08em] text-gray-900 mb-4">
                  Description
                </h3>
                <p className="font-sans text-gray-800 leading-relaxed">
                  {product.description}
                </p>
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
