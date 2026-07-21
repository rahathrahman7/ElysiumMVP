"use client";
import { BespokeFormData, ValidationErrors } from "../BespokeWizard";

interface BudgetStepProps {
  data: BespokeFormData;
  errors: ValidationErrors;
  onChange: (updates: Partial<BespokeFormData>) => void;
}

const budgetTiers = [
  {
    id: "3k-5k",
    range: "£3,000-£5,000",
    label: "Classic Elegance",
    description: "Solitaire engagement ring with quality stone",
    examples: ["Simple elegant design", "Quality craftsmanship"],
  },
  {
    id: "5k-10k",
    range: "£5,000-£10,000",
    label: "Enhanced Beauty",
    description: "Three-stone design or enhanced solitaire",
    examples: ["Larger center stone", "Intricate band details"],
    popular: true,
  },
  {
    id: "10k-25k",
    range: "£10,000-£25,000",
    label: "Luxury Statement",
    description: "Halo design or custom statement piece",
    examples: ["Premium stones", "Complex settings"],
  },
  {
    id: "25k-50k",
    range: "£25,000-£50,000",
    label: "Exceptional Creation",
    description: "Bespoke masterpiece with rare stones",
    examples: ["Rare stones", "Master artisan work"],
  },
  {
    id: "50k+",
    range: "£50,000+",
    label: "Ultimate Luxury",
    description: "Museum-quality craftsmanship",
    examples: ["Extraordinary gems", "Heirloom quality"],
  },
];

export function BudgetStep({ data, errors, onChange }: BudgetStepProps) {
  const charCount = data.briefVision ? data.briefVision.length : 0;
  const maxChars = 150;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-[#6D3D0D]/50 text-xs uppercase tracking-[0.3em] font-light">
          Step 2 of 4
        </span>
        <h2
          className="font-serif text-[#6D3D0D] mt-4"
          style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", letterSpacing: "-0.02em" }}
        >
          Your Budget & <span className="text-[#D4AF37]">Vision</span>
        </h2>
        <p
          className="text-[#6D3D0D]/75 font-light leading-relaxed mt-4 max-w-xl mx-auto"
          style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)" }}
        >
          Help us understand your investment level to recommend the perfect options for you.
        </p>
      </div>

      {/* Budget Tier Selector */}
      <div>
        <label className="block text-[#6D3D0D] text-sm font-light uppercase tracking-[0.1em] mb-4 text-center">
          Select Your Budget Range <span className="text-[#D4AF37]">*</span>
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {budgetTiers.map((tier) => (
            <button
              key={tier.id}
              type="button"
              onClick={() => onChange({ budgetTier: tier.id })}
              className={`relative p-6 border-2 transition-all duration-300 text-left group hover:border-[#D4AF37] hover:shadow-lg ${
                data.budgetTier === tier.id
                  ? "border-[#D4AF37] bg-[#D4AF37]/5 shadow-lg"
                  : "border-[#6D3D0D]/10 bg-white"
              }`}
              aria-pressed={data.budgetTier === tier.id}
            >
              {tier.popular && (
                <span className="absolute -top-2 left-4 bg-[#D4AF37] text-white text-xs px-3 py-1 uppercase tracking-wider font-light">
                  Popular
                </span>
              )}

              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-[#D4AF37] font-serif text-lg font-semibold mb-1">
                    {tier.range}
                  </div>
                  <div className="text-[#6D3D0D] font-medium text-sm">{tier.label}</div>
                </div>

                {/* Checkmark */}
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    data.budgetTier === tier.id
                      ? "border-[#D4AF37] bg-[#D4AF37]"
                      : "border-[#6D3D0D]/20 group-hover:border-[#D4AF37]/50"
                  }`}
                >
                  {data.budgetTier === tier.id && (
                    <svg
                      className="w-4 h-4 text-white"
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

              <p className="text-[#6D3D0D]/70 text-sm font-light mb-3">{tier.description}</p>

              <ul className="space-y-1">
                {tier.examples.map((example, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-[#6D3D0D]/60">
                    <span className="text-[#D4AF37] mt-0.5">•</span>
                    <span>{example}</span>
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        {errors.budgetTier && (
          <p className="mt-3 text-sm text-red-600 font-light text-center">{errors.budgetTier}</p>
        )}
      </div>

      {/* Brief Vision */}
      <div className="max-w-2xl mx-auto mt-12">
        <label
          htmlFor="briefVision"
          className="block text-[#6D3D0D] text-sm font-light uppercase tracking-[0.1em] mb-2"
        >
          Brief Vision <span className="text-[#6D3D0D]/40 text-xs normal-case">(Optional)</span>
        </label>
        <textarea
          id="briefVision"
          value={data.briefVision}
          onChange={(e) => onChange({ briefVision: e.target.value })}
          placeholder="Describe your dream piece in one sentence... (e.g., 'A timeless solitaire with a vintage-inspired band')"
          rows={3}
          maxLength={maxChars}
          className={`w-full px-4 py-3 bg-white border ${
            errors.briefVision ? "border-red-400" : "border-[#6D3D0D]/20"
          } text-[#6D3D0D] placeholder-[#6D3D0D]/40 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-300 text-base resize-none`}
          aria-describedby={errors.briefVision ? "vision-error" : "vision-hint"}
        />

        <div className="flex justify-between items-center mt-2">
          <p id="vision-hint" className="text-xs text-[#6D3D0D]/50 font-light">
            A brief description helps us prepare for your consultation
          </p>
          <span
            className={`text-xs font-light ${
              charCount > maxChars ? "text-red-600" : "text-[#6D3D0D]/50"
            }`}
          >
            {charCount}/{maxChars}
          </span>
        </div>

        {errors.briefVision && (
          <p id="vision-error" className="mt-2 text-sm text-red-600 font-light">
            {errors.briefVision}
          </p>
        )}
      </div>

      {/* Info Box */}
      <div className="max-w-2xl mx-auto mt-8 bg-gradient-to-br from-[#D4AF37]/5 to-[#D4AF37]/10 border border-[#D4AF37]/20 p-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p className="text-[#6D3D0D] text-sm font-medium mb-2">Budget Guidance</p>
            <p className="text-[#6D3D0D]/75 text-sm font-light leading-relaxed">
              Your budget is a guideline, not a constraint. During your consultation, we&apos;ll explore all
              possibilities and can adjust recommendations based on your preferences. All quotes are
              provided with transparent pricing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
