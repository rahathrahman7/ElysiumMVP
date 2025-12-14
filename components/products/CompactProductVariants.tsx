"use client";

import { useState } from "react";
import { Product, MetalOption, OriginOption, CaratOption, ColourOption, ClarityOption } from "@/lib/productTypes";
import RingSizeGuide from "@/components/ui/RingSizeGuide";
import MetalSwatch from "@/components/ui/MetalSwatch";

interface CompactProductVariantsProps {
  product: Product;
  selectedMetal: MetalOption | null;
  selectedOrigin: OriginOption | null;
  selectedCarat: CaratOption | null;
  selectedColour: ColourOption | null;
  selectedClarity: ClarityOption | null;
  selectedSize: string | null;
  engravingSelected: boolean;
  engravingText: string;
  onMetalChange: (metal: MetalOption | null) => void;
  onOriginChange: (origin: OriginOption | null) => void;
  onCaratChange: (carat: CaratOption | null) => void;
  onColourChange: (colour: ColourOption | null) => void;
  onClarityChange: (clarity: ClarityOption | null) => void;
  onSizeChange: (size: string | null) => void;
  onEngravingChange: (selected: boolean) => void;
  onEngravingTextChange: (text: string) => void;
  onMetalHover?: (metalName?: string) => void;
}

export function CompactProductVariants({
  product,
  selectedMetal,
  selectedOrigin,
  selectedCarat,
  selectedColour,
  selectedClarity,
  selectedSize,
  engravingSelected,
  engravingText,
  onMetalChange,
  onOriginChange,
  onCaratChange,
  onColourChange,
  onClarityChange,
  onSizeChange,
  onEngravingChange,
  onEngravingTextChange,
  onMetalHover,
}: CompactProductVariantsProps) {
  const [ringSizeExpanded, setRingSizeExpanded] = useState(false);

  // Diamond Tiers - All based on F Colour / VS1 Clarity as standard
  // Client requirement: All tiers use F/VS1 as baseline for pricing
  // For better colour (D, E) or clarity (IF, VVS1, VVS2) → Custom Specification
  const diamondTiers = product.carats && product.colours && product.clarities
    ? [
        // Tier 1: 1ct - Entry-Level (Buy Now)
        {
          id: 'entry',
          label: '1ct Centre | F Colour | VS1 Clarity',
          description: 'Direct purchase available',
          carat: product.carats.find(c => c.label === '1ct'),
          colour: product.colours.find(c => c.label === 'F'),
          clarity: product.clarities.find(c => c.label === 'VS1'),
          isEntryLevel: true,
        },
        // Tier 2: 1.5ct - F/VS1
        {
          id: 'premium',
          label: '1.5ct Centre | F Colour | VS1 Clarity',
          description: 'Consultation required',
          carat: product.carats.find(c => c.label === '1.5ct'),
          colour: product.colours.find(c => c.label === 'F'),
          clarity: product.clarities.find(c => c.label === 'VS1'),
          isEntryLevel: false,
        },
        // Tier 3: 2ct - F/VS1
        {
          id: 'luxury',
          label: '2ct Centre | F Colour | VS1 Clarity',
          description: 'Consultation required',
          carat: product.carats.find(c => c.label === '2ct'),
          colour: product.colours.find(c => c.label === 'F'),
          clarity: product.clarities.find(c => c.label === 'VS1'),
          isEntryLevel: false,
        },
        // Tier 4: 2.5ct - F/VS1
        {
          id: 'signature',
          label: '2.5ct Centre | F Colour | VS1 Clarity',
          description: 'Consultation required',
          carat: product.carats.find(c => c.label === '2.5ct'),
          colour: product.colours.find(c => c.label === 'F'),
          clarity: product.clarities.find(c => c.label === 'VS1'),
          isEntryLevel: false,
        },
        // Tier 5: 3ct - F/VS1
        {
          id: 'ultra',
          label: '3ct Centre | F Colour | VS1 Clarity',
          description: 'Consultation required',
          carat: product.carats.find(c => c.label === '3ct'),
          colour: product.colours.find(c => c.label === 'F'),
          clarity: product.clarities.find(c => c.label === 'VS1'),
          isEntryLevel: false,
        },
        // Tier 6: Custom - for better colour (D, E) or clarity (IF, VVS1, VVS2)
        {
          id: 'bespoke',
          label: 'Custom Specification',
          description: 'Bespoke Design - Different Colour - Different Clarity',
          carat: undefined,
          colour: undefined,
          clarity: undefined,
          isEntryLevel: false,
        },
      ].filter(tier =>
        // Only show tiers where all options exist in product data (or it's bespoke)
        tier.id === 'bespoke' || (tier.carat && tier.colour && tier.clarity)
      )
    : [];

  const currentDiamondTier = selectedCarat && selectedColour && selectedClarity
    ? diamondTiers.find(t =>
        t.carat?.label === selectedCarat.label &&
        t.colour?.label === selectedColour.label &&
        t.clarity?.label === selectedClarity.label
      )?.id || ''
    : '';

  const handleDiamondTierChange = (tierId: string) => {
    const tier = diamondTiers.find(t => t.id === tierId);
    if (tier && tier.carat && tier.colour && tier.clarity) {
      onCaratChange(tier.carat);
      onColourChange(tier.colour);
      onClarityChange(tier.clarity);
    }
  };

  return (
    <div className="space-y-6">
      {/* Metal Selection */}
      {product.metals && product.metals.length > 0 && (
        <div>
          <h3 className="font-serif text-xs uppercase tracking-[0.12em] text-[#6D3D0D]/80 mb-4 text-center">
            Ring Metal
          </h3>
          <div className="flex flex-wrap justify-center gap-6">
            {product.metals.map((metal) => (
              <MetalSwatch
                key={metal.name}
                metal={metal}
                isSelected={selectedMetal?.name === metal.name}
                onSelect={onMetalChange}
                onHover={onMetalHover}
                size="md"
                showLabel={true}
                groupName="compact-metal-selection"
                variant="circle"
              />
            ))}
          </div>
        </div>
      )}

      {/* Origin Selection - Compact */}
      {product.origins && product.origins.length > 0 && (
        <div>
          <h3 className="font-serif text-sm uppercase tracking-[0.08em] text-[#6D3D0D] mb-3">
            Origin
          </h3>
          <div className="flex gap-2">
            {[...product.origins].reverse().map((origin) => (
              <button
                key={origin.label}
                onClick={() => onOriginChange(origin)}
                className={`flex-1 px-3 py-2 rounded-lg border text-xs font-serif font-medium transition-all duration-200 ${
                  selectedOrigin?.label === origin.label
                    ? "border-[#753600] bg-[#753600] text-white"
                    : "border-gray-300 bg-white hover:border-[#753600] hover:bg-[#753600]/5"
                }`}
              >
                {origin.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Diamond Tiers - Simplified "Meet in the Middle" Approach */}
      {diamondTiers.length > 0 && (
        <div>
          <h3 className="font-serif text-sm uppercase tracking-[0.08em] text-[#6D3D0D] mb-3">
            Carat Size
          </h3>
          <div className="space-y-2">
            {diamondTiers.map((tier) => {
              const isActive = currentDiamondTier === tier.id;
              const totalDelta = tier.carat && tier.colour && tier.clarity
                ? (tier.carat.priceDeltaGBP || 0) + (tier.colour.priceDeltaGBP || 0) + (tier.clarity.priceDeltaGBP || 0)
                : 0;

              return (
                <button
                  key={tier.id}
                  onClick={() => tier.id === 'bespoke' ? window.location.href = '/contact' : handleDiamondTierChange(tier.id)}
                  className={`w-full px-4 py-3 rounded-lg border-2 text-left transition-all duration-200 ${
                    isActive
                      ? "border-[#753600] bg-[#753600] text-white"
                      : tier.id === 'bespoke'
                      ? "border-dashed border-gray-300 bg-gray-50 hover:border-[#753600] hover:bg-[#753600]/5"
                      : "border-gray-300 bg-white hover:border-[#753600] hover:bg-[#753600]/5"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className={`text-sm font-serif font-medium mb-1 ${isActive ? 'text-white' : 'text-[#6D3D0D]'}`}>
                        {tier.label}
                      </div>
                      {(() => {
                        // For natural diamonds above 1ct, show "Consultation required"
                        // For lab-grown, only show description for bespoke (custom spec)
                        // All other lab-grown tiers are direct purchase, so no consultation text
                        const isNatural = selectedOrigin?.label === 'Natural';
                        const isAbove1ct = tier.id !== 'entry'; // entry is 1ct
                        const isBespoke = tier.id === 'bespoke';
                        
                        if (isNatural && isAbove1ct) {
                          return (
                            <div className={`text-xs font-serif ${isActive ? 'text-white/70' : 'text-[#6D3D0D]'}`}>
                              Consultation required
                            </div>
                          );
                        }
                        
                        // For lab-grown: only show description for bespoke, otherwise show nothing (direct purchase)
                        if (!isNatural && !isBespoke) {
                          return null; // Lab-grown non-bespoke = direct purchase, no text needed
                        }
                        
                        return tier.description ? (
                          <div className={`text-xs font-serif ${isActive ? 'text-white/70' : 'text-[#6D3D0D]'}`}>
                            {tier.description}
                          </div>
                        ) : null;
                      })()}
                    </div>
                    <div className="text-right">
                      {(() => {
                        // New purchase flow logic:
                        // - Natural 1ct/F/VS1 → Buy Now (can purchase directly)
                        // - Natural anything else → Enquire (consultation required)
                        // - Lab Grown + standard tier (not bespoke) → Buy Now
                        // - Lab Grown + bespoke → Enquire
                        const isNatural = selectedOrigin?.label === 'Natural';
                        const isBespoke = tier.id === 'bespoke';
                        const is1ctTier = tier.id === 'entry'; // 1ct/F/VS1 tier
                        const showBuyNow = (isNatural && is1ctTier) || (!isNatural && !isBespoke);
                        
                        if (showBuyNow) {
                          return (
                            <span className={`inline-block px-2 py-1 text-xs font-serif font-medium rounded ${
                              isActive ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700'
                            }`}>
                              Buy Now
                            </span>
                          );
                        } else {
                          return (
                            <div>
                              <span className={`inline-block px-2 py-1 text-xs font-serif font-medium rounded ${
                                isActive ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'
                              }`}>
                                Enquire
                              </span>
                            </div>
                          );
                        }
                      })()}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs font-serif text-[#6D3D0D]/70">
            * Higher specifications require consultation for custom pricing and availability
          </p>
        </div>
      )}

      {/* Ring Size Selection - Collapsible */}
      {product.sizes && product.sizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-serif text-sm uppercase tracking-[0.08em] text-[#6D3D0D]">
              Ring Size
            </h3>
            <RingSizeGuide />
          </div>

          {/* Collapsed State - Show Selected or Select Button */}
          {!ringSizeExpanded && (
            <button
              onClick={() => setRingSizeExpanded(true)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-white hover:border-[#753600] hover:bg-[#753600]/5 text-left transition-all duration-200 flex items-center justify-between"
            >
              <span className="text-sm font-serif font-medium text-[#6D3D0D]">
                {selectedSize && selectedSize !== "unknown"
                  ? `Size ${selectedSize}`
                  : selectedSize === "unknown"
                  ? "I don't know my size"
                  : "Select your ring size"}
              </span>
              <svg className="w-4 h-4 text-[#6D3D0D]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}

          {/* Expanded State - Show Grid */}
          {ringSizeExpanded && (
            <>
              {/* Size Grid */}
              <div className="grid grid-cols-6 gap-2 mb-2">
                {product.sizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => {
                        onSizeChange(size);
                        setRingSizeExpanded(false);
                      }}
                      className={`px-2 py-2 rounded-lg border text-xs font-serif font-medium transition-all duration-200 ${
                        isSelected
                          ? "border-[#753600] bg-[#753600] text-white"
                          : "border-gray-300 bg-white hover:border-[#753600] hover:bg-[#753600]/5 text-[#6D3D0D]"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>

              {/* "I Don't Know My Size" Button */}
              <button
                onClick={() => {
                  onSizeChange("unknown");
                  setRingSizeExpanded(false);
                }}
                className={`w-full px-3 py-2.5 rounded-lg border-2 text-sm font-serif font-medium transition-all duration-200 ${
                  selectedSize === "unknown"
                    ? "border-[#753600] bg-[#753600] text-white"
                    : "border-gray-300 bg-white hover:border-[#753600] hover:bg-[#753600]/5 text-[#6D3D0D]"
                }`}
              >
                {selectedSize === "unknown" ? "✓ " : ""}I don't know my size
              </button>

              {/* Collapse Button */}
              <button
                onClick={() => setRingSizeExpanded(false)}
                className="w-full mt-2 px-3 py-2 text-xs font-serif text-[#6D3D0D]/70 hover:text-[#6D3D0D] transition-colors"
              >
                Collapse ↑
              </button>
            </>
          )}
        </div>
      )}

      {/* Engraving Selection - Compact */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="engraving"
            checked={engravingSelected}
            onChange={(e) => onEngravingChange(e.target.checked)}
            className="mt-0.5 w-4 h-4 text-[#753600] border-gray-300 rounded focus:ring-[#753600]"
          />
          <div className="flex-1">
            <label htmlFor="engraving" className="font-serif text-sm uppercase tracking-[0.08em] text-[#6D3D0D] cursor-pointer">
              Complimentary Engraving (Optional)
            </label>
            {engravingSelected && (
              <div className="mt-2">
                <input
                  type="text"
                  value={engravingText}
                  onChange={(e) => onEngravingTextChange(e.target.value)}
                  placeholder={`Enter text (max ${product.engravingMaxChars || 24} characters)`}
                  maxLength={product.engravingMaxChars || 24}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:border-[#753600] focus:outline-none transition-all duration-200 hover:border-[#753600]"
                />
                <p className="mt-1 text-xs font-serif text-[#6D3D0D]/70">
                  {engravingText.length}/{product.engravingMaxChars || 24} characters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
