"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Product } from '@/lib/productTypes';
import clsx from 'clsx';

interface ConfiguratorProps {
  product: Product;
  onConfigurationChange?: (config: ProductConfiguration) => void;
}

interface ProductConfiguration {
  metal: MetalOption;
  stone?: StoneOption;
  cut?: CutOption;
  size: string;
  engraving?: string;
  totalPrice: number;
}

interface MetalOption {
  id: string;
  name: string;
  price: number;
  color: string;
  description: string;
  popular?: boolean;
}

interface StoneOption {
  id: string;
  name: string;
  carat: number;
  cut: string;
  clarity: string;
  color: string;
  price: number;
  certification: string;
}

interface CutOption {
  id: string;
  name: string;
  description: string;
  priceModifier: number;
  imageUrl: string;
}

// Mock data - replace with your actual data
const metalOptions: MetalOption[] = [
  { 
    id: 'platinum', 
    name: 'Platinum', 
    price: 500, 
    color: '#8A9BA8', 
    description: 'Pure, hypoallergenic, eternal',
    popular: true 
  },
  { 
    id: '18k-gold', 
    name: '18K Gold', 
    price: 300, 
    color: '#D4AF37', 
    description: 'Classic luxury, timeless appeal' 
  },
  { 
    id: '18k-rose', 
    name: '18K Rose Gold', 
    price: 350, 
    color: '#E8B4B8', 
    description: 'Modern romance, distinctive warmth' 
  },
  { 
    id: '18k-white', 
    name: '18K White Gold', 
    price: 320, 
    color: '#F8F8F8', 
    description: 'Contemporary elegance, versatile luxury' 
  },
];

const cutOptions: CutOption[] = [
  {
    id: 'round',
    name: 'Round Brilliant',
    description: 'Maximum brilliance and fire',
    priceModifier: 0,
    imageUrl: '/icons/cuts/round.svg'
  },
  {
    id: 'princess',
    name: 'Princess Cut',
    description: 'Modern square elegance',
    priceModifier: -200,
    imageUrl: '/icons/cuts/princess.svg'
  },
  {
    id: 'emerald',
    name: 'Emerald Cut',
    description: 'Vintage sophistication',
    priceModifier: -100,
    imageUrl: '/icons/cuts/emerald.svg'
  },
  {
    id: 'oval',
    name: 'Oval Cut',
    description: 'Elongated brilliance',
    priceModifier: 100,
    imageUrl: '/icons/cuts/oval.svg'
  },
];

const sizeOptions = ['4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10'];

export default function LuxuryProductConfigurator({ product, onConfigurationChange }: ConfiguratorProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [configuration, setConfiguration] = useState<ProductConfiguration>({
    metal: metalOptions[0],
    cut: cutOptions[0],
    size: '6',
    totalPrice: product.basePriceGBP
  });
  
  const [showARPreview, setShowARPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const steps = [
    { id: 'metal', label: 'Metal', icon: '💍' },
    { id: 'cut', label: 'Cut', icon: '💎' },
    { id: 'size', label: 'Size', icon: '📏' },
    { id: 'personalize', label: 'Personalize', icon: '✨' }
  ];

  useEffect(() => {
    const newPrice = (product.basePriceGBP) + 
                     configuration.metal.price + 
                     (configuration.cut?.priceModifier || 0);
    
    // Only update if price actually changed to prevent infinite loop
    if (configuration.totalPrice !== newPrice) {
      setConfiguration(prev => ({ ...prev, totalPrice: newPrice }));
    }
  }, [configuration.metal.id, configuration.metal.price, configuration.cut?.id, configuration.cut?.priceModifier, product.basePriceGBP]);

  // Separate effect for calling onConfigurationChange to avoid dependency issues
  useEffect(() => {
    onConfigurationChange?.(configuration);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configuration.metal.id, configuration.cut?.id, configuration.size, configuration.engraving, configuration.totalPrice]);

  const handleMetalSelection = (metal: MetalOption) => {
    setConfiguration(prev => ({ ...prev, metal }));
  };

  const handleCutSelection = (cut: CutOption) => {
    setConfiguration(prev => ({ ...prev, cut }));
  };

  const handleSizeSelection = (size: string) => {
    setConfiguration(prev => ({ ...prev, size }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleARPreview = () => {
    setIsLoading(true);
    setTimeout(() => {
      setShowARPreview(true);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="luxury-glass rounded-3xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-[#753600] p-6">
        <div className="flex items-center justify-between">
          <h3 className="luxury-h2 text-white">Design Your Ring</h3>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleARPreview}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-elysium-gold hover:bg-amber-500 text-white rounded-xl font-medium tracking-wide transition-all duration-300 hover:scale-105 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
              <span className="text-sm">AR Preview</span>
            </button>
            <div className="text-white text-right">
              <div className="text-2xl font-light">{formatPrice(configuration.totalPrice)}</div>
              <div className="text-xs text-white/70">Starting price</div>
            </div>
          </div>
        </div>

        {/* Step Progress */}
        <div className="flex items-center justify-between mt-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => setActiveStep(index)}
                className={clsx(
                  "flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300",
                  index === activeStep
                    ? "bg-elysium-gold text-white shadow-lg"
                    : index < activeStep
                    ? "bg-white/20 text-white hover:bg-white/30"
                    : "bg-white/10 text-white/60 hover:bg-white/20"
                )}
              >
                <span className="text-lg">{step.icon}</span>
                <span className="text-sm font-medium">{step.label}</span>
              </button>
              {index < steps.length - 1 && (
                <div className={clsx(
                  "w-8 h-px mx-2 transition-colors duration-300",
                  index < activeStep ? "bg-elysium-gold" : "bg-white/20"
                )} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Configuration Content */}
      <div className="p-6 bg-[#f5f5dc] min-h-[400px]">
        {/* Step 0: Metal Selection */}
        {activeStep === 0 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h4 className="luxury-h3 text-elysium-obsidian mb-2">Choose Your Metal</h4>
              <p className="text-elysium-smoke">Each metal brings its own character and beauty to your ring</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {metalOptions.map((metal) => (
                <button
                  key={metal.id}
                  onClick={() => handleMetalSelection(metal)}
                  className={clsx(
                    "relative p-6 rounded-2xl border-2 transition-all duration-300 text-left group",
                    configuration.metal.id === metal.id
                      ? "border-elysium-gold bg-elysium-gold/10 ring-4 ring-elysium-gold/20"
                      : "border-elysium-whisper bg-white hover:border-elysium-gold/50 hover:shadow-lg"
                  )}
                >
                  {metal.popular && (
                    <span className="absolute -top-2 -right-2 px-3 py-1 bg-elysium-gold text-white text-xs font-medium rounded-full">
                      Popular
                    </span>
                  )}
                  
                  <div className="flex items-center space-x-4 mb-3">
                    <div 
                      className="w-12 h-12 rounded-full border-4 border-white shadow-lg"
                      style={{ backgroundColor: metal.color }}
                    />
                    <div>
                      <h5 className="font-semibold text-elysium-obsidian">{metal.name}</h5>
                      <p className="text-sm text-elysium-smoke">+{formatPrice(metal.price)}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-elysium-smoke group-hover:text-elysium-charcoal transition-colors">
                    {metal.description}
                  </p>
                  
                  {configuration.metal.id === metal.id && (
                    <div className="absolute inset-0 rounded-2xl bg-elysium-gold/10 pointer-events-none" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Cut Selection */}
        {activeStep === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h4 className="luxury-h3 text-elysium-obsidian mb-2">Select Your Cut</h4>
              <p className="text-elysium-smoke">The cut determines how your diamond reflects light and sparkles</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {cutOptions.map((cut) => (
                <button
                  key={cut.id}
                  onClick={() => handleCutSelection(cut)}
                  className={clsx(
                    "p-6 rounded-2xl border-2 transition-all duration-300 text-center group hover:scale-105",
                    configuration.cut?.id === cut.id
                      ? "border-elysium-gold bg-elysium-gold/10 ring-4 ring-elysium-gold/20"
                      : "border-elysium-whisper bg-white hover:border-elysium-gold/50 hover:shadow-lg"
                  )}
                >
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Image
                      src={cut.imageUrl}
                      alt={cut.name}
                      width={48}
                      height={48}
                      className="transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  
                  <h5 className="font-semibold text-elysium-obsidian mb-1">{cut.name}</h5>
                  <p className="text-xs text-elysium-smoke mb-2">{cut.description}</p>
                  
                  {cut.priceModifier !== 0 && (
                    <p className="text-sm font-medium text-elysium-gold">
                      {cut.priceModifier > 0 ? '+' : ''}{formatPrice(cut.priceModifier)}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Size Selection */}
        {activeStep === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h4 className="luxury-h3 text-elysium-obsidian mb-2">Choose Ring Size</h4>
              <p className="text-elysium-smoke">Select your ring size or measure at home with our sizing guide</p>
            </div>

            <div className="max-w-md mx-auto">
              <div className="grid grid-cols-4 gap-3 mb-6">
                {sizeOptions.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSizeSelection(size)}
                    className={clsx(
                      "p-4 rounded-xl border-2 transition-all duration-300 font-medium hover:scale-105",
                      configuration.size === size
                        ? "border-elysium-gold bg-elysium-gold text-white"
                        : "border-elysium-whisper bg-white hover:border-elysium-gold/50"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>

              <div className="bg-white p-6 rounded-2xl border border-elysium-whisper">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-semibold text-elysium-obsidian">Need help with sizing?</h5>
                  <svg className="w-5 h-5 text-elysium-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                
                <div className="space-y-3 text-sm text-elysium-smoke">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-elysium-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Free ring sizer kit available</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-elysium-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>90-day free resizing guarantee</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-elysium-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Expert fitting consultation available</span>
                  </div>
                </div>
                
                <button className="mt-4 w-full py-2 px-4 bg-elysium-gold/10 text-elysium-gold rounded-xl hover:bg-elysium-gold/20 transition-colors duration-300 font-medium text-sm">
                  Download Size Guide
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Personalization */}
        {activeStep === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h4 className="luxury-h3 text-elysium-obsidian mb-2">Add Personal Touch</h4>
              <p className="text-elysium-smoke">Make this ring uniquely yours with custom engraving</p>
            </div>

            <div className="max-w-lg mx-auto space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-elysium-whisper">
                <label className="block text-sm font-medium text-elysium-obsidian mb-3">
                  Custom Engraving (Optional)
                </label>
                <textarea
                  placeholder="Enter your personal message, date, or initials..."
                  value={configuration.engraving || ''}
                  onChange={(e) => setConfiguration(prev => ({ ...prev, engraving: e.target.value }))}
                  className="w-full h-24 px-4 py-3 border border-elysium-whisper rounded-xl focus:ring-2 focus:ring-elysium-gold focus:border-transparent resize-none luxury-body"
                  maxLength={50}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-elysium-smoke">
                    {(configuration.engraving || '').length}/50 characters
                  </span>
                  <span className="text-xs text-elysium-gold font-medium">
                    Free engraving
                  </span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-elysium-whisper">
                <h5 className="font-semibold text-elysium-obsidian mb-4">Gift Packaging Options</h5>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input type="radio" name="packaging" value="standard" className="text-elysium-gold" defaultChecked />
                    <div>
                      <div className="font-medium text-elysium-obsidian">ELYSIUM Signature Box</div>
                      <div className="text-sm text-elysium-smoke">Luxury presentation box with care instructions</div>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="radio" name="packaging" value="premium" className="text-elysium-gold" />
                    <div>
                      <div className="font-medium text-elysium-obsidian">Premium Gift Set</div>
                      <div className="text-sm text-elysium-smoke">Includes jewelry care kit and certificate (+£75)</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-elysium-whisper">
          <button
            onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
            disabled={activeStep === 0}
            className={clsx(
              "flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300",
              activeStep === 0
                ? "text-elysium-smoke cursor-not-allowed"
                : "text-elysium-charcoal hover:text-elysium-gold hover:bg-elysium-gold/5"
            )}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Previous</span>
          </button>

          {activeStep < steps.length - 1 ? (
            <button
              onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
              className="flex items-center space-x-2 px-8 py-3 bg-elysium-gold text-white rounded-xl font-medium tracking-wide hover:scale-105 transition-all duration-300"
            >
              <span>Next Step</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button className="flex items-center space-x-2 px-8 py-3 bg-green-600 text-white rounded-xl font-medium tracking-wide hover:scale-105 transition-all duration-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6" />
              </svg>
              <span>Add to Cart</span>
            </button>
          )}
        </div>
      </div>

      {/* AR Preview Modal */}
      {showARPreview && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-elysium-whisper flex items-center justify-between">
              <h3 className="luxury-h3">AR Preview</h3>
              <button
                onClick={() => setShowARPreview(false)}
                className="p-2 hover:bg-elysium-gold/10 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="aspect-video bg-[#f5f5dc] rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 bg-elysium-gold/20 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-elysium-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="luxury-h3 mb-2">AR Experience Coming Soon</h4>
                  <p className="text-elysium-smoke">
                    See your customized {product.title} in augmented reality on your hand
                  </p>
                  <button className="mt-4 px-6 py-3 bg-elysium-gold text-white rounded-xl font-medium hover:bg-amber-500 transition-colors">
                    Enable Camera Access
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
