"use client";
import { BespokeFormData, ValidationErrors } from "../BespokeWizard";
import { FileUploadZone } from "../FileUploadZone";

interface DetailsStepProps {
  data: BespokeFormData;
  errors: ValidationErrors;
  onChange: (updates: Partial<BespokeFormData>) => void;
}

export function DetailsStep({ data, errors, onChange }: DetailsStepProps) {
  const charCount = data.detailedNotes ? data.detailedNotes.length : 0;
  const maxChars = 500;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-[#6D3D0D]/50 text-xs uppercase tracking-[0.3em] font-light">
          Step 4 of 4
        </span>
        <h2
          className="font-serif text-[#6D3D0D] mt-4"
          style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", letterSpacing: "-0.02em" }}
        >
          Share Your <span className="text-[#D4AF37]">Inspiration</span>
        </h2>
        <p
          className="text-[#6D3D0D]/75 font-light leading-relaxed mt-4 max-w-xl mx-auto"
          style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)" }}
        >
          Tell us more about your vision and share any images that inspire you.
        </p>
      </div>

      {/* Detailed Notes */}
      <div className="max-w-2xl mx-auto">
        <label
          htmlFor="detailedNotes"
          className="block text-[#6D3D0D] text-sm font-light uppercase tracking-[0.1em] mb-2"
        >
          Detailed Description{" "}
          <span className="text-[#6D3D0D]/40 text-xs normal-case">(Optional)</span>
        </label>
        <textarea
          id="detailedNotes"
          value={data.detailedNotes}
          onChange={(e) => onChange({ detailedNotes: e.target.value })}
          placeholder="Share any additional details about your vision...&#10;&#10;• Ring size if known&#10;• Specific design elements you love&#10;• Any concerns or requirements&#10;• Timeline preferences&#10;• Sentimental details to incorporate"
          rows={8}
          maxLength={maxChars}
          className={`w-full px-4 py-3 bg-white border ${
            errors.detailedNotes ? "border-red-400" : "border-[#6D3D0D]/20"
          } text-[#6D3D0D] placeholder-[#6D3D0D]/40 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-300 text-base resize-none`}
          aria-describedby={errors.detailedNotes ? "notes-error" : "notes-hint"}
        />

        <div className="flex justify-between items-center mt-2">
          <p id="notes-hint" className="text-xs text-[#6D3D0D]/50 font-light">
            The more details you share, the better we can prepare for your consultation
          </p>
          <span
            className={`text-xs font-light ${
              charCount > maxChars ? "text-red-600" : "text-[#6D3D0D]/50"
            }`}
          >
            {charCount}/{maxChars}
          </span>
        </div>

        {errors.detailedNotes && (
          <p id="notes-error" className="mt-2 text-sm text-red-600 font-light">
            {errors.detailedNotes}
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="flex items-center justify-center gap-4 max-w-2xl mx-auto">
        <div className="h-[1px] flex-1 bg-[#6D3D0D]/10"></div>
        <span className="text-xs text-[#6D3D0D]/40 uppercase tracking-wider">Or</span>
        <div className="h-[1px] flex-1 bg-[#6D3D0D]/10"></div>
      </div>

      {/* File Upload */}
      <div className="max-w-2xl mx-auto">
        <label className="block text-[#6D3D0D] text-sm font-light uppercase tracking-[0.1em] mb-2">
          Inspiration Images{" "}
          <span className="text-[#6D3D0D]/40 text-xs normal-case">(Optional)</span>
        </label>
        <p className="text-xs text-[#6D3D0D]/60 font-light mb-4">
          Upload photos from Pinterest, Instagram, or any images that capture your style
        </p>

        <FileUploadZone
          files={data.files || []}
          onChange={(files) => onChange({ files })}
          maxFiles={5}
          maxSizeMB={10}
          errors={errors}
        />
      </div>

      {/* Tips Section */}
      <div className="max-w-2xl mx-auto mt-10 bg-white border border-[#6D3D0D]/10 p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-8 h-8 bg-[#D4AF37]/10 rounded-full flex items-center justify-center flex-shrink-0">
            <svg
              className="w-4 h-4 text-[#D4AF37]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <div>
            <p className="text-[#6D3D0D] text-sm font-medium mb-2">
              Inspiration Guide
            </p>
            <ul className="space-y-2 text-sm text-[#6D3D0D]/75 font-light">
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] mt-0.5">•</span>
                <span>Include multiple angles if you have a specific design in mind</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] mt-0.5">•</span>
                <span>Show details you love (setting style, band width, prong shape, etc.)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] mt-0.5">•</span>
                <span>Mix and match features from different pieces</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] mt-0.5">•</span>
                <span>Don&apos;t worry about perfection—we&apos;ll refine together</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Ready Indicator */}
      <div className="text-center mt-12 pt-8 border-t border-[#6D3D0D]/10">
        <div className="max-w-lg mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 bg-[#D4AF37]/10 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-[#D4AF37]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
              />
            </svg>
          </div>
          <h3 className="font-serif text-[#6D3D0D] text-xl mb-2">Ready to Submit</h3>
          <p className="text-[#6D3D0D]/75 text-sm font-light leading-relaxed">
            Click Submit to send your enquiry. We&apos;ll review your details and reach out within 24 hours
            to schedule your personal consultation.
          </p>
        </div>
      </div>
    </div>
  );
}
