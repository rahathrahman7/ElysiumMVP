"use client";

import { useState, useEffect } from "react";
import { Product } from "@/lib/products";
import { ProductVariants } from "./ProductVariants";
import { ProductActions } from "./ProductActions";
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

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedMetal, setSelectedMetal] = useState(product.metals?.[1] || null); // Default to 18k White Gold
  const [selectedOrigin, setSelectedOrigin] = useState(product.origins?.[0] || null); // Default to Natural (or null if no origins)
  const [selectedCarat, setSelectedCarat] = useState(product.carats?.[0] || null); // Default to 1ct (or null if no carats)
  const [selectedColour, setSelectedColour] = useState(product.colours?.[2] || null); // Default to F (or null if no colours)
  const [selectedClarity, setSelectedClarity] = useState(product.clarities?.[3] || null); // Default to VS1 (or null if no clarities)
  const [selectedCert, setSelectedCert] = useState(product.certificates?.[1] || null); // Default to IGI (or null if no certificates)
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[2] || null); // Default to L (or null if no sizes)
  const [engravingSelected, setEngravingSelected] = useState(false);
  const [engravingText, setEngravingText] = useState("");

  // hydrate from URL (URL wins), and keep URL in sync when local changes happen
  const { build, setField, copyLink } = useConfiguratorShare({
    origin: selectedOrigin?.label,
    carat: selectedCarat?.label,
    colour: selectedColour?.label,
    clarity: selectedClarity?.label,
    certificate: selectedCert?.label,
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
    if (build.certificate !== undefined) setSelectedCert(product.certificates?.find(c => c.label === build.certificate) || null);
    if (build.metal !== undefined) setSelectedMetal(product.metals?.find(m => m.name === build.metal) || null);
    if (build.ringSize !== undefined) setSelectedSize(build.ringSize);
    if (build.engravingOn !== undefined) setEngravingSelected(!!build.engravingOn);
    if (build.engravingText !== undefined) setEngravingText((build.engravingText||"").slice(0,24));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [build]);

  // Derive current gallery images based on selected metal or fallback to product.images
  const currentGalleryImages = resolveGallery(product, selectedMetal?.name).map(src => ({
    src,
    alt: product.title
  }));

  const totalPrice = product.basePriceGBP + 
    (selectedMetal?.priceDeltaGBP || 0) +
    (selectedOrigin?.priceDeltaGBP || 0) +
    (selectedCarat?.priceDeltaGBP || 0) + 
    (selectedColour?.priceDeltaGBP || 0) +
    (selectedClarity?.priceDeltaGBP || 0) +
    (selectedCert?.priceDeltaGBP || 0) +
    (engravingSelected ? (product.engravingFeeGBP || 0) : 0);

  // Prepare selections for StickySummary
  const selections = {
    origin: selectedOrigin?.label,
    carat: selectedCarat?.label,
    colour: selectedColour?.label,
    clarity: selectedClarity?.label,
    certificate: selectedCert?.label,
    metal: selectedMetal?.name,
    ringSize: selectedSize || undefined,
    engraving: engravingSelected ? "Yes" : null,
  };

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

  return (
    <main className="min-h-screen bg-white pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <Breadcrumb 
            items={[
              { label: 'Home', href: '/' },
              { label: 'Collection', href: '/products' },
              { label: product.title, href: `/products/${product.slug}`, current: true }
            ]}
          />
        </div>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Gallery */}
          <div className="order-2 lg:order-1">
            <Gallery 
              images={currentGalleryImages} 
            />
            <TrustStrip />
          </div>

          {/* Product Info */}
          <div className="order-1 lg:order-2">
            <div className="sticky top-8">
              {/* Quality Banner */}
              <div className="mb-6">
                <div className="inline-flex items-center px-3 py-1 bg-gray-50 border border-gray-200 rounded-full">
                  <span className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                    {product.qualityBanner}
                  </span>
                </div>
              </div>

              {/* Title & Blurb */}
              <div className="mb-8">
                <div className="relative">
                  <h1 className="font-serif text-4xl lg:text-5xl uppercase tracking-[0.12em] text-gray-900 mb-4 leading-tight">
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
              <div className="mb-8">
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-3xl lg:text-4xl text-gray-900">
                    £{totalPrice.toLocaleString()}
                  </span>
                  <span className="font-sans text-sm text-gray-600">
                    Base price: £{product.basePriceGBP.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Variants */}
              <ProductVariants
                product={product}
                selectedMetal={selectedMetal}
                selectedOrigin={selectedOrigin}
                selectedCarat={selectedCarat}
                selectedColour={selectedColour}
                selectedClarity={selectedClarity}
                selectedCert={selectedCert}
                selectedSize={selectedSize}
                engravingSelected={engravingSelected}
                engravingText={engravingText}
                onMetalChange={(v) => { setSelectedMetal(v); setField("metal", v?.name); }}
                onOriginChange={(v) => { setSelectedOrigin(v); setField("origin", v?.label); }}
                onCaratChange={(v) => { setSelectedCarat(v); setField("carat", v?.label); }}
                onColourChange={(v) => { setSelectedColour(v); setField("colour", v?.label); }}
                onClarityChange={(v) => { setSelectedClarity(v); setField("clarity", v?.label); }}
                onCertChange={(v) => { setSelectedCert(v); setField("certificate", v?.label); }}
                onSizeChange={(v) => { setSelectedSize(v); setField("ringSize", v || undefined); }}
                onEngravingChange={(v) => { setEngravingSelected(v); setField("engravingOn", v); if(!v) setField("engravingText", ""); }}
                onEngravingTextChange={(t) => { const s=t.slice(0,24); setEngravingText(s); setField("engravingText", s); }}
              />

              {/* Actions */}
              <ProductActions product={product} />

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
      />
    </main>
  );
}
