"use client";
import { BespokeFormData, ValidationErrors } from "../BespokeWizard";
import { validateEmail } from "@/lib/validation/bespokeValidation";
import { useState, useEffect } from "react";

interface ContactStepProps {
  data: BespokeFormData;
  errors: ValidationErrors;
  onChange: (updates: Partial<BespokeFormData>) => void;
}

export function ContactStep({ data, errors, onChange }: ContactStepProps) {
  const [emailTouched, setEmailTouched] = useState(false);
  const [emailValid, setEmailValid] = useState(false);

  useEffect(() => {
    if (emailTouched && data.email) {
      setEmailValid(validateEmail(data.email));
    }
  }, [data.email, emailTouched]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-[#6D3D0D]/50 text-xs uppercase tracking-[0.3em] font-light">
          Step 1 of 4
        </span>
        <h2
          className="font-serif text-[#6D3D0D] mt-4"
          style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", letterSpacing: "-0.02em" }}
        >
          Let&apos;s Get <span className="text-[#D4AF37]">Acquainted</span>
        </h2>
        <p
          className="text-[#6D3D0D]/75 font-light leading-relaxed mt-4 max-w-xl mx-auto"
          style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)" }}
        >
          Share your contact details so we can begin crafting your perfect piece together.
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Name Field */}
        <div>
          <label
            htmlFor="name"
            className="block text-[#6D3D0D] text-sm font-light uppercase tracking-[0.1em] mb-2"
          >
            Your Name <span className="text-[#D4AF37]">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={data.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="Enter your full name"
            className={`w-full px-4 py-3 bg-white border ${
              errors.name ? "border-red-400" : "border-[#6D3D0D]/20"
            } text-[#6D3D0D] placeholder-[#6D3D0D]/40 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-300 text-base`}
            aria-invalid={!!errors.name}
            aria-required="true"
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <p id="name-error" className="mt-2 text-sm text-red-600 font-light">
              {errors.name}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-[#6D3D0D] text-sm font-light uppercase tracking-[0.1em] mb-2"
          >
            Email Address <span className="text-[#D4AF37]">*</span>
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => onChange({ email: e.target.value })}
              onBlur={() => setEmailTouched(true)}
              placeholder="your.email@example.com"
              className={`w-full px-4 py-3 bg-white border ${
                errors.email
                  ? "border-red-400"
                  : emailTouched && emailValid
                  ? "border-green-400"
                  : "border-[#6D3D0D]/20"
              } text-[#6D3D0D] placeholder-[#6D3D0D]/40 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-300 text-base pr-12`}
              aria-invalid={!!errors.email}
              aria-required="true"
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {emailTouched && emailValid && !errors.email && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
          {errors.email && (
            <p id="email-error" className="mt-2 text-sm text-red-600 font-light">
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone Field */}
        <div>
          <label
            htmlFor="phone"
            className="block text-[#6D3D0D] text-sm font-light uppercase tracking-[0.1em] mb-2"
          >
            Phone Number <span className="text-[#6D3D0D]/40 text-xs normal-case">(Optional)</span>
          </label>
          <input
            id="phone"
            type="tel"
            value={data.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="+44 7XXX XXXXXX"
            className="w-full px-4 py-3 bg-white border border-[#6D3D0D]/20 text-[#6D3D0D] placeholder-[#6D3D0D]/40 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-300 text-base"
          />
          <p className="mt-2 text-xs text-[#6D3D0D]/50 font-light">
            We&apos;ll use this to coordinate your consultation appointment.
          </p>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="mt-12 pt-8 border-t border-[#6D3D0D]/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="flex items-start gap-3">
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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div>
              <p className="text-[#6D3D0D] text-sm font-medium">Privacy Protected</p>
              <p className="text-[#6D3D0D]/60 text-xs font-light mt-1">
                Your information is secure
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
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
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-[#6D3D0D] text-sm font-medium">24hr Response</p>
              <p className="text-[#6D3D0D]/60 text-xs font-light mt-1">
                We&apos;ll respond within one business day
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-[#6D3D0D] text-sm font-medium">No Obligation</p>
              <p className="text-[#6D3D0D]/60 text-xs font-light mt-1">
                Free consultation, no commitment
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
