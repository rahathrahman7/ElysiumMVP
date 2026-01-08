"use client";
import { useState, useRef, useEffect } from "react";
import { ContactStep } from "./steps/ContactStep";
import { BudgetStep } from "./steps/BudgetStep";
import { StyleStep } from "./steps/StyleStep";
import { DetailsStep } from "./steps/DetailsStep";
import { BespokeSuccessModal } from "./BespokeSuccessModal";

export interface BespokeFormData {
  // Step 1: Contact
  name: string;
  email: string;
  phone: string;

  // Step 2: Budget & Vision
  budgetTier: string;
  briefVision: string;

  // Step 3: Style Preferences
  stylePreferences: string[];
  metalPreferences: string[];
  stonePreference: "natural" | "lab-grown" | "both" | "";

  // Step 4: Details & Inspiration
  detailedNotes: string;
  files: File[];
}

export interface ValidationErrors {
  [key: string]: string;
}

interface Step {
  id: number;
  label: string;
  shortLabel: string;
  description: string;
}

const steps: Step[] = [
  { id: 0, label: "About You", shortLabel: "Contact", description: "Tell us who you are" },
  { id: 1, label: "Budget & Vision", shortLabel: "Budget", description: "Share your investment range" },
  { id: 2, label: "Style Preferences", shortLabel: "Style", description: "Define your aesthetic" },
  { id: 3, label: "Details & Inspiration", shortLabel: "Details", description: "Add finishing touches" },
];

const initialFormData: BespokeFormData = {
  name: "",
  email: "",
  phone: "",
  budgetTier: "",
  briefVision: "",
  stylePreferences: [],
  metalPreferences: [],
  stonePreference: "",
  detailedNotes: "",
  files: [],
};

export function BespokeWizard() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<BespokeFormData>(initialFormData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("right");
  const [isAnimating, setIsAnimating] = useState(false);
  const stepContentRef = useRef<HTMLDivElement>(null);

  // Progress percentage
  const progressPercentage = ((activeStep + 1) / steps.length) * 100;

  const handleDataChange = (updates: Partial<BespokeFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    // Clear errors for updated fields
    setErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(updates).forEach((key) => delete newErrors[key]);
      return newErrors;
    });
  };

  const validateStep = (step: number): boolean => {
    const newErrors: ValidationErrors = {};

    switch (step) {
      case 0: // Contact
        if (!formData.name || formData.name.trim().length < 2) {
          newErrors.name = "Name must be at least 2 characters";
        }
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = "Please enter a valid email address";
        }
        break;

      case 1: // Budget
        if (!formData.budgetTier) {
          newErrors.budgetTier = "Please select a budget range";
        }
        if (formData.briefVision && formData.briefVision.length > 150) {
          newErrors.briefVision = "Brief vision must be 150 characters or less";
        }
        break;

      case 2: // Style
        if (formData.stylePreferences.length === 0) {
          newErrors.stylePreferences = "Please select at least one style";
        }
        if (formData.stylePreferences.length > 3) {
          newErrors.stylePreferences = "Please select no more than 3 styles";
        }
        if (formData.metalPreferences.length === 0) {
          newErrors.metalPreferences = "Please select at least one metal preference";
        }
        if (!formData.stonePreference) {
          newErrors.stonePreference = "Please select a stone preference";
        }
        break;

      case 3: // Details (all optional, only validate file constraints)
        if (formData.detailedNotes && formData.detailedNotes.length > 500) {
          newErrors.detailedNotes = "Detailed notes must be 500 characters or less";
        }
        // Validate files if present
        if (formData.files.length > 5) {
          newErrors.files = "Maximum 5 files allowed";
        }
        formData.files.forEach((file, index) => {
          if (file.size > 10 * 1024 * 1024) {
            newErrors[`file_${index}`] = `${file.name} is too large (max 10MB)`;
          }
          if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
            newErrors[`file_${index}`] = `${file.name} must be PNG or JPG`;
          }
        });
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const animateStepTransition = (direction: "left" | "right", callback: () => void) => {
    setSlideDirection(direction);
    setIsAnimating(true);
    
    // Brief delay for exit animation
    setTimeout(() => {
      callback();
      // Reset animation state after transition
      setTimeout(() => {
        setIsAnimating(false);
      }, 50);
    }, 200);
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      if (activeStep < steps.length - 1) {
        animateStepTransition("right", () => {
          setActiveStep((prev) => prev + 1);
        });
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrevious = () => {
    if (activeStep > 0) {
      animateStepTransition("left", () => {
        setActiveStep((prev) => prev - 1);
      });
    }
  };

  const handleStepClick = (stepIndex: number) => {
    // Only allow clicking on completed steps or the next step
    if (stepIndex < activeStep) {
      animateStepTransition(stepIndex < activeStep ? "left" : "right", () => {
        setActiveStep(stepIndex);
      });
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) return;

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone || "");
      formDataToSend.append("budgetTier", formData.budgetTier);
      formDataToSend.append("briefVision", formData.briefVision || "");
      formDataToSend.append("stylePreferences", JSON.stringify(formData.stylePreferences));
      formDataToSend.append("metalPreferences", JSON.stringify(formData.metalPreferences));
      formDataToSend.append("stonePreference", formData.stonePreference);
      formDataToSend.append("detailedNotes", formData.detailedNotes || "");

      // Append files
      formData.files.forEach((file) => {
        formDataToSend.append("files", file);
      });

      const res = await fetch("/api/bespoke", {
        method: "POST",
        body: formDataToSend,
      });

      if (res.ok) {
        setShowSuccessModal(true);
        // Clear form data
        setFormData(initialFormData);
        setActiveStep(0);
      } else {
        const data = await res.json();
        window.dispatchEvent(
          new CustomEvent("toast", {
            detail: { type: "error", text: data.error || "Failed to submit. Please try again." },
          })
        );
      }
    } catch (error) {
      window.dispatchEvent(
        new CustomEvent("toast", {
          detail: { type: "error", text: "Network error. Please try again." },
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    const commonProps = {
      data: formData,
      errors,
      onChange: handleDataChange,
    };

    switch (activeStep) {
      case 0:
        return <ContactStep {...commonProps} />;
      case 1:
        return <BudgetStep {...commonProps} />;
      case 2:
        return <StyleStep {...commonProps} />;
      case 3:
        return <DetailsStep {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto">
        {/* Enhanced Progress Indicator */}
        <div className="mb-12">
          {/* Progress Bar */}
          <div className="relative h-1 bg-[#6D3D0D]/10 rounded-full mb-8 overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#D4AF37] to-[#B8941F] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
            {/* Shimmer effect */}
            <div 
              className="absolute top-0 h-full w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
              style={{ left: `${progressPercentage - 10}%` }}
            />
          </div>

          {/* Step Indicators */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                {/* Step Circle */}
                <button
                  type="button"
                  onClick={() => handleStepClick(index)}
                  disabled={index > activeStep}
                  className={`relative flex flex-col items-center group ${
                    index <= activeStep ? "cursor-pointer" : "cursor-not-allowed"
                  }`}
                  aria-label={`Step ${index + 1}: ${step.label}`}
                  aria-current={index === activeStep ? "step" : undefined}
                >
                  <div
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-serif transition-all duration-500 ${
                      index < activeStep
                        ? "bg-[#D4AF37] text-white shadow-lg shadow-[#D4AF37]/20"
                        : index === activeStep
                        ? "bg-[#D4AF37] text-white ring-4 ring-[#D4AF37]/20 shadow-lg"
                        : "bg-white border-2 border-[#6D3D0D]/20 text-[#6D3D0D]/40"
                    } ${index < activeStep ? "group-hover:scale-110" : ""}`}
                  >
                    {index < activeStep ? (
                      <svg
                        className="w-6 h-6 md:w-7 md:h-7"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="2.5"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-base md:text-lg font-semibold">{index + 1}</span>
                    )}
                  </div>
                  
                  {/* Step Label */}
                  <div className="mt-3 text-center">
                    <span
                      className={`block text-xs md:text-sm font-medium transition-colors duration-300 ${
                        index === activeStep ? "text-[#D4AF37]" : index < activeStep ? "text-[#6D3D0D]" : "text-[#6D3D0D]/40"
                      }`}
                    >
                      <span className="hidden sm:inline">{step.label}</span>
                      <span className="inline sm:hidden">{step.shortLabel}</span>
                    </span>
                    {/* Description - only show on desktop for active step */}
                    {index === activeStep && (
                      <span className="hidden md:block text-xs text-[#6D3D0D]/50 mt-1 font-light">
                        {step.description}
                      </span>
                    )}
                  </div>
                </button>

                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-2 md:mx-4">
                    <div
                      className={`h-[2px] transition-all duration-500 ${
                        index < activeStep ? "bg-[#D4AF37]" : "bg-[#6D3D0D]/10"
                      }`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content with Animation */}
        <div 
          ref={stepContentRef}
          className={`min-h-[450px] transition-all duration-300 ease-out ${
            isAnimating 
              ? slideDirection === "right" 
                ? "opacity-0 translate-x-8" 
                : "opacity-0 -translate-x-8"
              : "opacity-100 translate-x-0"
          }`}
        >
          {renderStep()}
        </div>

        {/* Navigation Buttons - Enhanced */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-[#6D3D0D]/10">
          {/* Previous Button */}
          <button
            type="button"
            onClick={handlePrevious}
            disabled={activeStep === 0 || loading}
            className={`inline-flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 font-light tracking-[0.15em] uppercase text-sm transition-all duration-300 rounded-sm ${
              activeStep === 0 || loading
                ? "text-[#6D3D0D]/30 cursor-not-allowed"
                : "text-[#6D3D0D] hover:text-[#D4AF37] hover:bg-[#D4AF37]/5"
            }`}
            aria-label="Go to previous step"
          >
            <svg
              className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Previous</span>
          </button>

          {/* Step Counter (Mobile) */}
          <div className="text-[#6D3D0D]/50 text-sm font-light sm:hidden">
            Step {activeStep + 1} of {steps.length}
          </div>

          {/* Next/Submit Button - More Prominent */}
          <button
            type="button"
            onClick={handleNext}
            disabled={loading}
            className="inline-flex items-center gap-4 px-8 py-4 md:px-12 md:py-5 bg-[#6D3D0D] text-white font-light tracking-[0.2em] uppercase text-sm transition-all duration-500 hover:bg-[#D4AF37] hover:gap-6 group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            aria-label={activeStep === steps.length - 1 ? "Submit form" : "Go to next step"}
          >
            <span className="relative z-10">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Submitting...</span>
                </span>
              ) : activeStep === steps.length - 1 ? (
                "Submit Enquiry"
              ) : (
                "Continue"
              )}
            </span>
            {!loading && (
              <svg
                className="w-5 h-5 relative z-10 transition-transform duration-500 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          </button>
        </div>

        {/* No Obligation Reassurance */}
        {activeStep === steps.length - 1 && (
          <p className="text-center text-[#6D3D0D]/50 text-sm font-light mt-6 flex items-center justify-center gap-2">
            <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            No obligation – we're here to help bring your vision to life
          </p>
        )}
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <BespokeSuccessModal onClose={() => setShowSuccessModal(false)} />
      )}

      {/* Shimmer Animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
