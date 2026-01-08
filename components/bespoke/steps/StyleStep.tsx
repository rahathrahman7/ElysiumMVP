"use client";
import { BespokeFormData, ValidationErrors } from "../BespokeWizard";
import MetalSwatch from "@/components/ui/MetalSwatch";
import { MetalOption } from "@/lib/productTypes";

interface StyleStepProps {
  data: BespokeFormData;
  errors: ValidationErrors;
  onChange: (updates: Partial<BespokeFormData>) => void;
}

const styleCategories = [
  {
    id: "modern",
    label: "Modern",
    description: "Clean lines, contemporary design",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    id: "vintage",
    label: "Vintage",
    description: "Timeless elegance, classic details",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: "minimalist",
    label: "Minimalist",
    description: "Simple sophistication, understated",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: "ornate",
    label: "Ornate",
    description: "Intricate detailing, opulent",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
  },
  {
    id: "art-deco",
    label: "Art Deco",
    description: "Geometric, 1920s inspired",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
      </svg>
    ),
  },
  {
    id: "nature",
    label: "Nature-Inspired",
    description: "Organic forms, botanical motifs",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    ),
  },
];

const metalOptions: MetalOption[] = [
  {
    name: "18k Yellow Gold",
    imageUrl: "/icons/swatches/goldswatch.png",
    hex: "#D4AF37",
    priceModifier: 0,
  },
  {
    name: "18k Rose Gold",
    imageUrl: "/icons/swatches/rosegoldswatch.png",
    hex: "#B76E79",
    priceModifier: 0,
  },
  {
    name: "18k White Gold",
    imageUrl: "/icons/swatches/whitegoldswatch.png",
    hex: "#F5F5F5",
    priceModifier: 0,
  },
  {
    name: "Platinum",
    imageUrl: "/icons/swatches/platinumswatch.png",
    hex: "#E5E4E2",
    priceModifier: 500,
  },
  {
    name: "Two-Tone",
    imageUrl: "/icons/swatches/goldwhitegold.png",
    hex: "#D4AF37",
    priceModifier: 0,
  },
];

export function StyleStep({ data, errors, onChange }: StyleStepProps) {
  const toggleStyle = (styleId: string) => {
    const current = data.stylePreferences || [];
    const isSelected = current.includes(styleId);

    if (isSelected) {
      onChange({ stylePreferences: current.filter((s) => s !== styleId) });
    } else {
      if (current.length < 3) {
        onChange({ stylePreferences: [...current, styleId] });
      }
    }
  };

  const toggleMetal = (metalName: string) => {
    const current = data.metalPreferences || [];
    const isSelected = current.includes(metalName);

    if (isSelected) {
      onChange({ metalPreferences: current.filter((m) => m !== metalName) });
    } else {
      onChange({ metalPreferences: [...current, metalName] });
    }
  };

  const selectedStyleCount = data.stylePreferences ? data.stylePreferences.length : 0;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-[#6D3D0D]/50 text-xs uppercase tracking-[0.3em] font-light">
          Step 3 of 4
        </span>
        <h2
          className="font-serif text-[#6D3D0D] mt-4"
          style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", letterSpacing: "-0.02em" }}
        >
          Define Your <span className="text-[#D4AF37]">Style</span>
        </h2>
        <p
          className="text-[#6D3D0D]/75 font-light leading-relaxed mt-4 max-w-xl mx-auto"
          style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)" }}
        >
          Help us understand your aesthetic preferences to guide our design recommendations.
        </p>
      </div>

      {/* Style Categories */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="block text-[#6D3D0D] text-sm font-light uppercase tracking-[0.1em]">
            Style Categories <span className="text-[#D4AF37]">*</span>
            <span className="text-[#6D3D0D]/40 text-xs normal-case ml-2">(Select 1-3)</span>
          </label>
          <span className="text-xs text-[#6D3D0D]/60">
            {selectedStyleCount}/3 selected
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {styleCategories.map((style) => {
            const isSelected = data.stylePreferences?.includes(style.id) || false;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => toggleStyle(style.id)}
                disabled={!isSelected && selectedStyleCount >= 3}
                className={`relative p-5 border-2 transition-all duration-300 text-left group ${
                  isSelected
                    ? "border-[#D4AF37] bg-[#D4AF37]/5"
                    : "border-[#6D3D0D]/10 bg-white hover:border-[#D4AF37]/50"
                } ${!isSelected && selectedStyleCount >= 3 ? "opacity-40 cursor-not-allowed" : ""}`}
                aria-pressed={isSelected}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`${isSelected ? "text-[#D4AF37]" : "text-[#6D3D0D]/40 group-hover:text-[#D4AF37]"} transition-colors duration-300`}>
                    {style.icon}
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      isSelected
                        ? "border-[#D4AF37] bg-[#D4AF37]"
                        : "border-[#6D3D0D]/20"
                    }`}
                  >
                    {isSelected && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="3"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>

                <div className="text-[#6D3D0D] font-medium text-sm mb-1">{style.label}</div>
                <p className="text-[#6D3D0D]/60 text-xs font-light">{style.description}</p>
              </button>
            );
          })}
        </div>

        {errors.stylePreferences && (
          <p className="mt-3 text-sm text-red-600 font-light">{errors.stylePreferences}</p>
        )}
      </div>

      {/* Metal Preferences */}
      <div>
        <label className="block text-[#6D3D0D] text-sm font-light uppercase tracking-[0.1em] mb-4">
          Preferred Metals <span className="text-[#D4AF37]">*</span>
          <span className="text-[#6D3D0D]/40 text-xs normal-case ml-2">(Select at least 1)</span>
        </label>

        <div className="flex flex-wrap gap-6 justify-center">
          {metalOptions.map((metal) => {
            const isSelected = data.metalPreferences?.includes(metal.name) || false;
            return (
              <div key={metal.name} className="flex flex-col items-center">
                <MetalSwatch
                  metal={metal}
                  isSelected={isSelected}
                  onSelect={() => toggleMetal(metal.name)}
                  size="lg"
                  showLabel={true}
                  groupName="bespoke-metal-selection"
                />
              </div>
            );
          })}
        </div>

        {errors.metalPreferences && (
          <p className="mt-3 text-sm text-red-600 font-light text-center">{errors.metalPreferences}</p>
        )}
      </div>

      {/* Stone Preferences */}
      <div>
        <label className="block text-[#6D3D0D] text-sm font-light uppercase tracking-[0.1em] mb-4 text-center">
          Diamond Preference <span className="text-[#D4AF37]">*</span>
        </label>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {[
            {
              id: "natural",
              label: "Natural Diamond",
              description: "Earth-formed over billions of years",
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                </svg>
              ),
            },
            {
              id: "lab-grown",
              label: "Lab-Grown Diamond",
              description: "Ethically created, identical properties",
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
              ),
            },
            {
              id: "both",
              label: "Open to Both",
              description: "I'd like to explore all options",
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
            },
          ].map((stone) => {
            const isSelected = data.stonePreference === stone.id;
            return (
              <button
                key={stone.id}
                type="button"
                onClick={() => onChange({ stonePreference: stone.id as "natural" | "lab-grown" | "both" })}
                className={`relative p-5 border-2 transition-all duration-300 text-center group ${
                  isSelected
                    ? "border-[#D4AF37] bg-[#D4AF37]/5"
                    : "border-[#6D3D0D]/10 bg-white hover:border-[#D4AF37]/50"
                }`}
                aria-pressed={isSelected}
              >
                <div
                  className={`w-10 h-10 mx-auto mb-3 rounded-full flex items-center justify-center ${
                    isSelected ? "bg-[#D4AF37] text-white" : "bg-[#6D3D0D]/5 text-[#6D3D0D]/40 group-hover:text-[#D4AF37]"
                  } transition-colors duration-300`}
                >
                  {stone.icon}
                </div>

                <div className="text-[#6D3D0D] font-medium text-sm mb-2">{stone.label}</div>
                <p className="text-[#6D3D0D]/60 text-xs font-light">{stone.description}</p>

                {isSelected && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#D4AF37] flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="3"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {errors.stonePreference && (
          <p className="mt-3 text-sm text-red-600 font-light text-center">{errors.stonePreference}</p>
        )}
      </div>
    </div>
  );
}
