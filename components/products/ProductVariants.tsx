"use client";

import { Product, MetalOption, OriginOption, CaratOption, ColourOption, ClarityOption, CertOption } from "@/lib/productTypes";
import RingSizeGuide from "@/components/ui/RingSizeGuide";

interface ProductVariantsProps {
  product: Product;
  selectedMetal: MetalOption | null;
  selectedOrigin: OriginOption | null;
  selectedCarat: CaratOption | null;
  selectedColour: ColourOption | null;
  selectedClarity: ClarityOption | null;
  selectedCert: CertOption | null;
  selectedSize: string | null;
  engravingSelected: boolean;
  engravingText: string;
  onMetalChange: (metal: MetalOption | null) => void;
  onOriginChange: (origin: OriginOption | null) => void;
  onCaratChange: (carat: CaratOption | null) => void;
  onColourChange: (colour: ColourOption | null) => void;
  onClarityChange: (clarity: ClarityOption | null) => void;
  onCertChange: (cert: CertOption | null) => void;
  onSizeChange: (size: string | null) => void;
  onEngravingChange: (selected: boolean) => void;
  onEngravingTextChange: (text: string) => void;
  onMetalHover?: (metalName?: string) => void;
}

export function ProductVariants({
  product,
  selectedMetal,
  selectedOrigin,
  selectedCarat,
  selectedColour,
  selectedClarity,
  selectedCert,
  selectedSize,
  engravingSelected,
  engravingText,
  onMetalChange,
  onOriginChange,
  onCaratChange,
  onColourChange,
  onClarityChange,
  onCertChange,
  onSizeChange,
  onEngravingChange,
  onEngravingTextChange,
  onMetalHover,
}: ProductVariantsProps) {
  return (
    <div className="space-y-8">
      {/* Metal Selection */}
      {product.metals && product.metals.length > 0 && (
        <div>
          <h3 className="font-serif text-lg uppercase tracking-[0.08em] text-gray-900 mb-4">
            Metal
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {product.metals.map((metal) => {
              const active = selectedMetal?.name === metal.name;
              return (
                <button
                  key={metal.name}
                  onClick={() => onMetalChange(metal)}
                  onMouseEnter={() => onMetalHover?.(metal.name)}
                  onFocus={() => onMetalHover?.(metal.name)}
                  onMouseLeave={() => onMetalHover?.(undefined)}
                  aria-pressed={active}
                  className={`p-4 rounded-lg border-2 text-left transition-all duration-300 ${
                    active
                      ? "border-[#45321e] bg-[#45321e] text-white shadow-md"
                      : "border-gray-200 hover:border-[#45321e] hover:bg-[#45321e] hover:text-white hover:shadow-sm hover:scale-[1.02]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {metal.hex && (
                      <div
                        className="w-6 h-6 rounded-full border border-gray-200"
                        style={{ backgroundColor: metal.hex }}
                        aria-hidden="true"
                      />
                    )}
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">
                        {metal.name}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Origin Selection */}
      {product.origins && product.origins.length > 0 && (
        <div>
          <h3 className="font-serif text-lg uppercase tracking-[0.08em] text-gray-900 mb-4">
            Origin
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {product.origins.map((origin) => (
              <button
                key={origin.label}
                onClick={() => onOriginChange(origin)}
                className={`p-4 rounded-lg border-2 text-center transition-all duration-300 ${
                  selectedOrigin?.label === origin.label
                    ? "border-[#45321e] bg-[#45321e] text-white shadow-md"
                    : "border-gray-200 hover:border-[#45321e] hover:bg-[#45321e] hover:text-white hover:shadow-sm hover:scale-[1.02]"
                }`}
              >
                <div className="font-medium text-gray-900 text-sm">
                  {origin.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Carat Selection */}
      {product.carats && product.carats.length > 0 && (
        <div>
          <h3 className="font-serif text-lg uppercase tracking-[0.08em] text-gray-900 mb-4">
            Carat
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {product.carats.map((carat) => (
              <button
                key={carat.label}
                onClick={() => onCaratChange(carat)}
                className={`p-4 rounded-lg border-2 text-center transition-all duration-300 ${
                  selectedCarat?.label === carat.label
                    ? "border-[#45321e] bg-[#45321e] text-white shadow-md"
                    : "border-gray-200 hover:border-[#45321e] hover:bg-[#45321e] hover:text-white hover:shadow-sm hover:scale-[1.02]"
                }`}
              >
                <div className="font-medium text-gray-900 text-sm">
                  {carat.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Colour Selection */}
      {product.colours && product.colours.length > 0 && (
        <div>
          <h3 className="font-serif text-lg uppercase tracking-[0.08em] text-gray-900 mb-4">
            Colour
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {product.colours.map((colour) => (
              <button
                key={colour.label}
                onClick={() => onColourChange(colour)}
                className={`p-4 rounded-lg border-2 text-center transition-all duration-300 ${
                  selectedColour?.label === colour.label
                    ? "border-[#45321e] bg-[#45321e] text-white shadow-md"
                    : "border-gray-200 hover:border-[#45321e] hover:bg-[#45321e] hover:text-white hover:shadow-sm hover:scale-[1.02]"
                }`}
              >
                <div className="font-medium text-gray-900 text-sm">
                  {colour.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Clarity Selection */}
      {product.clarities && product.clarities.length > 0 && (
        <div>
          <h3 className="font-serif text-lg uppercase tracking-[0.08em] text-gray-900 mb-4">
            Clarity
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {product.clarities.map((clarity) => (
              <button
                key={clarity.label}
                onClick={() => onClarityChange(clarity)}
                className={`p-4 rounded-lg border-2 text-center transition-all duration-300 ${
                  selectedClarity?.label === clarity.label
                    ? "border-[#45321e] bg-[#45321e] text-white shadow-md"
                    : "border-gray-200 hover:border-[#45321e] hover:bg-[#45321e] hover:text-white hover:shadow-sm hover:scale-[1.02]"
                }`}
              >
                <div className="font-medium text-gray-900 text-sm">
                  {clarity.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Certificate Selection */}
      {product.certificates && product.certificates.length > 0 && (
        <div>
          <h3 className="font-serif text-lg uppercase tracking-[0.08em] text-gray-900 mb-4">
            Certificate
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {product.certificates.map((cert) => (
              <button
                key={cert.label}
                onClick={() => onCertChange(cert)}
                className={`p-4 rounded-lg border-2 text-center transition-all duration-300 ${
                  selectedCert?.label === cert.label
                    ? "border-[#45321e] bg-[#45321e] text-white shadow-md"
                    : "border-gray-200 hover:border-[#45321e] hover:bg-[#45321e] hover:text-white hover:shadow-sm hover:scale-[1.02]"
                }`}
              >
                <div className="font-medium text-gray-900 text-sm">
                  {cert.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Ring Size Selection */}
      {product.sizes && product.sizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg uppercase tracking-[0.08em] text-gray-900">
              Ring Size
            </h3>
            <RingSizeGuide />
          </div>
          <select
            value={selectedSize || ""}
            onChange={(e) => onSizeChange(e.target.value)}
            className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-[#45321e] focus:outline-none transition-all duration-300 hover:border-[#45321e] focus:ring-2 focus:ring-[#45321e]/20"
          >
            <option value="">Select size</option>
            {product.sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Engraving Selection */}
      {product.engravingFeeGBP && (
        <div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="engraving"
              checked={engravingSelected}
              onChange={(e) => onEngravingChange(e.target.checked)}
              className="w-5 h-5 text-[#45321e] border-gray-300 rounded focus:ring-[#45321e]"
            />
            <label htmlFor="engraving" className="font-serif text-lg uppercase tracking-[0.08em] text-gray-900">
              Engraving + £{product.engravingFeeGBP}
            </label>
          </div>
          {engravingSelected && (
            <div className="mt-3">
              <input
                type="text"
                value={engravingText}
                onChange={(e) => onEngravingTextChange(e.target.value)}
                placeholder={`Enter engraving text (max ${product.engravingMaxChars || 24} characters)`}
                maxLength={product.engravingMaxChars || 24}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-[#45321e] focus:outline-none transition-all duration-300 hover:border-[#45321e] focus:ring-2 focus:ring-[#45321e]/20"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
