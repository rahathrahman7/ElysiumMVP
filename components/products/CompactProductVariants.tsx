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
      {/* Metal Selection - Elegant Grouped Layout */}
      {product.metals && product.metals.length > 0 && (() => {
        // Separate solid metals from two-tone metals
        const solidMetals = product.metals.filter(m => !m.name.includes('/') && !m.name.toLowerCase().includes('two-tone'));
        const twoToneMetals = product.metals.filter(m => m.name.includes('/') || m.name.toLowerCase().includes('two-tone'));

        return (
          <div>
            <h3 className="font-serif text-[10px] font-medium uppercase tracking-[0.2em] text-[#6D3D0D] mb-5 text-center">
              Ring Metal
            </h3>

            {/* Solid Metals Row */}
            <div className="flex justify-center gap-7 mb-5">
              {solidMetals.map((metal) => (
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

            {/* Two-Tone Divider & Row */}
            {twoToneMetals.length > 0 && (
              <>
                <div className="flex items-center justify-center gap-4 mb-5">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#6D3D0D]/10" />
                  <span className="font-serif text-[9px] uppercase tracking-[0.2em] text-[#6D3D0D]">
                    Two-Tone
                  </span>
                  <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#6D3D0D]/10" />
                </div>
                <div className="flex justify-center gap-7">
                  {twoToneMetals.map((metal) => (
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
              </>
            )}
          </div>
        );
      })()}

      {/* Origin Selection - Elegant Underline Style */}
      {product.origins && product.origins.length > 0 && (
        <div>
          <h3 className="font-serif text-[10px] font-medium uppercase tracking-[0.2em] text-[#6D3D0D] mb-4">
            Origin
          </h3>
          <div className="flex gap-8 justify-center">
            {[...product.origins].reverse().map((origin) => {
              const isSelected = selectedOrigin?.label === origin.label;
              const isNatural = origin.label === 'Natural';
              return (
                <button
                  key={origin.label}
                  onClick={() => onOriginChange(origin)}
                  className={`relative pb-2 font-serif text-[13px] tracking-[0.15em] uppercase transition-all duration-200 ${
                    isSelected
                      ? "text-[#6D3D0D] font-medium"
                      : "text-[#6D3D0D]/50 hover:text-[#6D3D0D]/80"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {origin.label}
                    {/* Subtle enquire indicator for Natural */}
                    {isNatural && (
                      <span className="font-serif text-[9px] tracking-[0.05em] text-[#6D3D0D]/40 normal-case font-normal">
                        (enquire)
                      </span>
                    )}
                  </span>
                  {/* Underline indicator */}
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-[2px] transition-all duration-300 ${
                      isSelected
                        ? "bg-[#D4AF37]"
                        : "bg-transparent hover:bg-[#D4AF37]/30"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Diamond Tiers - Elegant Radio-Style Selection */}
      {diamondTiers.length > 0 && (
        <div>
          <h3 className="font-serif text-[10px] font-medium uppercase tracking-[0.2em] text-[#6D3D0D] mb-4">
            Carat Size
          </h3>
          <div className="space-y-3">
            {diamondTiers.map((tier) => {
              const isActive = currentDiamondTier === tier.id;
              const isBespoke = tier.id === 'bespoke';
              const isEntryTier = tier.id === 'entry'; // 1ct tier

              // Indicator copy rules:
              // - Lab Grown:
              //   - All standard tiers (including 1ct, 1.5ct, 2ct, 2.5ct) → "Purchase"
              //   - Custom Specification only → "Enquire"
              // - Natural:
              //   - All tiers → "Enquire"
              const isNatural = selectedOrigin?.label === 'Natural';
              const indicatorText =
                isNatural || isBespoke ? "Enquire" : "Purchase";

              // Format tier label with dots separator
              const formatLabel = () => {
                if (isBespoke) return null;
                const parts = tier.label.split(' | ');
                return parts.map((part, idx) => (
                  <span key={idx} className="inline-flex items-center">
                    {idx > 0 && <span className="mx-2 text-[#6D3D0D]/30">·</span>}
                    {part}
                  </span>
                ));
              };

              return (
                <button
                  key={tier.id}
                  onClick={() => isBespoke ? window.location.href = '/contact' : handleDiamondTierChange(tier.id)}
                  className={`w-full px-5 py-4 rounded text-left transition-all duration-250 flex items-center gap-4 ${
                    isActive
                      ? "border-[1.5px] border-[#D4AF37] bg-[#D4AF37]/[0.03] shadow-[0_2px_12px_rgba(212,175,55,0.1)]"
                      : isBespoke
                      ? "border border-dashed border-[#6D3D0D]/20 hover:border-[#6D3D0D]/40 hover:-translate-y-[1px]"
                      : "border border-dashed border-[#6D3D0D]/20 hover:border-solid hover:border-[#6D3D0D]/30 hover:-translate-y-[1px]"
                  }`}
                >
                  {/* Radio Indicator */}
                  <div
                    className={`flex-shrink-0 w-[18px] h-[18px] rounded-full border-[1.5px] transition-all duration-200 ${
                      isActive
                        ? "border-[#D4AF37] bg-[#D4AF37] shadow-[inset_0_0_0_4px_white]"
                        : "border-[#6D3D0D]/30"
                    }`}
                  />

                  {/* Content */}
                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <div className="flex-1">
                      {isBespoke ? (
                        <div className="flex items-center gap-2">
                          <span className="text-[#D4AF37]">✦</span>
                          <span className="font-serif text-[13px] tracking-[0.05em] text-[#6D3D0D]">
                            Custom Specification
                          </span>
                        </div>
                      ) : (
                        <div className="font-serif text-[13px] tracking-[0.05em] text-[#6D3D0D] flex flex-wrap items-center">
                          {formatLabel()}
                        </div>
                      )}
                    </div>

                    {/* Right-hand indicator label */}
                    <div className="flex-shrink-0 ml-4">
                      <span className="font-serif text-[11px] tracking-[0.1em] text-[#6D3D0D]/50 flex items-center gap-1 hover:text-[#D4AF37] transition-colors">
                        {indicatorText} <span className="text-[9px]">→</span>
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Ring Size Selection - Elegant Dropdown */}
      {product.sizes && product.sizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-[10px] font-medium uppercase tracking-[0.2em] text-[#6D3D0D]">
              Ring Size
            </h3>
            <RingSizeGuide />
          </div>

          {/* Collapsed State - Minimal Select */}
          {!ringSizeExpanded && (
            <button
              onClick={() => setRingSizeExpanded(true)}
              className="w-full px-4 py-[14px] rounded border border-[#6D3D0D]/15 bg-white hover:border-[#D4AF37] focus:border-[#D4AF37] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.1)] text-left transition-all duration-200 flex items-center justify-between"
            >
              <span className="font-serif text-[14px] tracking-[0.05em] text-[#6D3D0D]">
                {selectedSize && selectedSize !== "unknown"
                  ? `Size ${selectedSize}`
                  : selectedSize === "unknown"
                  ? "I don't know my size"
                  : "Select your ring size"}
              </span>
              <svg className="w-3 h-3 text-[#6D3D0D]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}

          {/* Expanded State - Refined Grid */}
          {ringSizeExpanded && (
            <div className="p-4 rounded border border-[#6D3D0D]/15 bg-white">
              {/* Size Grid */}
              <div className="grid grid-cols-6 gap-2 mb-3">
                {product.sizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => {
                        onSizeChange(size);
                        setRingSizeExpanded(false);
                      }}
                      className={`py-2.5 rounded border text-[12px] font-serif font-medium transition-all duration-200 ${
                        isSelected
                          ? "border-[#D4AF37] bg-[#D4AF37]/[0.05] text-[#6D3D0D]"
                          : "border-[#6D3D0D]/15 bg-white hover:border-[#D4AF37]/50 text-[#6D3D0D]"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>

              {/* "I Don't Know My Size" Option */}
              <button
                onClick={() => {
                  onSizeChange("unknown");
                  setRingSizeExpanded(false);
                }}
                className={`w-full px-3 py-2.5 rounded border text-[12px] font-serif transition-all duration-200 ${
                  selectedSize === "unknown"
                    ? "border-[#D4AF37] bg-[#D4AF37]/[0.05] text-[#6D3D0D]"
                    : "border-dashed border-[#6D3D0D]/15 bg-white hover:border-[#D4AF37]/50 text-[#6D3D0D]/70"
                }`}
              >
                {selectedSize === "unknown" && <span className="text-[#D4AF37] mr-1">✓</span>}
                I don't know my size
              </button>

              {/* Collapse */}
              <button
                onClick={() => setRingSizeExpanded(false)}
                className="w-full mt-3 text-[10px] font-serif uppercase tracking-[0.15em] text-[#6D3D0D]/50 hover:text-[#6D3D0D] transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>
      )}

      {/* Engraving Selection - Elegant Toggle Card */}
      <div className="pt-6">
        <button
          onClick={() => onEngravingChange(!engravingSelected)}
          className={`w-full px-5 py-4 rounded border text-left transition-all duration-200 ${
            engravingSelected
              ? "border-[#D4AF37] bg-[#D4AF37]/[0.03]"
              : "border-[#6D3D0D]/15 hover:border-[#6D3D0D]/30"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-[#6D3D0D]/60">✎</span>
              <div>
                <span className="font-serif text-[13px] tracking-[0.05em] text-[#6D3D0D]">
                  Complimentary Engraving
                </span>
                <p className="font-serif text-[11px] text-[#6D3D0D]/50 mt-0.5">
                  Add a personal message at no extra cost
                </p>
              </div>
            </div>
            {/* Toggle Switch */}
            <div
              className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
                engravingSelected ? "bg-[#D4AF37]" : "bg-[#6D3D0D]/20"
              }`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                  engravingSelected ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </div>
          </div>
        </button>

        {/* Engraving Input */}
        {engravingSelected && (
          <div className="mt-3 px-5">
            <input
              type="text"
              value={engravingText}
              onChange={(e) => onEngravingTextChange(e.target.value)}
              placeholder={`Enter text (max ${product.engravingMaxChars || 24} characters)`}
              maxLength={product.engravingMaxChars || 24}
              className="w-full px-4 py-3 border border-[#6D3D0D]/15 rounded text-[14px] font-serif focus:border-[#D4AF37] focus:outline-none focus:shadow-[0_0_0_3px_rgba(212,175,55,0.1)] transition-all duration-200"
            />
            <p className="mt-2 text-[10px] font-serif tracking-[0.1em] text-[#6D3D0D]/50 text-right">
              {engravingText.length}/{product.engravingMaxChars || 24}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
